import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchBookById, updateBook } from "../../features/bookSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";

const BookForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [bookData, setBookData] = useState({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    size: "",
    coverType: "",
    price: "",
    shelfDetails: [],
  });

  const dimensions = [
    {
      value: "13,5 x 21 cm",
      label: "13,5 x 21 cm",
    },
    {
      value: "13,5 x 19,5 cm",
      label: "13,5 x 19,5 cm",
    },
    {
      value: "16 x 24 cm",
      label: "16 x 24 cm",
    },
    {
      value: "Diğer",
      label: "Diğer",
    },
  ];

  const coverTypes = [
    {
      value: "Karton Kapak",
      label: "Karton Kapak",
    },
    {
      value: "Ciltli - Sert Kapak",
      label: "Ciltli - Sert Kapak",
    },
    {
      value: "Set",
      label: "Set",
    },
    {
      value: "Diğer",
      label: "Diğer",
    },
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id))
        .unwrap()
        .then((book) => setBookData(book))
        .catch((error) => {
          console.error("Kitap bilgileri alınamadı:", error);
        });
    } else {
      setBookData({
        isbn: "",
        title: "",
        author: "",
        publisher: "",
        size: "",
        coverType: "",
        price: "",
        shelfDetails: [],
      });
    }
  }, [id, dispatch]);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(updateBook(bookData))
        .then(() => {
          setBookData({
            isbn: "",
            title: "",
            author: "",
            publisher: "",
            size: "",
            coverType: "",
            price: "",
          });
          navigate("/books");
        })
        .catch((error) => {
          console.error("Error saving book:", error);
        });
    } else {
      dispatch(addBook(bookData))
        .then(() => {
          setBookData({
            isbn: "",
            title: "",
            author: "",
            publisher: "",
            size: "",
            coverType: "",
            price: "",
          });
          navigate("/books");
        })
        .catch((error) => {
          console.error("Error adding book:", error);
        });
    }
  };
  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "35ch" } }}
      noValidate
      autoComplete="off"
      alignItems="center"
    >
      <Stack spacing={2} sx={{ display: "inline-flex", m: 3 }}>
        <Typography variant="h5">Kitap Bilgilerini Giriniz</Typography>
        <FormControl variant="standard">
          <TextField
            required
            id="isbn"
            label="ISBN"
            name="isbn"
            value={bookData.isbn}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="standard">
          <TextField
            required
            id="title"
            label="Kitap Adı"
            name="title"
            value={bookData.title}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="standard">
          <TextField
            required
            id="author"
            label="Yazar"
            name="author"
            value={bookData.author}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="standard">
          <TextField
            required
            id="publisher"
            label="Yayınevi"
            name="publisher"
            value={bookData.publisher}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="standard">
          <TextField
            id="size"
            select
            label="Ebat"
            name="size"
            onChange={handleChange}
            value={bookData.size}
          >
            {dimensions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl variant="standard">
          <TextField
            id="coverType"
            select
            label="Kapak Türü"
            name="coverType"
            onChange={handleChange}
            value={bookData.coverType}
          >
            {coverTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <FormControl variant="standard">
          <TextField
            id="price"
            label="Fiyatı"
            name="price"
            onChange={handleChange}
            type="number"
            value={bookData.price}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </FormControl>
        <FormControl variant="standard">
          {id ? (
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              startIcon={<LibraryAddCheckIcon />}
            >
              Güncelle
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              startIcon={<LibraryAddIcon />}
            >
              Ekle
            </Button>
          )}
        </FormControl>
        <Box>
          <List>
            {bookData.shelfDetails && bookData.shelfDetails.length > 0 ? (
              bookData.shelfDetails.map((shelfData, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{index + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      shelfData.location + " - " + shelfData.barcode ||
                      "Raf Lokasyonu Bulunamadı"
                    }
                    secondary={`Adet: ${shelfData.count || 0}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>
                Bu kitap için raf bilgisi bulunmamaktadır.
              </Typography>
            )}
          </List>
        </Box>
      </Stack>
    </Box>
  );
};
export default BookForm;
