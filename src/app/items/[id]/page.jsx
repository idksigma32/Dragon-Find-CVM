
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert, Box, Button, Card, Chip, Dialog,
  DialogActions, DialogContent, DialogTitle,
  Stack, TextField, Typography
} from "@mui/material";
import { useMockData, addClaim, toggleSaved, trackRecent } from "@/lib/mock-store";

export default function ItemDetails({ params }) {
  const { id } = use(params);
  const { items, claims, saved } = useMockData();
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");

  const item = items.find(i => i.id === id);
  const isSaved = saved.includes(id);
  const alreadyClaimed = claims.some(
    c => c.item_id === id && c.status === "pending"
  );

  useEffect(() => {
    if (item) trackRecent(id);
  }, [id, item]);

  if (!item) return (
    <Box sx={{ p: 8, textAlign: "center" }}>
      <Typography variant="h4">Item not found</Typography>
      <Button component={Link} href="/browse">Back to Browse</Button>
    </Box>
  );

  function submitClaim() {
    if (details.trim().length < 10) {
      setMessage("Please provide more ownership details.");
      return;
    }
    const success = addClaim(id, details);
    setOpen(false);
    setMessage(success
      ? "Claim submitted for staff review (demo)."
      : "A pending claim already exists.");
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 5 } }}>
      <Button component={Link} href="/browse" sx={{ mb: 3 }}>
        Back to Browse
      </Button>

      <Card sx={{ p: { xs: 3, md: 5 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Box sx={{ flex: 1 }}>
            {item.image_url ? (
              <Box component="img" src={item.image_url}
                alt={item.title}
                sx={{ width: "100%", borderRadius: 3, maxHeight: 350,
                  objectFit: "cover" }} />
            ) : (
              <Box sx={{ height: 300, bgcolor: "secondary.light",
                borderRadius: 3, display: "grid", placeItems: "center" }}>
                No photo
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} mb={2} alignItems="center">
              <Chip label={item.item_type} color={
                item.item_type === "lost" ? "warning" : "success"
              } />
              <Chip label={item.status || "open"} variant="outlined" />
              <Button size="small" onClick={() => toggleSaved(id)}>{isSaved ? "Saved" : "Save item"}</Button>
            </Stack>

            <Typography variant="h4" fontWeight={800}>
              {item.title}
            </Typography>
            <Typography color="text.secondary" mt={2}>
              {item.description}
            </Typography>

            <Typography mt={3}><b>Category:</b> {item.category}</Typography>
            <Typography mt={1}><b>Location:</b> {item.location}</Typography>
            <Typography mt={1}>
              <b>Reported:</b> {new Date(item.created_at).toLocaleDateString()}
            </Typography>

            {item.item_type === "found" && item.status === "open" && (
              <Button variant="contained" sx={{ mt: 4 }}
                disabled={alreadyClaimed}
                onClick={() => setOpen(true)}>
                {alreadyClaimed ? "Claim Pending" : "Request Claim"}
              </Button>
            )}

            {message && <Alert sx={{ mt: 2 }} severity="info">{message}</Alert>}
          </Box>
        </Stack>
      </Card>

      <Card sx={{ p: 4, mt: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Status History
        </Typography>
        {(item.history || []).map((h, i) => (
          <Box key={i} sx={{ borderLeft: "3px solid", borderColor: "primary.main", pl: 2, mb: 2 }}>
            <Typography fontWeight={600}>{h.text}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(h.date).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Request Ownership Verification</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" mb={2}>
            Describe something unique about the item that only its owner
            would know. This information should be reviewed privately by staff.
          </Typography>
          <TextField fullWidth multiline minRows={3}
            label="Ownership details" value={details}
            onChange={e => setDetails(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitClaim}>
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
