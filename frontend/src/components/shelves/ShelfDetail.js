import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import {
  deleteShelf,
  fetchShelfWithBooksById,
} from "../../features/shelfSlice";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const ShelfDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { shelves, status, error } = useSelector((state) => state.shelves);
  const [open, setOpen] = React.useState(false);

  const handleDeleteDialogOpen = () => {
    setOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setOpen(false);
  };

  const handleDeleteShelfApprove = (id) => {
    return async () => {
      try {
        await dispatch(deleteShelf(id));
        setOpen(false);
        navigate("/shelves");
      } catch (error) {
        console.error(
          "Rafı Silip Raf Listesi Sayfasında Giderken Hata Oldu:",
          error,
        );
      }
    };
  };

  const handleAddBookToShelfClick = (id) => {
    return async () => {
      try {
        navigate("/shelves/" + id + "/add");
      } catch (error) {
        console.error(
          "Rafa Kitap Ekleme Sayfasında Giderken Hata Oldu:",
          error,
        );
      }
    };
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
      <Container maxWidth="sm">
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 16 }}
            >
              {shelf?.barcode || "Barkod bulunamadı"}
            </Typography>
            <Typography variant="h2" component="div">
              {shelf?.location || "Lokasyon bulunamadı"}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleAddBookToShelfClick(id)}>
              Rafa Kitap Ekle
            </Button>
            <Button
              size="small"
              color="error"
              align="right"
              onClick={handleDeleteDialogOpen}
            >
              Rafı Sil
            </Button>
          </CardActions>
        </Card>

        <List sx={{ width: "100%", maxWidth: 360 }}>
          {shelf?.books?.length > 0 ? (
            shelf.books.map((book, index) => (
              <ListItem key={index}>
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
      </Container>
      <Dialog
        open={open}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Silmek İstediğinizden Emin misiniz?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu rafı silerek içindeki bütün kitap miktarı bilgilerini de
            sileceksiniz!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Reddet</Button>
          <Button onClick={handleDeleteShelfApprove(id)}>Kabul et</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ShelfDetails;
