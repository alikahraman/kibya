import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bulkAddBooks } from "../../features/bookSlice";
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

  const [isbnColumn, setIsbnColumn] = useState("");
  const [titleColumn, setTitleColumn] = useState("");
  const [authorColumn, setAuthorColumn] = useState("");
  const [publisherColumn, setPublisherColumn] = useState("");
  const [sizeColumn, setSizeColumn] = useState("");
  const [coverTypeColumn, setCoverTypeColumn] = useState("");
  const [priceColumn, setPriceColumn] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = async () => {
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    const isbnRows = isbnColumn.split("\n").map((row) => row.trim());
    const titleRows = titleColumn.split("\n").map((row) => row.trim());
    const authorRows = authorColumn.split("\n").map((row) => row.trim());
    const publisherRows = publisherColumn.split("\n").map((row) => row.trim());
    const sizeRows = sizeColumn.split("\n").map((row) => row.trim());
    const coverTypeRows = coverTypeColumn.split("\n").map((row) => row.trim());
    const priceRows = priceColumn.split("\n").map((row) => row.trim());

    const length = isbnRows.length;
    const allEqualLength = [
      titleRows,
      authorRows,
      publisherRows,
      sizeRows,
      coverTypeRows,
      priceRows,
    ].every((rows) => rows.length === length);

    if (!allEqualLength) {
      setError("Tüm sütunlar aynı sayıda satıra sahip olmalıdır.");
      setIsLoading(false);
      return;
    }
    const chunkSize = 100;
    const chunks = [];
    for (let i = 0; i < length; i += chunkSize) {
      const chunk = [];
      for (let j = i; j < Math.min(i + chunkSize, length); j++) {
        chunk.push({
          isbn: isbnRows[j],
          title: titleRows[j],
          author: authorRows[j],
          publisher: publisherRows[j],
          size: sizeRows[j],
          coverType: coverTypeRows[j],
          price: priceRows[j],
        });
      }
      chunks.push(chunk);
    }

    for (let i = 0; i < chunks.length; i++) {
      try {
        await dispatch(bulkAddBooks(chunks[i]));
      } catch (error) {
        setError("Kitaplar yüklenirken bir hata oluştu.");
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleRedirect = () => {
    navigate("/books");
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
        <Alert severity="success">Kitaplar başarıyla yüklendi!</Alert>
      )}
      <Grid container spacing={2}>
        {/* Sütunlar */}
        <Grid xs={12} md={6}>
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
        <Grid xs={12} md={6}>
          <TextField
            label="Kitap Adı Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={titleColumn}
            onChange={(e) => setTitleColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            label="Yazar Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={authorColumn}
            onChange={(e) => setAuthorColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            label="Yayınevi Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={publisherColumn}
            onChange={(e) => setPublisherColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            label="Ebat Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={sizeColumn}
            onChange={(e) => setSizeColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            label="Kapak Türü Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={coverTypeColumn}
            onChange={(e) => setCoverTypeColumn(e.target.value)}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <TextField
            label="Fiyat Sütunu"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={priceColumn}
            onChange={(e) => setPriceColumn(e.target.value)}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <CircularProgress />
        ) : isSuccess ? (
          <Button variant="contained" color="primary" onClick={handleRedirect}>
            Kitap Listesine Git
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Verileri Gönder
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default BulkBookUploader;
