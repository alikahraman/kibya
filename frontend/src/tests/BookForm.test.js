import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookForm from "../components/books/BookForm";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router } from "react-router-dom";
import { bookSlice } from "../features/bookSlice";

const store = configureStore({
  reducer: {
    book: bookSlice.reducer,
  },
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const renderWithStoreAndRouter = (component) => {
  return render(
    <Provider store={store}>
      <Router>{component}</Router>
    </Provider>,
  );
};

describe("BookForm Component", () => {
  test("input değişikliği testi", () => {
    renderWithStoreAndRouter(<BookForm />);
    fireEvent.change(screen.getByLabelText(/isbn/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/kitap adı/i), {
      target: { value: "Test Kitap" },
    });
    expect(screen.getByLabelText(/isbn/i).value).toBe("1234567890");
    expect(screen.getByLabelText(/kitap adı/i).value).toBe("Test Kitap");
  });
  test("input görüntüsü testi", () => {
    renderWithStoreAndRouter(<BookForm />);
    expect(screen.getByLabelText(/ISBN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kitap Adı/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yazar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yayınevi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ebat/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kapak Türü/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fiyatı/i)).toBeInTheDocument();
  });
  test("form gönderme testi", async () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockReturnValue(navigateMock);
    renderWithStoreAndRouter(<BookForm />);
    fireEvent.change(screen.getByLabelText(/ISBN/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Kitap Adı/i), {
      target: { value: "Test Kitap" },
    });
    fireEvent.change(screen.getByLabelText(/Yazar/i), {
      target: { value: "Test Yazar" },
    });
    fireEvent.change(screen.getByLabelText(/Yayınevi/i), {
      target: { value: "Test Yayınevi" },
    });
    fireEvent.change(screen.getByLabelText(/Fiyatı/i), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByText(/Ekle/i));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/books");
    });
  });
  test("raf bilgisi bulunamadı testi", () => {
    const bookWithNoShelfDetails = {
      isbn: "1234567890",
      title: "Test Kitap",
      author: "Test Yazar",
      publisher: "Test Yayınevi",
      size: "13,5 x 21 cm",
      coverType: "Karton Kapak",
      price: "100",
      shelfDetails: [],
    };
    renderWithStoreAndRouter(<BookForm book={bookWithNoShelfDetails} />);
    expect(
      screen.getByText("Bu kitap için raf bilgisi bulunmamaktadır."),
    ).toBeInTheDocument();
  });
  //todo Raf Bilgisi Görüntüleme Testi
});
