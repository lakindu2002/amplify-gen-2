import { NextPage } from "next";
import { useState } from "react";
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({
        username: email,
        password: password,
      });
      router.push("/home");
    } catch (err) {
      console.log("Login error:", err);
      setError("Login failed");
    }
    setLoading(false);
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
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="body2" mb={1}>
                {error}
              </Typography>
            )}
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  Create an account
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
