import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import React, { useEffect } from "react";
import { getUrl, uploadData } from "aws-amplify/storage";

export const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userName, setUserName] = React.useState<string>("");
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(
    undefined
  );
  const [userId, setUserId] = React.useState<string>("");
  const client = generateClient<Schema>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const longPressTimeout = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        const uid = user.userId;
        setUserId(uid);
        try {
          const { data } = await client.models.Users.get(
            { userId: uid },
            {
              authMode: "userPool",
            }
          );
          setUserName(data?.name ?? "");
          if (data?.profilePicture) {
            const url = await getUrl({
              path: data.profilePicture,
            });
            setAvatarUrl(url.url.toString());
          }
        } catch {
          setUserName(user.signInDetails?.loginId || user.username || "");
        }
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

  // Handle dropped or selected file
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      setAvatarUrl(e.target?.result as string);
      const uploadResp = await uploadData({
        path({ identityId }) {
          return `profile-pictures/${identityId}/${file.name}`;
        },
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      await client.models.Users.update(
        {
          profilePicture: uploadResp.path,
          updatedAt: new Date().toISOString(),
          userId,
        },
        {
          authMode: "userPool",
        }
      ).catch((error) => {
        console.error("Error updating user profile picture:", error);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAvatarMouseDown = () => {
    longPressTimeout.current = setTimeout(() => {
      handleAvatarClick();
    }, 1500);
  };

  const handleAvatarMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
      // Only open dropdown if mouseup happens before 3s
      handleMenu(e);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Home
        </Typography>
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <IconButton
            color="inherit"
            size="large"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{ p: 0 }}
          >
            <Box
              onMouseDown={handleAvatarMouseDown}
              onMouseUp={handleAvatarMouseUp}
              onMouseLeave={() => {
                if (longPressTimeout.current) {
                  clearTimeout(longPressTimeout.current);
                  longPressTimeout.current = null;
                }
              }}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              <Avatar
                sx={{ width: 32, height: 32, border: "2px dashed #ccc" }}
                src={avatarUrl}
                alt={userName}
                title="Long press to change profile picture"
              >
                {userName ? userName[0].toUpperCase() : "U"}
              </Avatar>
            </Box>
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
