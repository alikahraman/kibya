import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bulkAddBooksToShelves } from "../../features/shelfSlice";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const BulkBookUploader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message, errors } = useSelector(
    (state) => state.shelves,
  );

  const [isbnColumn, setIsbnColumn] = useState("");
  const [barcodeColumn, setBarcodeColumn] = useState("");
  const [countColumn, setCountColumn] = useState("");
  const [error, setError] = useState(null);

  const handleUpload = () => {
    setError(null);

    if (!isbnColumn.trim() || !barcodeColumn.trim() || !countColumn.trim()) {
      setError("Tüm sütunlar boş olamaz!");
      return;
    }

    const isbnRows = isbnColumn
      ? isbnColumn.split("\n").map((row) => row.trim())
      : [];
    const barcodeRows = barcodeColumn
      ? barcodeColumn.split("\n").map((row) => row.trim())
      : [];
    const countRows = countColumn
      ? countColumn.split("\n").map((row) => row.trim())
      : [];

    if (
      isbnRows.length === 0 ||
      barcodeRows.length === 0 ||
      countRows.length === 0
    ) {
      setError("Her sütun en az bir veri içermelidir.");
      return;
    }

    const length = isbnRows.length;
    const allEqualLength = [barcodeRows, countRows].every(
      (rows) => rows.length === length,
    );

    if (!allEqualLength) {
      setError("Tüm sütunlar aynı sayıda satıra sahip olmalıdır.");
      return;
    }

    const bookEntries = [];
    for (let i = 0; i < length; i++) {
      const count = parseInt(countRows[i], 10);
      if (isNaN(count) || count < 0) {
        setError(`Miktar sütunundaki tüm değerler pozitif bir sayı olmalıdır.`);
        return;
      }
      bookEntries.push({
        isbn: isbnRows[i],
        barcode: barcodeRows[i],
        count,
      });
    }

    dispatch(bulkAddBooksToShelves({ bookEntries }));
  };

  const handleRedirect = () => {
    navigate("/shelves");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Toplu Kitap Yükleme
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message || "Kitaplar başarıyla yüklendi."}
        </Alert>
      )}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message || "Bir hata oluştu."}
        </Alert>
      )}
      {Array.isArray(errors) && errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Hatalı girişler: {errors.join(", ")}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <TextField
            label="ISBN Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={isbnColumn}
            onChange={(e) => setIsbnColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={4}>
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
        <Grid xs={12} md={4}>
          <TextField
            label="Miktar Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={countColumn}
            onChange={(e) => setCountColumn(e.target.value)}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={isLoading}
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

export default BulkBookUploader;
