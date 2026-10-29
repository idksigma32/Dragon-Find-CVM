"use client";

import Link from "next/link";
import { History } from "@mui/icons-material";
import { Alert, Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { useMockData, withdrawClaim } from "@/lib/mock-store";

export default function ClaimsPage() {
  const { items, claims } = useMockData();
  return <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="MY SPACE" title="My claims" description="Track ownership verification and claim history." />
    <Stack spacing={2}>{claims.length ? claims.map((claim) => { const item = items.find((entry) => entry.id === claim.item_id); return <Card key={claim.id} sx={{ p: 3 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Box><Typography variant="caption" color="text.secondary">Claim for</Typography><Typography variant="h6" fontWeight={800}>{item?.title || "Removed report"}</Typography>{item && <Button component={Link} href={`/items/${item.id}`} size="small">View item</Button>}</Box><Chip label={claim.status} color={claim.status === "approved" ? "success" : claim.status === "rejected" ? "error" : "warning"} /></Stack><Typography color="text.secondary" sx={{ mt: 2 }}>Submitted {new Date(claim.created_at).toLocaleString()}</Typography><Stack spacing={1} sx={{ mt: 2 }}>{(claim.history || []).map((event, index) => <Stack key={index} direction="row" spacing={1}><History fontSize="small" color="primary" /><Typography variant="body2">{event.text} · {new Date(event.date).toLocaleString()}</Typography></Stack>)}</Stack>{claim.status === "pending" && <Button sx={{ mt: 2 }} color="error" onClick={() => withdrawClaim(claim.id)}>Withdraw pending claim</Button>}</Card>; }) : <Alert severity="info">You have not submitted any claims yet.</Alert>}</Stack>
  </Box>;
}
