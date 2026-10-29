export function isPublicItem(item) {
  return Boolean(item && !item.hidden && !item.archived_at);
}

export function canEditItem(item, owner = "student-demo") {
  return Boolean(item && item.owner === owner);
}

export function findDuplicateReports(candidate, items) {
  const normalize = (value) => (value || "").trim().toLowerCase();
  return items.filter((item) => isPublicItem(item)
    && item.item_type === candidate.item_type
    && normalize(item.title) === normalize(candidate.title)
    && normalize(item.location) === normalize(candidate.location)
    && item.id !== candidate.id);
}

export function findMatches(item, items) {
  return items.filter((other) => other.id !== item.id && isPublicItem(other) && other.item_type !== item.item_type && other.status === "open").map((other) => {
    let score = 0;
    const reasons = [];
    if (item.category === other.category) { score += 3; reasons.push("same category"); }
    if (item.location?.toLowerCase() === other.location?.toLowerCase()) { score += 2; reasons.push("same location"); }
    const titleWords = (item.title || "").toLowerCase().split(/\s+/).filter((word) => word.length > 2);
    if (titleWords.some((word) => (other.title || "").toLowerCase().includes(word))) { score += 2; reasons.push("similar item name"); }
    const descriptionWords = (item.description || "").toLowerCase().split(/\s+/).filter((word) => word.length > 4);
    if (descriptionWords.some((word) => (other.description || "").toLowerCase().includes(word))) { score += 1; reasons.push("matching description detail"); }
    return { ...other, matchScore: score, matchReason: reasons.join(", ") };
  }).filter((other) => other.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
}

export function transitionClaim(claim, status, note = "") {
  if (!claim || !["approved", "rejected"].includes(status)) return claim;
  return {
    ...claim,
    status,
    decision_note: note,
    history: [...(claim.history || []), { text: `Claim ${status}${note ? `: ${note}` : ""}` }],
  };
}

export function markNotificationRead(notification) {
  return notification ? { ...notification, read: true } : notification;
}

export function archiveItem(items, archived, itemId, reason = "Staff archived report") {
  const item = items.find((entry) => entry.id === itemId);
  if (!item || archived.some((entry) => entry.id === itemId)) return { items, archived };
  return {
    items: items.filter((entry) => entry.id !== itemId),
    archived: [...archived, { ...item, archive_reason: reason }],
  };
}

export function restoreItem(items, archived, itemId) {
  const item = archived.find((entry) => entry.id === itemId);
  if (!item) return { items, archived };
  return {
    items: [item, ...items],
    archived: archived.filter((entry) => entry.id !== itemId),
  };
}
