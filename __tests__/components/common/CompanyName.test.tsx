import React from "react";
import { render, screen } from "@testing-library/react";
import CompanyName from "@/components/common/CompanyName";

describe("CompanyName", () => {
  it("renders the hidden h1 for SEO", () => {
    render(<CompanyName />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveClass("sr-only");
    expect(h1).toHaveTextContent("Digital Hub");
  });

  it("renders the visible 'Digital' word", () => {
    render(<CompanyName />);
    // The visible brand name is split across spans: 'D' + 'igital'
    expect(screen.getByText("igital")).toBeInTheDocument();
  });

  it("renders the 'Hub' brand mark in red", () => {
    render(<CompanyName />);
    const hub = screen.getByText("Hub");
    expect(hub).toHaveClass("text-red-600");
  });

  it("renders the trademark symbol", () => {
    render(<CompanyName />);
    expect(screen.getByText("™")).toBeInTheDocument();
  });

  it("renders the LINDOCODE side letters", () => {
    render(<CompanyName />);
    // Each letter is rendered as an individual span
    expect(screen.getByText("L")).toBeInTheDocument();
    expect(screen.getByText("I")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("renders inside a header element", () => {
    const { container } = render(<CompanyName />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });
});
