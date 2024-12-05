import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import {
  addBookToShelf,
  fetchShelfWithBooksById,
} from "../../features/shelfSlice";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function AddBookToShelf() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { shelves, status, error } = useSelector((state) => state.shelves);
  const [open, setOpen] = React.useState(false);
  const [shelfData, setShelfData] = useState({
    isbn: "",
    count: "",
  });

  const handleExistDialogOpen = () => {
    setOpen(true);
  };
  const handleExistDialogClose = () => {
    setOpen(false);
  };
  const handleExistDialogIncrement = () => {
    handleAddBook(true, false, false);
    setOpen(false);
  };

  const handleExistDialogDecrease = () => {
    handleAddBook(false, false, true);
    setOpen(false);
  };

  const handleExistDialogReset = () => {
    handleAddBook(false, true, false);
    setOpen(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setShelfData({ ...shelfData, [e.target.name]: e.target.value });
  };

  const handleAddBook = (
    increment = false,
    reset = false,
    decrease = false,
  ) => {
    const bookData = {
      isbn: shelfData.isbn,
      count: parseInt(shelfData.count),
    };

    dispatch(
      addBookToShelf({
        shelfId: id,
        ...bookData,
        increment,
        reset,
        decrease,
      }),
    )
      .unwrap()
      .then(() => {
        navigate("/shelves/" + id + "/add");
      })
      .catch((error) => {
        console.error("Rafa kitap ekleme işlemi sırasında hata oluştu:", error);
      });
  };

  const checkDuplicate = () => {
    const duplicateBook = shelf.books.find(
      (book) => shelfData.isbn === book.bookDetails?.isbn,
    );

    if (duplicateBook) {
      handleExistDialogOpen();
    } else {
      handleAddBook();
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchShelfWithBooksById(id));
    }
  }, [dispatch, id]);

  if (status === "loading") return <Spinner />;
  if (status === "failed") return <p>Error: {error}</p>;
  const shelf = shelves[0];

  return (
    <React.Fragment>
      <Container>
        <Box
          sx={{
            width: "100%",
            alignItems: "center",
            display: "block",
            margin: "10px",
          }}
        >
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 16 }}
          >
            {shelf?.barcode || "Barkod bulunamadı"}
          </Typography>
          <Typography variant="h2" component="div">
            {shelf?.location || "Lokasyon bulunamadı"}
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ alignItems: "center", display: "inline-flex" }}
        >
          <Stack
            direction="column"
            spacing={2}
            sx={{
              width: "300px",
              alignItems: "stretch",
              m: 1,
            }}
          >
            <FormControl>
              <TextField
                required
                id="isbn"
                label="ISBN"
                name="isbn"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <TextField
                required
                id="count"
                label="Miktar"
                name="count"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl variant="standard">
              <Button
                variant="contained"
                size="large"
                onClick={checkDuplicate}
                startIcon={<AddBoxIcon />}
              >
                Kitabı Rafa Ekle
              </Button>
            </FormControl>
          </Stack>
        </Box>
        <Box sx={{ alignItems: "center", display: "inline-flex" }}>
          <List sx={{ maxWidth: 360 }}>
            <ListItem>
              <Typography variant="h5" component="div">
                Rafta Bulunan Kitaplar
              </Typography>
            </ListItem>
            {shelf?.books?.length > 0 ? (
              shelf.books.map((book, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>{index + 1}</ListItemAvatar>
                  <ListItemText
                    primary={book.bookDetails?.title || "Kitap adı bulunamadı"}
                    secondary={`Adet: ${book.count || "Bilinmiyor"}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>Kitap Mevcut Değil</Typography>
            )}
          </List>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleExistDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Mevcut Kitap!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Eklediğiniz kitap bu rafta mevcut. Lütfen yapmak istediğiniz işlemi
            seçiniz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExistDialogClose}>İptal Et</Button>
          <Button onClick={handleExistDialogIncrement}>Ekleme Yap</Button>
          <Button onClick={handleExistDialogDecrease}>Çıkarma Yap</Button>
          <Button onClick={handleExistDialogReset}>Sıfırla</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
