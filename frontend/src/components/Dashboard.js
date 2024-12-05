import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <Box sx={{ m: 5 }}>
      <Typography variant="h2" color="textSecondary">
        Hoşgeldiniz, {user && user.name}
      </Typography>
    </Box>
  );
};
export default Dashboard;
