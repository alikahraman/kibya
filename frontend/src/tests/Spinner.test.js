import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Spinner from "../components/Spinner";

describe("Spinner Component", () => {
  test("CircularProgress aracının görüntülenme testi", async () => {
    await act(async () => {
      render(<Spinner />);
    });

    const spinnerElement = screen.getByRole("progressbar");
    expect(spinnerElement).toBeInTheDocument();
  });

  test("doğru şablon gösterimi testi", async () => {
    await act(async () => {
      render(<Spinner />);
    });

    const box = screen.getByTestId("spinner-box");
    const grid = screen.getByTestId("spinner-grid");
    expect(box).toBeInTheDocument();
    expect(grid).toBeInTheDocument();
  });
});
