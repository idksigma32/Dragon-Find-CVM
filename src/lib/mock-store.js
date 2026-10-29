"use client";

import { useEffect, useState } from "react";
import { demoItems } from "@/lib/demo-data";
import { canEditItem, findDuplicateReports, findMatches, isPublicItem } from "@/lib/mock-domain.mjs";

const KEY = "findit-mock-v2";
const EVENT = "findit-data-changed";
const now = () => new Date().toISOString();
const id = () => crypto.randomUUID();

export function createInitialData() {
  const created = demoItems.map((item) => ({
    ...item, image_url: "", status: "open", owner: "student-demo",
    history: [{ text: "Report created", date: item.created_at }]
  }));
  return {
    items: created,
    claims: [],
    profile: { displayName: "Demo Student", email: "student@example.edu", school: "FindIt Demo School", memberSince: "2025-09-01" },
    settings: { notifications: true, matchAlerts: true, sidebarExpanded: true, reducedMotion: false, highContrast: false },
    notifications: [
      { id: id(), title: "Welcome to FindIt", message: "Browse reports and help reunite your school community.", read: false, created_at: now(), type: "welcome" }
    ],
    saved: [], recent: [], activity: created.map((item) => ({
      id: id(), type: "report", title: `${item.title} was reported`, message: `${item.item_type === "lost" ? "Lost" : "Found"} near ${item.location}.`, created_at: item.created_at
    })),
    inventory: [], moderation: [], archived: []
  };
}

