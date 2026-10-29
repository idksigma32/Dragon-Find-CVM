import test from "node:test";
import assert from "node:assert/strict";
import {
  archiveItem,
  canEditItem,
  findDuplicateReports,
  findMatches,
  isPublicItem,
  markNotificationRead,
  restoreItem,
  transitionClaim,
} from "../src/lib/mock-domain.mjs";

const lost = { id: "lost", item_type: "lost", category: "Electronics", location: "Library", title: "Black headphones", description: "Black over-ear headphones" };
const found = { id: "found", item_type: "found", category: "Electronics", location: "Library", title: "Black headphones case", description: "Black headphones in a case", status: "open" };

test("match scoring ranks shared category, location, title, and description", () => {
  const [match] = findMatches(lost, [lost, found]);
  assert.equal(match.id, "found");
  assert.equal(match.matchScore, 8);
  assert.match(match.matchReason, /same category/);
});

test("hidden reports are excluded from public listings and matches", () => {
  assert.equal(isPublicItem({ ...found, hidden: true }), false);
  assert.deepEqual(findMatches(lost, [{ ...found, hidden: true }]), []);
});

test("duplicate detection identifies same type, title, and location", () => {
  assert.equal(findDuplicateReports({ id: "new", item_type: "lost", title: "Black headphones", location: "Library" }, [lost]).length, 1);
  assert.equal(findDuplicateReports({ id: "new", item_type: "found", title: "Black headphones", location: "Library" }, [lost]).length, 0);
});

test("only the demo owner can edit reports", () => {
  assert.equal(canEditItem({ owner: "student-demo" }), true);
  assert.equal(canEditItem({ owner: "another-user" }), false);
});

test("claim decisions preserve history and notes", () => {
  const claim = transitionClaim({ status: "pending", history: [] }, "approved", "Unique sticker");
  assert.equal(claim.status, "approved");
  assert.equal(claim.decision_note, "Unique sticker");
  assert.match(claim.history[0].text, /Unique sticker/);
  assert.equal(transitionClaim(claim, "pending"), claim);
});

test("archive and restore remove and re-add the same report", () => {
  const archived = archiveItem([found], [], "found", "Resolved");
  assert.equal(archived.items.length, 0);
  assert.equal(archived.archived[0].archive_reason, "Resolved");
  const restored = restoreItem(archived.items, archived.archived, "found");
  assert.equal(restored.items[0].id, "found");
  assert.equal(restored.archived.length, 0);
});

test("notification read state is explicit", () => {
  assert.equal(markNotificationRead({ id: "n", read: false }).read, true);
});
