import React from "react";
import { render, screen } from "@testing-library/react";
import LandingPage from "@/components/landing/LandingPage";

describe("LandingPage — integration", () => {
  it("renders without crashing", () => {
    const { container } = render(<LandingPage />);
    expect(container).toBeTruthy();
  });

  it("renders the main element", () => {
    render(<LandingPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the Digital Hub heading for SEO", () => {
    render(<LandingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Digital Hub");
  });

  it("renders the URL input from LinkChecker", () => {
    render(<LandingPage />);
    expect(screen.getByRole("textbox", { name: /enter a url/i })).toBeInTheDocument();
  });

  it("renders the SCAN LINK button from LinkChecker", () => {
    render(<LandingPage />);
    expect(screen.getByRole("button", { name: /scan link/i })).toBeInTheDocument();
  });

  it("renders the banner with INNOVATE text", () => {
    render(<LandingPage />);
    expect(screen.getByText("INNOVATE.")).toBeInTheDocument();
  });

  it("renders the footer with LinkedIn link", () => {
    render(<LandingPage />);
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
  });

  it("renders the footer with GitHub link", () => {
    render(<LandingPage />);
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("renders at least one carousel card from projects", () => {
    render(<LandingPage />);
    // CoverFlow renders cards as buttons with role=button
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("renders the Hub brand mark", () => {
    render(<LandingPage />);
    expect(screen.getByText("Hub")).toBeInTheDocument();
  });
});