export function readData() {
  if (typeof window === "undefined") return createInitialData();
  try {
    const saved = localStorage.getItem(KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    const initial = createInitialData();
    return {
      ...initial,
      ...parsed,
      items: Array.isArray(parsed.items) ? parsed.items : initial.items,
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : initial.notifications,
      activity: Array.isArray(parsed.activity) ? parsed.activity : initial.activity,
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
      moderation: Array.isArray(parsed.moderation) ? parsed.moderation : [],
      archived: Array.isArray(parsed.archived) ? parsed.archived : [],
      profile: { ...initial.profile, ...(parsed.profile || {}) },
      settings: { ...initial.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return createInitialData();
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT));
}

function update(mutator) {
  const data = readData();
  mutator(data);
  saveData(data);
  return data;
}

export function resetData() {
  const data = createInitialData();
  saveData(data);
  return data;
}

export function addItem(item) {
  const timestamp = now();
  const newItem = { ...item, id: id(), owner: "student-demo", status: "open", created_at: timestamp, history: [{ text: "Report submitted", date: timestamp }] };
  update((data) => {
    data.items.unshift(newItem);
    data.activity.unshift({ id: id(), type: "report", title: `${newItem.title} was reported`, message: `${newItem.item_type === "lost" ? "Lost" : "Found"} near ${newItem.location}.`, created_at: timestamp });
  });
  return newItem;
}

export function updateItem(idValue, changes) {
  return update((data) => {
    const item = data.items.find((entry) => entry.id === idValue);
    if (!canEditItem(item)) return;
    Object.assign(item, changes);
    item.history = [...(item.history || []), { text: "Report details updated", date: now() }];
    data.activity.unshift({ id: id(), type: "report", title: `${item.title} was updated`, message: "Report details were edited by the demo student.", created_at: now() });
  });
}

export function updateProfile(changes) {
  return update((data) => { data.profile = { ...data.profile, ...changes }; });
}

export function updateSettings(changes) {
  return update((data) => { data.settings = { ...data.settings, ...changes }; });
}

export function addClaim(itemId, details) {
  const timestamp = now();
  let created = false;
  update((data) => {
    if (data.claims.some((claim) => claim.item_id === itemId && claim.status === "pending")) return;
    const claim = { id: id(), item_id: itemId, details, status: "pending", created_at: timestamp, history: [{ text: "Claim submitted", date: timestamp }] };
    data.claims.unshift(claim);
    data.notifications.unshift({ id: id(), title: "Claim submitted", message: "Your claim is awaiting staff verification.", read: false, created_at: timestamp, type: "claim" });
    data.activity.unshift({ id: id(), type: "claim", title: "A claim was submitted", message: "Staff review is required.", created_at: timestamp });
    created = true;
  });
  return created;
}

export function withdrawClaim(claimId) {
  return update((data) => {
    const claim = data.claims.find((entry) => entry.id === claimId);
    if (claim?.status === "pending") {
      claim.status = "withdrawn";
      claim.history = [...(claim.history || []), { text: "Claim withdrawn", date: now() }];
    }
  });
}

export function reviewClaim(claimId, status) {
  return reviewClaimWithNote(claimId, status);
}

export function reviewClaimWithNote(claimId, status, note = "") {
  return update((data) => {
    const claim = data.claims.find((entry) => entry.id === claimId);
    if (!claim || !["approved", "rejected"].includes(status)) return;
    const timestamp = now();
    claim.status = status;
    claim.decision_note = note;
    claim.history = [...(claim.history || []), { text: `Claim ${status}${note ? `: ${note}` : ""}`, date: timestamp }];
    const item = data.items.find((entry) => entry.id === claim.item_id);
    if (item && status === "approved") item.status = "claimed";
    data.notifications.unshift({ id: id(), title: `Claim ${status}`, message: `Your ownership claim was ${status}.`, read: false, created_at: timestamp, type: "claim" });
    data.activity.unshift({ id: id(), type: "claim", title: `Claim ${status}`, message: "A staff decision was recorded.", created_at: timestamp });
  });
}

export function completeClaim(claimId) {
  return update((data) => {
    const claim = data.claims.find((entry) => entry.id === claimId);
    if (!claim || claim.status !== "approved") return;
    const timestamp = now();
    claim.status = "completed";
    claim.history = [...(claim.history || []), { text: "Item pickup completed", date: timestamp }];
    const item = data.items.find((entry) => entry.id === claim.item_id);
    if (item) {
      item.status = "returned";
      item.history = [...(item.history || []), { text: "Item returned to claimant", date: timestamp }];
    }
    data.notifications.unshift({ id: id(), title: "Pickup completed", message: "Your item was marked as returned.", read: false, created_at: timestamp, type: "claim" });
    data.activity.unshift({ id: id(), type: "status", title: "Item returned", message: "A verified item was marked returned.", created_at: timestamp });
  });
}

export function updateItemStatus(itemId, status) {
  return update((data) => {
    const item = data.items.find((entry) => entry.id === itemId);
    if (!item) return;
    item.status = status;
    item.history = [...(item.history || []), { text: `Status changed to ${status}`, date: now() }];
    data.activity.unshift({ id: id(), type: "status", title: `${item.title} marked ${status}`, message: "Inventory status updated.", created_at: now() });
  });
}

export function toggleSaved(itemId) {
  return update((data) => {
    data.saved = data.saved.includes(itemId) ? data.saved.filter((value) => value !== itemId) : [itemId, ...data.saved];
  });
}

export function trackRecent(itemId) {
  return update((data) => { data.recent = [itemId, ...data.recent.filter((value) => value !== itemId)].slice(0, 20); });
}

export function clearRecent() {
  return update((data) => { data.recent = []; });
}

export function markNotification(idValue) {
  return update((data) => { const notification = data.notifications.find((entry) => entry.id === idValue); if (notification) notification.read = true; });
}

export function markAllNotifications() {
  return update((data) => { data.notifications.forEach((notification) => { notification.read = true; }); });
}

export function addInventory(itemId, location) {
  return update((data) => {
    const existing = data.inventory.find((entry) => entry.item_id === itemId);
    const timestamp = now();
    if (existing) {
      existing.location = location;
      existing.updated_at = timestamp;
      existing.history = [...(existing.history || []), { location, date: timestamp }];
    } else data.inventory.push({ id: id(), item_id: itemId, location, updated_at: timestamp, history: [{ location, date: timestamp }] });
  });
}

export function markItemReturned(itemId) {
  return updateItemStatus(itemId, "returned");
}

export function archiveItem(itemId, reason = "Staff archived report") {
  return update((data) => {
    const item = data.items.find((entry) => entry.id === itemId);
    if (!item || data.archived.some((entry) => entry.id === itemId)) return;
    const timestamp = now();
    data.archived.push({ ...item, archived_at: timestamp, archive_reason: reason });
    data.items = data.items.filter((entry) => entry.id !== itemId);
    data.activity.unshift({ id: id(), type: "archive", title: `${item.title} archived`, message: reason, created_at: timestamp });
  });
}

export function restoreItem(itemId) {
  return update((data) => {
    const archived = data.archived.find((entry) => entry.id === itemId);
    if (!archived) return;
    data.items.unshift(archived);
    data.archived = data.archived.filter((entry) => entry.id !== itemId);
    data.activity.unshift({ id: id(), type: "archive", title: `${archived.title} restored`, message: "Report returned to active listings.", created_at: now() });
  });
}

export function flagReport(itemId, reason = "Needs staff review") {
  return update((data) => {
    const item = data.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const timestamp = now();
    item.flagged = true;
    data.moderation.unshift({ id: id(), item_id: itemId, action: "flag", reason, created_at: timestamp });
    data.notifications.unshift({ id: id(), title: "Report flagged", message: "A report was sent to staff moderation.", read: false, created_at: timestamp, type: "moderation" });
    data.activity.unshift({ id: id(), type: "moderation", title: `${item.title} flagged`, message: "A report requires staff review.", created_at: timestamp });
  });
}

export function moderateItem(itemId, action, reason = "") {
  return update((data) => {
    const item = data.items.find((entry) => entry.id === itemId);
    if (!item || !["hide", "restore"].includes(action)) return;
    const timestamp = now();
    item.hidden = action === "hide";
    if (action === "restore") item.flagged = false;
    data.moderation.unshift({ id: id(), item_id: itemId, action, reason, created_at: timestamp });
    data.activity.unshift({ id: id(), type: "moderation", title: `${item.title} ${action === "hide" ? "hidden" : "restored"}`, message: reason || "Moderation action recorded.", created_at: timestamp });
  });
}

export { canEditItem, findDuplicateReports, findMatches, isPublicItem };

export function useMockData() {
  const [data, setData] = useState(createInitialData);
  useEffect(() => {
    const refresh = () => setData(readData());
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener(EVENT, refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return data;
}
