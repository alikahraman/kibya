import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bulkAddShelves } from "../../features/shelfSlice";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const BulkShelfUploader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.shelves,
  );

  const [locationColumn, setLocationColumn] = useState("");
  const [barcodeColumn, setBarcodeColumn] = useState("");
  const [error, setError] = useState(null);

  const handleUpload = () => {
    setError(null);

    const locationRows = locationColumn.split("\n").map((row) => row.trim());
    const barcodeRows = barcodeColumn.split("\n").map((row) => row.trim());

    const length = barcodeRows.length;
    const allEqualLength = [locationRows].every(
      (rows) => rows.length === length,
    );
    if (!allEqualLength) {
      setError("Tüm sütunlar aynı sayıda satıra sahip olmalıdır.");
      return;
    }

    const shelves = [];
    for (let i = 0; i < length; i++) {
      shelves.push({
        location: locationRows[i],
        barcode: barcodeRows[i],
      });
    }

    dispatch(bulkAddShelves(shelves));
  };

  const handleRedirect = () => {
    navigate("/shelves");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Toplu Raf Yükleme
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {isError && <Alert severity="error">{message}</Alert>}
      {isSuccess && (
        <Alert severity="success">Raflar başarıyla yüklendi!</Alert>
      )}
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <TextField
            label="Lokasyon Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={locationColumn}
            onChange={(e) => setLocationColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            label="Barkod Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={barcodeColumn}
            onChange={(e) => setBarcodeColumn(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isLoading || isSuccess}
        >
          {isLoading ? <CircularProgress size={24} /> : "Verileri Gönder"}
        </Button>
      </Box>
      {isSuccess && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleRedirect}>
            Raf Listesine Git
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BulkShelfUploader;
