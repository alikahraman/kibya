import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchShelves } from "../../features/shelfSlice";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import PublishIcon from "@mui/icons-material/Publish";
import DangerousIcon from "@mui/icons-material/Dangerous";

function EditToolbar(props) {
  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        href={"/shelves/new"}
      >
        Raf Ekle
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Button
        color="primary"
        size="small"
        startIcon={<PublishIcon />}
        href={"/shelves/import"}
      >
        Toplu Raf Yükle
      </Button>
      <Button
        color="primary"
        size="small"
        startIcon={<PublishIcon />}
        href={"/shelves/import/bookstoshelves"}
      >
        Toplu Raflara Kitap Yükle
      </Button>
      <Button
        color="error"
        size="small"
        startIcon={<DangerousIcon />}
        href={"/shelves/drop"}
      >
        Tüm Rafları Sil
      </Button>
    </GridToolbarContainer>
  );
}

export default function ShellList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shelves, isLoading } = useSelector((state) => state.shelves);
  const [setRows] = React.useState(shelves);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [shelvesData, setShelvesData] = useState([]);

  const initialFetchRef = useRef(true);

  useEffect(() => {
    if (initialFetchRef.current) {
      dispatch(fetchShelves(shelves));
      initialFetchRef.current = false;
    } else {
      const processedShelves = shelves.map((shelf) => {
        const { _id, location, barcode, books } = shelf;
        const bookCount = books.length;
        const totalCount = books.reduce((total, book) => {
          if (book.count) {
            const countNumber = parseInt(book.count, 10);
            if (!isNaN(countNumber)) {
              return total + countNumber;
            }
          }
          console.error("Unexpected data:", book.count);
          return total;
        }, 0);
        return {
          _id,
          location,
          barcode,
          bookCount,
          totalCount,
        };
      });
      setShelvesData(processedShelves);
    }
  }, [shelves, dispatch]);

  const handleDetailClick = (id) => {
    return async () => {
      try {
        navigate("/shelves/" + id);
      } catch (error) {
        console.error("Detay Sayfasına Giderken Hata Oldu:", error);
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

  const columns = [
    {
      field: "location",
      headerName: "Lokasyon",
      width: 150,
      editable: false,
    },
    {
      field: "barcode",
      headerName: "Barkod",
      width: 150,
      editable: false,
    },
    {
      field: "bookCount",
      headerName: "Kitap Miktarı",
      width: 150,
      editable: false,
    },
    {
      field: "totalCount",
      headerName: "Toplam Miktar",
      width: 150,
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
            icon={<FindInPageIcon />}
            label="Raf Detay"
            className="textPrimary"
            onClick={handleDetailClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<FileOpenIcon />}
            label="Rafa Kitap Ekleme"
            className="textPrimary"
            onClick={handleAddBookToShelfClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return isLoading ? (
    <Spinner />
  ) : (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={shelvesData}
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
        getRowId={(shelvesData) => shelvesData._id}
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
  );
}
