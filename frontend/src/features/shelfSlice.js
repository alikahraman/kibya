import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/shelves";

const initialState = {
  shelves: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const fetchShelfById = createAsyncThunk(
  "shelves/fetchShelfById",
  async (shelfId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/${shelfId}`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchShelfWithBooksById = createAsyncThunk(
  "shelves/fetchShelfWithBooksById",
  async (shelfId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/${shelfId}`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchShelves = createAsyncThunk(
  "shelves/fetchShelves",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Bütün Rafları Getirirken Hata Oluştu";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addShelf = createAsyncThunk(
  "shelves/addShelf",
  async (newShelf, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, newShelf, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Yeni Raf Girişi Yaparken Hata Oluştu";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addBookToShelf = createAsyncThunk(
  "shelves/addBookToShelf",
  async ({ shelfId, isbn, count, increment, reset, decrease }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `/api/shelves/${shelfId}/addbook`,
        { isbn, count, increment, reset, decrease },
        config,
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Hata oluştu!";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateShelf = createAsyncThunk(
  "shelves/updateShelf",
  async (shelfData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/${shelfData._id}`,
        shelfData,
        config,
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Raf Güncellemesinde Hata Oluştu";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteShelf = createAsyncThunk(
  "shelves/deleteShelf",
  async (shelfId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/${shelfId}`, config);
      return shelfId;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Rafı Silerken Hata Oluştu";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const bulkAddShelves = createAsyncThunk(
  "shelves/bulkAddShelves",
  async (shelves, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(`${API_URL}/import`, shelves, config);
      console.log(response.data);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Toplu Raf ekleme sırasında bir hata oluştu.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const bulkAddBooksToShelves = createAsyncThunk(
  "shelves/bulkAddBooksToShelves",
  async ({ bookEntries }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "/api/shelves/import/bookstoshelves",
        { bookEntries },
        config,
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Toplu kitap ekleme sırasında bir hata oluştu.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteAllShelves = createAsyncThunk(
  "shelves/deleteAllShelves",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(`${API_URL}/drop`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "Tüm rafları silerken hata oluştu.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const shelfSlice = createSlice({
  name: "shelves",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShelfById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShelfById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchShelfById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelves = action.payload;
      })
      .addCase(fetchShelfWithBooksById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShelfWithBooksById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchShelfWithBooksById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelves = action.payload;
      })
      .addCase(fetchShelves.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShelves.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchShelves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelves = action.payload;
      })
      .addCase(addShelf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addShelf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addShelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelves.push(action.payload);
      })
      .addCase(addBookToShelf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBookToShelf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addBookToShelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { shelfId, books } = action.payload;
        const shelfIndex = state.shelves.findIndex(
          (shelf) => shelf.id === shelfId,
        );
        if (shelfIndex !== -1) {
          state.shelves[shelfIndex].books = books;
        }
      })
      .addCase(updateShelf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateShelf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateShelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.shelves.findIndex(
          (shelf) => shelf.id === action.payload.id,
        );
        if (index !== -1) {
          state.shelves[index] = action.payload;
        }
      })
      .addCase(deleteShelf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteShelf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteShelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelves = state.shelves.filter(
          (shelf) => shelf.id !== action.payload,
        );
      })
      .addCase(bulkAddShelves.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(bulkAddShelves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Kitaplar başarıyla eklendi.";
        //todo Eklenen rafların state'e eklenmesi (isteğe bağlı)
        // state.shelves.push(...action.payload.insertedShelves);
      })
      .addCase(bulkAddShelves.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Bir hata oluştu.";
      })
      .addCase(deleteAllShelves.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAllShelves.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.shelves = [];
      })
      .addCase(deleteAllShelves.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(bulkAddBooksToShelves.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(bulkAddBooksToShelves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message =
          action.payload.message || "Başarılı bir şekilde tamamlandı.";
        state.errors = action.payload.errors || [];
      })
      .addCase(bulkAddBooksToShelves.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload || "İşlem sırasında bir hata oluştu.";
      });
  },
});
export const { reset } = shelfSlice.actions;
export default shelfSlice.reducer;
