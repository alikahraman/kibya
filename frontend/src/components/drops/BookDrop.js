import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAllBooks } from "../../features/bookSlice";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

const BookDrop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.books,
  );

  const [open, setOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    dispatch(deleteAllBooks());
    setOpen(false);
    setIsDeleted(true);
  };

  const handleRedirect = () => {
    setIsDeleted(false);
    navigate("/books");
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Tüm Kitapları Sil
      </Typography>
      {isError && <Alert severity="error">{message}</Alert>}
      {isSuccess && (
        <Alert severity="success">Tüm kitaplar başarıyla silindi!</Alert>
      )}
      {isDeleted ? (
        <Button variant="contained" color="primary" onClick={handleRedirect}>
          Kitap Listesine Geri Dön
        </Button>
      ) : (
        <Button
          variant="contained"
          color="error"
          onClick={handleClickOpen}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Tüm Kitapları Sil"}
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tüm kitapları silmek istiyor musunuz?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu işlem geri alınamaz. Tüm kitaplar kalıcı olarak silinecektir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            İptal
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookDrop;
