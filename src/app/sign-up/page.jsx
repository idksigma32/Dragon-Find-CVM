"use client";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Paper } from "@mui/material";

export default function SignUpPage() {
  return <main style={{ minHeight: "calc(100vh - 76px)", display: "grid", placeItems: "center", padding: 32 }}><div style={{ width: "100%", maxWidth: 440 }}><Link href="/" style={{ display: "inline-flex", marginBottom: 32, color: "inherit", gap: 8 }}><ArrowLeft fontSize="small" /> Back to home</Link><div style={{ textAlign: "center", marginBottom: 28 }}><Compass color="primary" fontSize="large" /><h1>Join FindIt</h1><p>Create an account to reconnect with your belongings.</p></div><Paper elevation={0}><AuthForm mode="sign-up" /></Paper></div></main>;
}
