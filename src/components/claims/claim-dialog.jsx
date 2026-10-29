"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { addClaim } from "@/lib/mock-store";

export function ClaimDialog({ itemId, open, onClose }) {
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  function submit() {
    if (details.trim().length < 10) return setError("Please provide at least 10 characters of ownership details.");
    addClaim(itemId, details);
    setDetails(""); setError(""); onClose();
  }
  return <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>Verify ownership</DialogTitle>
    <DialogContent><Typography color="text.secondary" mb={2}>Share a private detail that only the owner would know.</Typography>
      <TextField autoFocus fullWidth multiline minRows={4} label="Ownership details" value={details} onChange={(e) => setDetails(e.target.value)} error={Boolean(error)} helperText={error} />
    </DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={submit}>Submit claim</Button></DialogActions>
  </Dialog>;
}
