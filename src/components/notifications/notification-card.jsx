"use client";

import { Check, NotificationsNone } from "@mui/icons-material";
import { Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import { markNotification } from "@/lib/mock-store";

export function NotificationCard({ notification }) {
  return <Card sx={{ opacity: notification.read ? .72 : 1 }}>
    <CardContent><Stack direction="row" gap={2} alignItems="start">
      <NotificationsNone color={notification.read ? "disabled" : "primary"} />
      <Stack flex={1}><Stack direction="row" justifyContent="space-between" gap={1}>
        <Typography fontWeight={700}>{notification.title}</Typography>
        {!notification.read && <Chip size="small" color="primary" label="New" />}
      </Stack><Typography color="text.secondary">{notification.message}</Typography>
      <Typography variant="caption" color="text.secondary">{new Date(notification.created_at).toLocaleString()}</Typography></Stack>
      {!notification.read && <IconButton aria-label="Mark as read" onClick={() => markNotification(notification.id)}><Check /></IconButton>}
    </Stack></CardContent>
  </Card>;
}
