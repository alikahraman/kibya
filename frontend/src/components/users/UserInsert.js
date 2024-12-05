import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../features/userSlice";
import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function UserInsert() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(userData))
      .then(() => {
        setUserData({
          name: "",
          email: "",
          password: "",
          password2: "",
        });
        navigate("/users");
      })
      .catch((error) => {
        console.error("Kullanıcı Eklemede Hata: ", error);
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
          Kullanıcı Bilgilerini Giriniz
        </Typography>
        <FormControl>
          <TextField
            required
            id="name"
            label="İsim"
            name="name"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            id="email"
            label="E-Mail"
            name="email"
            type="email"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            id="password"
            label="Şifre"
            name="password"
            type="password"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <TextField
            required
            id="password2"
            label="Şifre Tekrarı"
            name="password2"
            type="password"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl variant="standard">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            startIcon={<PersonAddIcon />}
          >
            Ekle
          </Button>
        </FormControl>
      </Stack>
    </Box>
  );
}
