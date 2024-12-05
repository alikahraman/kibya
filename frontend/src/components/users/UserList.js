import * as React from "react";
import { useEffect } from "react";
import Spinner from "../Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, fetchUsers, reset } from "../../features/userSlice";
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const addUserClick = () => {
    navigate("/users/new");
  };
  const deleteUserClick = (id) => {
    return async () => {
      try {
        await dispatch(deleteUser(id));
        navigate("/users");
      } catch (error) {
        console.error("Detay Sayfasına Giderken Hata Oldu:", error);
      }
    };
  };

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
    return () => users.length > 0 && dispatch(reset());
  }, [users.length, dispatch]);

  return isLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Container maxWidth="sm">
        <Box
          sx={{
            width: "100%",
            alignItems: "center",
            display: "block",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ m: 5 }}>
              Kullanıcı Listesi
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={addUserClick}
            >
              Kullanıcı Ekle
            </Button>
          </Box>
          <List
            dense={true}
            sx={{
              width: "100%",
              alignItems: "stretch",
              m: 1,
            }}
          >
            {users.length > 0 ? (
              users.map((userData, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      color="error"
                      edge="end"
                      aria-label="delete"
                      onClick={deleteUserClick(userData._id)}
                      disabled={user._id === userData._id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{index + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={userData.name || "Kullanıcı Adı Bulunamadı"}
                    secondary={userData.email || "Kullanıcı Maili Bulunamadı"}
                  />
                </ListItem>
              ))
            ) : (
              <Spinner />
            )}
          </List>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default UserList;
