import { withAuthGuard } from "@/hocs/withAuthGuard";
import { NextPage } from "next";
import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { getCurrentUser, signOut } from "aws-amplify/auth";

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userName, setUserName] = React.useState<string>("");

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        // Try to get a friendly name, fallback to username
        setUserName(user.signInDetails?.loginId ?? "");
      })
      .catch(() => setUserName(""));
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    // Optionally, redirect or reload
    window.location.href = "/login";
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Home
        </Typography>
        <Box>
          <IconButton onClick={handleMenu} color="inherit" size="large">
            <Avatar sx={{ width: 32, height: 32 }}>
              {userName ? userName[0].toUpperCase() : "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>{userName}</MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
    </>
  );
};

export default withAuthGuard(Home);

