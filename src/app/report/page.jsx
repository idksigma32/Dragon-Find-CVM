
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert, Box, Button, Card, FormControl,
  InputLabel, MenuItem, Select, Stack,
  TextField, Typography, Avatar
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { addItem, findDuplicateReports, updateItem, useMockData } from "@/lib/mock-store";

const categories = [
  "Clothing", "Electronics", "School supplies",
  "Drinkware", "Keys & cards", "Bags", "Other"
];

export default function ReportPage() {
  const router = useRouter();
  const { items } = useMockData();
  const [editId, setEditId] = useState("");
  useEffect(() => { setEditId(new URLSearchParams(window.location.search).get("edit") || ""); }, []);
  const editing = Boolean(editId);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState("");
  const [form, setForm] = useState({
    item_type: "lost",
    title: "",
    category: "",
    location: "",
    description: "",
    date: new Date().toLocaleDateString("en-CA")
  });
  const duplicateReports = findDuplicateReports(form, items).filter((item) => item.id !== editId);

  useEffect(() => {
    const item = items.find((entry) => entry.id === editId && entry.owner === "student-demo");
    if (item) setForm({ item_type: item.item_type, title: item.title, category: item.category, location: item.location, description: item.description, date: item.created_at.slice(0, 10) });
  }, [editId, items]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const values = { ...form,
        image_url: photo || items.find((item) => item.id === editId)?.image_url || "",
        created_at: form.date
      };
      if (editing) updateItem(editId, values);
      else addItem({
        ...form,
        image_url: photo || "",
        created_at: form.date
      });
      router.push("/lost-found");
    } catch {
      setError("Could not save the report. Try a smaller image.");
    }
  }

  return (
    <Box sx={{ maxWidth: 760, mx: "auto", p: { xs: 2, md: 5 } }}>
      <Typography variant="overline" color="primary">
        {editing ? "EDIT YOUR REPORT" : "COMMUNITY REPORT"}
      </Typography>
      <Typography variant="h3" fontWeight={800}>
        {editing ? "Edit your report" : "Report an Item"}
      </Typography>
      <Typography color="text.secondary" mb={4}>
        {editing ? "Update the details so the community sees the most accurate information." : "Help return lost belongings to their owners."}
      </Typography>

      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Box component="form" onSubmit={submit}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select name="item_type" value={form.item_type}
                label="Report Type" onChange={update}>
                <MenuItem value="lost">I lost something</MenuItem>
                <MenuItem value="found">I found something</MenuItem>
              </Select>
            </FormControl>

            <TextField required label="Item Name"
              name="title" value={form.title} onChange={update}
              placeholder="Example: Black Hydro Flask" />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select name="category" label="Category"
                value={form.category} onChange={update}>
                {categories.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField required label="Location"
              name="location" value={form.location} onChange={update}
              placeholder="Example: Library" />

            <TextField required label="Date"
              type="date" name="date" value={form.date}
              onChange={update}
              slotProps={{ inputLabel: { shrink: true } }} />

            <TextField required multiline minRows={4}
              label="Description" name="description"
              value={form.description} onChange={update}
              helperText="Don't reveal private ownership-verification details." />

            <Button component="label" variant="outlined"
              startIcon={<CloudUpload />} sx={{ py: 2 }}>
              Upload Photo
              <input hidden type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={upload} />
            </Button>

            {photo && (
              <Avatar variant="rounded" src={photo}
                alt="Uploaded item preview"
                sx={{ width: "100%", height: 220 }} />
            )}

            {error && <Alert severity="error">{error}</Alert>}
            {duplicateReports.length > 0 && <Alert severity="warning">A similar {form.item_type} report already exists for this item and location. Review it before submitting a duplicate.</Alert>}

            <Button type="submit" size="large" variant="contained">
              {editing ? "Save changes" : "Submit Report"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
