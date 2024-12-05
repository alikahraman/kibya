import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import axios from "axios";
import shelfReducer, {
  addBookToShelf,
  addShelf,
  bulkAddBooksToShelves,
  bulkAddShelves,
  deleteAllShelves,
  deleteShelf,
  fetchShelfById,
  fetchShelfWithBooksById,
  fetchShelves,
  reset,
  updateShelf,
} from "../features/shelfSlice";

jest.mock("axios");

axios.get.mockResolvedValueOnce({
  data: [{ id: 1, location: "X01", books: [] }],
});
axios.get.mockRejectedValueOnce(new Error("Fetch error"));

const createTestStore = (initialState) => {
  return configureStore({
    reducer: {
      shelves: shelfReducer,
      auth: (state = { user: { token: "test-token" } }) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
    preloadedState: initialState,
  });
};

describe("shelfSlice", () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      shelves: {
        shelves: [],
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
        shelves: [],
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      };
      const result = shelfReducer(undefined, { type: "@@INIT" });
      expect(result).toEqual(initialState);
    });
    it("state reset testi", () => {
      store.dispatch(reset());
      const state = store.getState().shelves;
      expect(state).toEqual({
        shelves: [],
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      });
    });
  });

  describe("Async Thunks", () => {
    it("should handle fetchShelves success", async () => {
      const mockShelves = [{ id: 1, location: "X01", books: [] }];
      axios.get.mockResolvedValueOnce({ data: mockShelves });
      await store.dispatch(fetchShelves());
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.shelves).toEqual(mockShelves);
    });

    it("should handle fetchShelves failure", async () => {
      axios.get.mockRejectedValueOnce(new Error("Fetch error"));
      await store.dispatch(fetchShelves());
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Fetch error");
    });

    it("should handle addShelf success", async () => {
      const newShelf = { location: "Z01" };
      axios.post.mockResolvedValueOnce({ data: newShelf });
      await store.dispatch(addShelf(newShelf));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.shelves).toContainEqual(newShelf);
    });

    it("should handle addShelf failure", async () => {
      const newShelf = { location: "Z01" };
      axios.post.mockRejectedValueOnce(new Error("Failed to add shelf"));
      await store.dispatch(addShelf(newShelf));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to add shelf");
    });

    it("should handle fetchShelfById success", async () => {
      const mockShelf = { id: 1, location: "X01", books: [] };
      axios.get.mockResolvedValueOnce({ data: [mockShelf] });
      await store.dispatch(fetchShelfById(1));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.shelves).toContainEqual(mockShelf);
    });

    it("should handle fetchShelfById failure", async () => {
      axios.get.mockRejectedValueOnce(new Error("Fetch error"));
      await store.dispatch(fetchShelfById(1));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Fetch error");
    });

    it("should handle fetchShelfWithBooksById success", async () => {
      const mockShelfWithBooks = { id: 1, location: "X01", books: [] };
      axios.get.mockResolvedValueOnce({ data: mockShelfWithBooks });
      await store.dispatch(fetchShelfWithBooksById(1));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.shelves).toContainEqual(mockShelfWithBooks);
    });

    it("should handle fetchShelfWithBooksById failure", async () => {
      axios.get.mockRejectedValueOnce(new Error("Fetch error"));
      await store.dispatch(fetchShelfWithBooksById(1));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Fetch error");
    });

    //todo addbooktoshelf success

    it("should handle addBookToShelf failure", async () => {
      axios.put.mockRejectedValueOnce(new Error("Failed to add book to shelf"));
      await store.dispatch(
        addBookToShelf({ shelfId: 1, isbn: "12345", count: 5 }),
      );
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to add book to shelf");
    });

    it("should handle updateShelf failure", async () => {
      const updatedShelf = { id: 1, location: "Y01" };
      axios.put.mockRejectedValueOnce(new Error("Failed to update shelf"));
      await store.dispatch(updateShelf(updatedShelf));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to update shelf");
    });

    it("should handle deleteShelf success", async () => {
      axios.delete.mockResolvedValueOnce({});
      await store.dispatch(deleteShelf(1));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.shelves.length).toBe(0);
    });

    it("should handle deleteShelf fail", async () => {
      axios.delete.mockRejectedValueOnce(
        new Error("Failed to delete all shelves"),
      );
      await store.dispatch(deleteShelf(1));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to delete all shelves");
    });

    it("should handle bulkAddShelves success", async () => {
      const shelves = [{ location: "Z01" }];
      axios.post.mockResolvedValueOnce({ data: { message: "Success" } });
      await store.dispatch(bulkAddShelves(shelves));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.message).toBe("Success");
    });

    it("should handle bulkAddShelves failure", async () => {
      const shelves = [{ location: "Z01" }];
      axios.post.mockRejectedValueOnce(new Error("Bulk add failed"));
      await store.dispatch(bulkAddShelves(shelves));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Bulk add failed");
    });

    it("should handle deleteAllShelves success", async () => {
      axios.delete.mockResolvedValueOnce({ data: "All shelves deleted" });
      await store.dispatch(deleteAllShelves());
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.shelves).toEqual([]);
    });

    it("should handle deleteAllShelves failure", async () => {
      axios.delete.mockRejectedValueOnce(
        new Error("Failed to delete all shelves"),
      );
      await store.dispatch(deleteAllShelves());
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to delete all shelves");
    });

    it("should handle bulkAddBooksToShelves success", async () => {
      const bookEntries = [{ shelfId: 1, isbn: "123456", count: 5 }];
      axios.post.mockResolvedValueOnce({
        data: { message: "Books added", errors: [] },
      });
      await store.dispatch(bulkAddBooksToShelves({ bookEntries }));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isSuccess).toBe(true);
      expect(state.message).toBe("Books added");
      expect(state.errors).toEqual([]);
    });

    it("should handle bulkAddBooksToShelves failure", async () => {
      axios.post.mockRejectedValueOnce(new Error("Failed to add books"));
      const bookEntries = [{ shelfId: 1, isbn: "123456", count: 5 }];
      await store.dispatch(bulkAddBooksToShelves({ bookEntries }));
      const state = store.getState().shelves;
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(true);
      expect(state.message).toBe("Failed to add books");
    });
  });
});
