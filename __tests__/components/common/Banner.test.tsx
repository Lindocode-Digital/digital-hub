import React from "react";
import { render, screen } from "@testing-library/react";
import Banner from "@/components/common/Banner";

describe("Banner", () => {
  it("renders the default left text", () => {
    render(<Banner />);
    expect(screen.getByText("INNOVATE.")).toBeInTheDocument();
  });

  it("renders the default middle text", () => {
    render(<Banner />);
    expect(screen.getByText("BUILD.")).toBeInTheDocument();
  });

  it("renders the default right text", () => {
    render(<Banner />);
    expect(screen.getByText("SCALE.")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Banner />);
    expect(screen.getByText("Elegant Simplicity")).toBeInTheDocument();
  });

  it("renders custom textLeft prop", () => {
    render(<Banner textLeft="DREAM." />);
    expect(screen.getByText("DREAM.")).toBeInTheDocument();
  });

  it("renders custom textMiddle prop", () => {
    render(<Banner textMiddle="SHIP." />);
    expect(screen.getByText("SHIP.")).toBeInTheDocument();
  });

  it("renders custom textRight prop", () => {
    render(<Banner textRight="GROW." />);
    expect(screen.getByText("GROW.")).toBeInTheDocument();
  });

  it("wraps content in a section element", () => {
    const { container } = render(<Banner />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });
});
