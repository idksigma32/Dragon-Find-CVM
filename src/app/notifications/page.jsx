"use client";

import { DoneAll } from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationCard } from "@/components/notifications/notification-card";
import { markAllNotifications, useMockData } from "@/lib/mock-store";

export default function NotificationsPage() {
  const { notifications } = useMockData();
  return <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 5 } }}><PageHeader eyebrow="MY SPACE" title="Notifications" description="Updates about reports, claims, and possible matches." actions={<Button startIcon={<DoneAll />} onClick={markAllNotifications}>Mark all as read</Button>} />
    <Stack spacing={2}>{notifications.length ? notifications.map((notification) => <NotificationCard key={notification.id} notification={notification} />) : <Card sx={{ p: 5 }}><Typography color="text.secondary">No notifications.</Typography></Card>}</Stack>
  </Box>;
}
