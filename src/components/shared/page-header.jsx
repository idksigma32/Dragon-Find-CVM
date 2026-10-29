import { Box, Stack, Typography } from "@mui/material";

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} mb={4}>
      <Box>
        {eyebrow && <Typography variant="overline" color="primary" fontWeight={700}>{eyebrow}</Typography>}
        <Typography variant="h3" fontWeight={800}>{title}</Typography>
        {description && <Typography color="text.secondary" sx={{ mt: 1 }}>{description}</Typography>}
      </Box>
      {actions && <Stack direction="row" gap={1} alignItems="center">{actions}</Stack>}
    </Stack>
  );
}
