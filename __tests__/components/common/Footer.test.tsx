import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/common/Footer";

describe("Footer", () => {
  it("renders the LinkedIn link", () => {
    render(<Footer />);
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedin).toBeInTheDocument();
    expect(linkedin).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
  });

  it("renders the GitHub link", () => {
    render(<Footer />);
    const github = screen.getByRole("link", { name: /github/i });
    expect(github).toBeInTheDocument();
    expect(github).toHaveAttribute("href", expect.stringContaining("github.com"));
  });

  it("opens social links in a new tab", () => {
    render(<Footer />);
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    const github = screen.getByRole("link", { name: /github/i });
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("target", "_blank");
  });

  it("social links have noopener noreferrer rel", () => {
    render(<Footer />);
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays the current year in the copyright", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("mentions Lindocode in copyright text", () => {
    render(<Footer />);
    expect(screen.getByText(/Lindocode/i)).toBeInTheDocument();
  });

  it("renders inside a footer element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
