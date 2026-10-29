"use client";

import { useState } from "react";
import { CheckCircle, Close, History } from "@mui/icons-material";
import { Alert, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { completeClaim, reviewClaimWithNote, useMockData } from "@/lib/mock-store";

export default function StaffClaimsPage() {
  const { claims, items } = useMockData();
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const pending = claims.filter((claim) => claim.status === "pending");
  function confirmDecision() { reviewClaimWithNote(decision.id, decision.status, note); setDecision(null); setNote(""); }
  return <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="SIMULATED STAFF MODE" title="Claim verification" description="Review private ownership details before making a decision." /><Alert severity="warning" sx={{ mb: 3 }}>Demo workspace: client-side controls are not a security boundary.</Alert><Stack spacing={2}>{claims.length ? claims.map((claim) => { const item = items.find((entry) => entry.id === claim.item_id); return <Card key={claim.id} sx={{ p: 3 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Box><Typography variant="caption" color="text.secondary">Claim for</Typography><Typography variant="h6" fontWeight={800}>{item?.title || "Unknown item"}</Typography><Typography color="text.secondary">{new Date(claim.created_at).toLocaleString()}</Typography></Box><Chip label={claim.status} color={claim.status === "pending" ? "warning" : claim.status === "approved" || claim.status === "completed" ? "success" : "error"} /></Stack><Stack direction="row" gap={1} sx={{ mt: 2 }}><Button variant="outlined" onClick={() => setSelected(claim)}>Open private details</Button>{claim.status === "pending" && <><Button color="success" startIcon={<CheckCircle />} onClick={() => setDecision({ id: claim.id, status: "approved" })}>Approve</Button><Button color="error" startIcon={<Close />} onClick={() => setDecision({ id: claim.id, status: "rejected" })}>Reject</Button></>}{claim.status === "approved" && <Button variant="contained" onClick={() => completeClaim(claim.id)}>Mark returned</Button>}</Stack></Card>; }) : <Alert severity="info">No claims have been submitted.</Alert>}</Stack>
    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth><DialogTitle>Private ownership details</DialogTitle><DialogContent>{selected && <><Typography color="text.secondary" mb={2}>This information is visible only in this simulated staff review.</Typography><Card variant="outlined" sx={{ p: 2, mb: 2 }}><Typography>{selected.details}</Typography></Card><Typography variant="subtitle2">Claim history</Typography>{(selected.history || []).map((event, index) => <Stack key={index} direction="row" gap={1} sx={{ mt: 1 }}><History fontSize="small" color="primary" /><Typography variant="body2">{event.text}</Typography></Stack>)}</>}</DialogContent><DialogActions><Button onClick={() => setSelected(null)}>Close</Button></DialogActions></Dialog>
    <Dialog open={Boolean(decision)} onClose={() => setDecision(null)} fullWidth><DialogTitle>{decision?.status === "approved" ? "Approve claim?" : "Reject claim?"}</DialogTitle><DialogContent><Typography color="text.secondary" mb={2}>Record an optional decision note for the claim history.</Typography><TextField fullWidth multiline minRows={3} label="Decision note" value={note} onChange={(event) => setNote(event.target.value)} /></DialogContent><DialogActions><Button onClick={() => setDecision(null)}>Cancel</Button><Button variant="contained" color={decision?.status === "approved" ? "success" : "error"} onClick={confirmDecision}>Confirm decision</Button></DialogActions></Dialog>
  </Box>;
}
