import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addShelf } from "../../features/shelfSlice";
import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

export default function ShelfInsert() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shelfData, setShelfData] = useState({
    location: "",
    barcode: "",
  });

  const handleChange = (e) => {
    setShelfData({ ...shelfData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addShelf(shelfData))
      .then(() => {
        setShelfData({
          location: "",
          barcode: "",
        });
        navigate("/shelves");
      })
      .catch((error) => {
        console.error("Raf Eklemede Hata: ", error);
      });
  };
  return (
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
        <Typography variant="h5" component="div">
          Raf Bilgilerini Giriniz
        </Typography>
        <FormControl>
          <TextField
            required
            id="location"
            label="Lokasyon"
            name="location"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            id="barcode"
            label="Barkod"
            name="barcode"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="standard">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            startIcon={<LibraryAddIcon />}
          >
            Ekle
          </Button>
        </FormControl>
      </Stack>
    </Box>
  );
}
