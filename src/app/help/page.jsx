"use client";

import { useMemo, useState } from "react";
import { ExpandMore, Search } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Stack, TextField, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";

const faqs = [
  ["How do I report a lost or found item?", "Open Report an item, choose lost or found, add a clear name, location, date, and description, then submit the report."],
  ["How does ownership verification work?", "When a found report looks like your item, submit a claim with a private detail that is not visible in the public report. Staff review it before approving."],
  ["How do I track a claim?", "Open My claims to see the current status and the complete decision history. Pending claims can be withdrawn."],
  ["How do I retrieve an approved item?", "After approval, coordinate pickup through your school staff process. Staff can mark the item returned after pickup."],
  ["What should I share publicly?", "Avoid posting student names, contact details, serial numbers, or private ownership evidence. Use the private claim field for sensitive details."],
  ["How is my information protected?", "This demo keeps data in localStorage. A production deployment should use authenticated Supabase access, row-level security, and private storage."],
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => faqs.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="SUPPORT" title="Help center" description="Guidance for reporting, claims, privacy, and safe pickups." /><TextField fullWidth label="Search help" value={query} onChange={(e) => setQuery(e.target.value)} slotProps={{ input: { startAdornment: <Search sx={{ mr: 1 }} /> } }} sx={{ mb: 3 }} /><Stack spacing={1}>{results.map(([question, answer]) => <Accordion key={question}><AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight={700}>{question}</Typography></AccordionSummary><AccordionDetails><Typography color="text.secondary">{answer}</Typography></AccordionDetails></Accordion>)}{!results.length && <Card sx={{ p: 4 }}><Typography color="text.secondary">No help articles match your search.</Typography></Card>}</Stack></Box>;
}
