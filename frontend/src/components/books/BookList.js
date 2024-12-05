import * as React from "react";
import { useEffect } from "react";
import Spinner from "../Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteBook, fetchBooks, reset } from "../../features/bookSlice";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PublishIcon from "@mui/icons-material/Publish";
import DangerousIcon from "@mui/icons-material/Dangerous";
import SettingsIcon from "@mui/icons-material/Settings";

function EditToolbar(props) {
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        href={"/books/new"}
      >
        Kitap Ekle
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Button
        color="primary"
        size="small"
        startIcon={<PublishIcon />}
        href={"/books/import"}
      >
        Toplu Kitap Yükle
      </Button>
      <Button
        color="error"
        size="small"
        startIcon={<DangerousIcon />}
        href={"/books/drop"}
      >
        Tüm Kitapları Sil
      </Button>
    </GridToolbarContainer>
  );
}

export default function BookList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, isLoading } = useSelector((state) => state.books);
  const [setRows] = React.useState(books);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [selectedBookId, setSelectedBookId] = React.useState(null);

  useEffect(() => {
    if (!books.length) {
      dispatch(fetchBooks());
    }
    return () => books.length > 0 && dispatch(reset());
  }, [books.length, dispatch]);

  const handleDeleteClick = async () => {
    try {
      if (selectedBookId) {
        await dispatch(deleteBook(selectedBookId));
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== selectedBookId),
        );
        setOpen(false);
      }
    } catch (error) {
      console.error("Silme işlemi sırasında hata oluştu:", error);
    }
  };
  const handleEditClick = (id) => {
    return async () => {
      try {
        navigate("/books/" + id);
      } catch (error) {
        console.error("Güncelleme sayfasına giderken hata oldu:", error);
      }
    };
  };
  const handleDeleteDialogOpen = (id) => {
    setSelectedBookId(id);
    setOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setOpen(false);
    setSelectedBookId(null);
  };

  const columns = [
    {
      field: "isbn",
      headerName: "ISBN",
      width: 150,
      editable: false,
    },
    {
      field: "title",
      headerName: "Kitap Adı",
      width: 250,
      editable: false,
    },
    {
      field: "author",
      headerName: "Yazar",
      width: 200,
      editable: false,
    },
    {
      field: "publisher",
      headerName: "Yayınevi",
      width: 150,
      editable: false,
    },
    {
      field: "size",
      headerName: "Ebat",
      width: 150,
      editable: false,
    },
    {
      field: "coverType",
      headerName: "Kapak Türü",
      width: 150,
      editable: false,
    },
    {
      field: "price",
      headerName: "Fiyatı",
      width: 100,
      editable: false,
    },
    {
      field: "totalCount",
      headerName: "Miktarı",
      width: 100,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Kontrol",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<SettingsIcon />}
            label="Detay"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Sil"
            onClick={() => handleDeleteDialogOpen(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return isLoading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={books}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 50,
              },
            },
          }}
          checkboxSelection={false}
          disableRowSelectionOnClick
          getRowId={(books) => books._id}
          rowHeight={30}
          rowModesModel={rowModesModel}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          localeText={{
            toolbarExport: "Çıktı Al",
            toolbarExportCSV: "CSV Çıktı Al",
            toolbarExportPrint: "Yazdır",
            toolbarColumns: "Kolonlar",
            columnsManagementSearchTitle: "Ara",
            columnsManagementShowHideAllText: "Hepsini Göster/Gizle",
            columnsManagementReset: "Sıfırla",
            toolbarFilters: "Filtreler",
            filterPanelOperator: "Operatör",
            filterOperatorContains: "içeren",
            filterOperatorDoesNotContain: "içermeyen",
            filterOperatorEquals: "eşit",
            filterOperatorDoesNotEqual: "eşit değil",
            filterOperatorStartsWith: "başlayan",
            filterOperatorEndsWith: "biten",
            filterOperatorIsEmpty: "boş olan",
            filterOperatorIsNotEmpty: "boş olmayan",
            filterOperatorIsAnyOf: "herhangi biri",
            filterPanelInputPlaceholder: "Değer giriniz",
            filterPanelColumns: "Sütunlar",
            filterPanelInputLabel: "Değer",
          }}
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Kitabı Silmek İstediğinizden Emin misiniz?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu kitabı silerek raflarda bulunan kayıtlarını da sileceksiniz!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Vazgeç</Button>
          <Button onClick={handleDeleteClick} color="error" autofocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
