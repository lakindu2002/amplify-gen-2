import { withAuthGuard } from "@/hocs/withAuthGuard";
import { FrontLoader } from "@mui/icons-material";
import { Box } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <FrontLoader />
      </Box>
    </>
  );
};

export default withAuthGuard(Home);
