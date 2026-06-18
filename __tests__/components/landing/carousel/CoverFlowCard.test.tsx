import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CoverFlowCard from "@/components/landing/carousel/CoverFlowCard";
import type { Project } from "@/lib/projects";

const baseProject: Project = {
  cardId: "01",
  slug: "/test",
  title: "Test Project",
  cardTitle: "TEST",
  cardSubtitle: "Testing",
  description: ["Short desc", "Long desc for overlay"],
  image: "https://example.com/cover.jpg",
  link: "https://example.com",
  domain: "example.com",
};

function renderCard(overrides?: Partial<Parameters<typeof CoverFlowCard>[0]>) {
  const onAction = jest.fn();
  const result = render(
    <CoverFlowCard
      cover={baseProject}
      isActive={false}
      offset={0}
      indexLabel="01"
      onAction={onAction}
      {...overrides}
    />,
  );
  return { ...result, onAction };
}

describe("CoverFlowCard — rendering", () => {
  it("renders the card title", () => {
    renderCard();
    expect(screen.getByText("TEST")).toBeInTheDocument();
  });

  it("renders the card subtitle chip", () => {
    renderCard();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("renders the short description", () => {
    renderCard();
    expect(screen.getByText("Short desc")).toBeInTheDocument();
  });

  it("renders the index label", () => {
    renderCard();
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders the project image", () => {
    renderCard();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", baseProject.image);
  });

  it("renders the project title as floating label", () => {
    renderCard();
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("uses cover.title as aria-label fallback", () => {
    renderCard();
    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-label", "Test Project");
  });

  it("uses cover.alt as aria-label when provided", () => {
    renderCard({ cover: { ...baseProject, alt: "Custom alt" } as any });
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Custom alt");
  });
});

describe("CoverFlowCard — active state", () => {
  it("applies the active CSS class when isActive is true", () => {
    renderCard({ isActive: true });
    expect(screen.getByRole("button")).toHaveClass("active");
  });

  it("does not apply active class when isActive is false", () => {
    renderCard({ isActive: false });
    expect(screen.getByRole("button")).not.toHaveClass("active");
  });

  it("shows cursor pointer when active and has a link", () => {
    renderCard({ isActive: true });
    const card = screen.getByRole("button");
    expect(card).toHaveStyle({ cursor: "pointer" });
  });
});

describe("CoverFlowCard — accessibility", () => {
  it("has role=button", () => {
    renderCard();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is keyboard focusable via tabIndex=0", () => {
    renderCard();
    expect(screen.getByRole("button")).toHaveAttribute("tabindex", "0");
  });

  it("has aria-pressed reflecting isActive", () => {
    renderCard({ isActive: true });
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("aria-pressed is false when not active", () => {
    renderCard({ isActive: false });
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});

describe("CoverFlowCard — interactions", () => {
  it("calls onAction when clicked", () => {
    const { onAction } = renderCard();
    fireEvent.click(screen.getByRole("button"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onAction when Enter is pressed", () => {
    const { onAction } = renderCard();
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("calls onAction when Space is pressed", () => {
    const { onAction } = renderCard();
    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("does not call onAction for other key presses", () => {
    const { onAction } = renderCard();
    fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" });
    expect(onAction).not.toHaveBeenCalled();
  });
});
