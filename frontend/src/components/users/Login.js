import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../../features/auth/authSlice";
import Spinner from "../Spinner";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) navigate("/");
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((pervState) => ({
      ...pervState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };
  return isLoading ? (
    <Spinner />
  ) : (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} minHeight={160}>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          size="grow"
          sx={{
            m: 5,
          }}
        >
          <Card>
            <CardContent>
              <Box
                component="form"
                sx={{
                  width: "35ch",
                  p: 3,
                }}
                autoComplete="on"
              >
                <Stack spacing={2}>
                  <Typography variant="h5" component="div">
                    Lütfen Giriş Yapınız
                  </Typography>
                  <TextField
                    id="email"
                    name="email"
                    label="E-Mail"
                    variant="outlined"
                    onChange={onChange}
                  />
                  <TextField
                    id="password"
                    name="password"
                    label="Şifre"
                    type="password"
                    autoComplete="current-password"
                    onChange={onChange}
                  />
                  <Button variant="contained" size="large" onClick={onSubmit}>
                    Giriş
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Login;
