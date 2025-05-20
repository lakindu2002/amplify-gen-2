import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { NextPage } from "next";
import { confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/router";

const VerifyEmail: NextPage = () => {
  const [form, setForm] = React.useState({
    email: "",
    otp: "",
  });
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { nextStep } = await confirmSignUp({
        username: form.email,
        confirmationCode: form.otp,
      });

      if (nextStep.signUpStep === "DONE") {
        router.push("/login");
      }
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
          <Typography variant="h5" align="center" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography variant="body1" align="center" mb={2}>
            Please enter your email and the OTP sent to your inbox.
          </Typography>
          <form onSubmit={handleSubmit}>
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
              label="OTP"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
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
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyEmail;
