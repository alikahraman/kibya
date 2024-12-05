import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { trTR } from "@mui/material/locale";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Login from "./components/users/Login";
import UserList from "./components/users/UserList";
import UserInsert from "./components/users/UserInsert";
import BookList from "./components/books/BookList";
import BookForm from "./components/books/BookForm";
import ShelfList from "./components/shelves/ShelfList";
import ShelfDetail from "./components/shelves/ShelfDetail";
import ShelfInsert from "./components/shelves/ShelfInsert";
import ShelfAddBook from "./components/shelves/ShelfAddBook";
import BookImport from "./components/imports/BookImport";
import ShelfImport from "./components/imports/ShelfImport";
import BooksToShelvesImport from "./components/imports/BooksToShelvesImport";
import BookDrop from "./components/drops/BookDrop";
import ShelfDrop from "./components/drops/ShelfDrop";

const globalStyles = {
  ".container": {
    width: "100%",
    maxWidth: "1250px",
    margin: "0 auto",
    textAlign: "center",
  },
};

const theme = createTheme({
  typography: {
    fontFamily: '"JetBrains Mono", serif',
  },
  trTR,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserInsert />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/:id" element={<BookForm />} />
            <Route path="/books/import" element={<BookImport />} />
            <Route path="/books/drop" element={<BookDrop />} />
            <Route path="/shelves" element={<ShelfList />} />
            <Route path="/shelves/new" element={<ShelfInsert />} />
            <Route path="/shelves/:id" element={<ShelfDetail />} />
            <Route path="/shelves/:id/add" element={<ShelfAddBook />} />
            <Route path="/shelves/import" element={<ShelfImport />} />
            <Route
              path="/shelves/import/bookstoshelves"
              element={<BooksToShelvesImport />}
            />
            <Route path="/shelves/drop" element={<ShelfDrop />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
