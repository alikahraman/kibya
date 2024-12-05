import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import axios from "axios";
import bookReducer, {
  addBook,
  bulkAddBooks,
  deleteAllBooks,
  deleteBook,
  fetchBookById,
  fetchBooks,
  reset,
  updateBook,
} from "../features/bookSlice";

jest.mock("axios");

axios.get.mockResolvedValueOnce({ data: [{ id: 1, title: "Test Kitabı" }] });
axios.get.mockRejectedValueOnce(new Error("Fetch error"));

const createTestStore = (initialState) => {
  return configureStore({
    reducer: {
      books: bookReducer,
      auth: (state = { user: { token: "test-token" } }) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
    preloadedState: initialState,
  });
};

describe("bookSlice", () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      books: {
        books: [],
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Reducers", () => {
    it("ilk açılışta initial state dönüş testi", () => {
      const initialState = {
        books: [],
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      };
      const result = bookReducer(undefined, { type: "@@INIT" });
      expect(result).toEqual(initialState);
    });
    it("state reset testi", () => {
      store.dispatch(reset());
      const state = store.getState().books;
      expect(state).toEqual({
        books: [],
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      });
    });
  });
  describe("Async Thunks", () => {
    it("bütün kitapları çekme testi", async () => {
      const mockBooks = [{ id: 1, title: "Test Kitabı" }];
      axios.get.mockResolvedValueOnce({ data: mockBooks });
      await store.dispatch(fetchBooks());
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.books).toEqual(mockBooks);
    });
    it("bütün kitapları çekme hatası testi", async () => {
      axios.get.mockRejectedValueOnce(new Error("Fetch error"));
      await store.dispatch(fetchBooks());
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Fetch error");
    });
    it("id değerine göre kitap çekme testi", async () => {
      const mockBook = [{ id: 1, title: "Test Kitabı" }];
      axios.get.mockResolvedValueOnce({ data: mockBook });
      await store.dispatch(fetchBookById(1));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.books).toEqual(mockBook);
    });
    it("id değerine göre kitap çekme hatası testi", async () => {
      axios.get.mockRejectedValueOnce(new Error("Fetch error"));
      await store.dispatch(fetchBookById(1));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Fetch error");
    });
    it("kitap ekleme testi", async () => {
      const newBook = { id: 2, title: "Yeni Kitap" };
      axios.post.mockResolvedValueOnce({ data: newBook });
      await store.dispatch(addBook(newBook));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.books).toContainEqual(newBook);
    });
    it("kitap ekleme hatası testi", async () => {
      const newBook = { id: 2, title: "Yeni Kitap" };
      axios.post.mockRejectedValueOnce(new Error("Add Book error"));
      await store.dispatch(addBook(newBook));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Add Book error");
    });
    it("kitap güncelleme testi", async () => {
      const updatedBook = { id: 1, title: "Güncel Kitap" };
      axios.put.mockResolvedValueOnce({ data: updatedBook });
      store.dispatch(fetchBooks());
      await store.dispatch(updateBook(updatedBook));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.books).toContainEqual(updatedBook);
    });
    it("kitap güncelleme hatası testi", async () => {
      const updatedBook = { id: 1, title: "Güncel Kitap" };
      axios.put.mockRejectedValueOnce(new Error("Update error"));
      await store.dispatch(updateBook(updatedBook));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Update error");
    });
    it("kitap silme testi", async () => {
      axios.delete.mockResolvedValueOnce({ data: { id: 1 } });
      await store.dispatch(deleteBook(1));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.books).not.toContainEqual({ id: 1, title: "Test Kitabı" });
    });
    it("kitap silme hatası testi", async () => {
      axios.delete.mockRejectedValueOnce(new Error("Delete error"));
      await store.dispatch(deleteBook(1));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Delete error");
    });
    it("toplu kitap ekleme testi", async () => {
      const books = [
        { id: 1, title: "Kitap 1" },
        { id: 2, title: "Kitap 2" },
      ];
      axios.post.mockResolvedValueOnce({ data: { message: "Books added" } });
      await store.dispatch(bulkAddBooks(books));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.message).toBe("Books added");
    });
    it("toplu kitap ekleme hatası testi", async () => {
      const books = [{ id: 1, title: "Kitap 1" }];
      axios.post.mockRejectedValueOnce(new Error("Bulk add error"));
      await store.dispatch(bulkAddBooks(books));
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Bulk add error");
    });
    it("bütün kitapları silme testi", async () => {
      axios.delete.mockResolvedValueOnce({
        data: { message: "All books deleted" },
      });
      await store.dispatch(deleteAllBooks());
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.books).toEqual([]);
    });
    it("bütün kitapları silme hatası testi", async () => {
      axios.delete.mockRejectedValueOnce(new Error("Delete all books error"));
      await store.dispatch(deleteAllBooks());
      const state = store.getState().books;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Delete all books error");
    });
  });
});
