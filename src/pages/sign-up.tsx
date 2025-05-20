import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Link,
} from "@mui/material";
import { NextPage } from "next";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/router";

const SignUp: NextPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordsMatch =
    form.password === form.confirmPassword || form.confirmPassword === "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      return;
    }
    setLoading(true);
    try {
      await signUp({
        username: form.email,
        password: form.password,
        options: {
          autoSignIn: false,
          userAttributes: {
            email: form.email,
            given_name: form.firstName,
            family_name: form.lastName,
          },
        },
      });
      router.push("/verify-email");
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ minWidth: 350, maxWidth: 400, p: 2 }} elevation={1}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom align="center">
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!passwordsMatch && form.confirmPassword !== ""}
              helperText={
                form.confirmPassword === ""
                  ? ""
                  : passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"
              }
            />
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <Typography variant="body2">Have an account?&nbsp; </Typography>
              <Typography variant="body2">
                <Link
                  href="/login"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  Back to Login
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUp;
