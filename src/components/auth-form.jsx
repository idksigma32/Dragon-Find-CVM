"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { Lock, Mail, Person } from "@mui/icons-material";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm({ mode = "sign-in" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setMessage(null);
    if (isSignUp && form.password !== form.confirm) return setMessage({ severity: "error", text: "Passwords do not match." });
    if (form.password.length < 6) return setMessage({ severity: "error", text: "Password must be at least 6 characters." });
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setMessage({ severity: "error", text: "Authentication is not configured. Add your Supabase environment variables." });
    setLoading(true);
    const result = isSignUp ? await supabase.auth.signUp({ email: form.email, password: form.password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } }) : await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setLoading(false);
    if (result.error) return setMessage({ severity: "error", text: result.error.message });
    if (isSignUp) setMessage({ severity: "success", text: "Account created. Check your email to verify your address." }); else router.push("/dashboard");
  }
  const adornments = { email: <Mail />, password: <Lock />, confirm: <Person /> };
  return <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: 1, borderColor: "divider", borderRadius: 4 }}><Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
    {["email", "password", ...(isSignUp ? ["confirm"] : [])].map((name) => <TextField key={name} name={name} label={name === "email" ? "Email address" : name === "confirm" ? "Confirm password" : "Password"} type={name === "email" ? "email" : "password"} required value={form[name]} onChange={update} placeholder={name === "email" ? "you@school.edu" : "At least 6 characters"} InputProps={{ startAdornment: <InputAdornment position="start">{adornments[name]}</InputAdornment> }} />)}
    {message && <Alert severity={message.severity}>{message.text}</Alert>}
    <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? <CircularProgress size={22} color="inherit" /> : isSignUp ? "Create account" : "Sign in"}</Button>
    <Typography variant="body2" textAlign="center" color="text.secondary">{isSignUp ? "Already have an account?" : "New to FindIt?"} <Link href={isSignUp ? "/sign-in" : "/sign-up"} style={{ color: "inherit", fontWeight: 700 }}>{isSignUp ? "Sign in" : "Create an account"}</Link></Typography>
  </Box></Paper>;
}
