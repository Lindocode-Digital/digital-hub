import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "@/app/not-found";

describe("NotFound page", () => {
  it("shows Error 404 label", () => {
    render(<NotFound />);
    expect(screen.getByText(/error 404/i)).toBeInTheDocument();
  });

  it("shows the lost in the system heading", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: /lost in the system/i }),
    ).toBeInTheDocument();
  });

  it("shows the explanatory paragraph", () => {
    render(<NotFound />);
    expect(screen.getByText(/does not exist, was moved, or never went live/i)).toBeInTheDocument();
  });

  it("renders a return home link", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /return home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://lindocode.com/");
  });

  it("renders inside a main element", () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector("main")).toBeInTheDocument();
  });
});
