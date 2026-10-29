import { Card, CardContent, Typography } from "@mui/material";

export function StatCard({ label, value, icon, color = "primary.main" }) {
  return <Card sx={{ height: "100%" }}><CardContent>
    <Typography sx={{ color }}>{icon}</Typography>
    <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>{value}</Typography>
    <Typography color="text.secondary">{label}</Typography>
  </CardContent></Card>;
}
