import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

export default function Spinner() {
  return (
    <Box sx={{ flexGrow: 1 }} data-testid="spinner-box">
      <Grid container spacing={2} minHeight={160}>
        <Grid
          data-testid="spinner-grid"
          display="flex"
          justifyContent="center"
          alignItems="center"
          size="grow"
        >
          <CircularProgress />
        </Grid>
      </Grid>
    </Box>
  );
}
