import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAllShelves } from "../../features/shelfSlice";
import { useNavigate } from "react-router-dom";
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

const ShelfDrop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.shelves,
  );

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteAllShelves());
    setOpen(false);
  };

  const handleRedirect = () => {
    navigate("/shelves");
  };

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Tüm Rafları Sil
      </Typography>
      {isError && <Alert severity="error">{message}</Alert>}
      {isSuccess && (
        <Alert severity="success">Tüm raflar başarıyla silindi!</Alert>
      )}
      <Button
        variant="contained"
        color="error"
        onClick={handleClickOpen}
        disabled={isLoading || isSuccess}
      >
        {isLoading ? <CircularProgress size={24} /> : "Tüm Rafları Sil"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tüm rafları silmek istiyor musunuz?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu işlem geri alınamaz. Tüm raflar ve içeriği kalıcı olarak
            silinecektir.
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

      {isSuccess && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleRedirect}>
            Raflar Sayfasına Git
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ShelfDrop;
