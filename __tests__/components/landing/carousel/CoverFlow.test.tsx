import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import CoverFlow from "@/components/landing/carousel/CoverFlow";
import type { Project } from "@/lib/projects";

// Prevent network calls from the validation fetch inside ProjectOverlay
let savedFetch: typeof global.fetch;
beforeAll(() => { savedFetch = global.fetch; });
beforeEach(() => {
  global.fetch = jest.fn().mockRejectedValue(new Error("fetch blocked in tests")) as typeof global.fetch;
});
afterEach(() => {
  global.fetch = savedFetch;
});

const covers: Project[] = [
  {
    cardId: "01",
    slug: "/one",
    title: "Alpha",
    cardTitle: "ALPHA",
    cardSubtitle: "One",
    description: ["Alpha short", "Alpha long"],
    image: "https://example.com/a.jpg",
    link: "https://alpha.com",
    domain: "alpha.com",
  },
  {
    cardId: "02",
    slug: "/two",
    title: "Beta",
    cardTitle: "BETA",
    cardSubtitle: "Two",
    description: ["Beta short", "Beta long"],
    image: "https://example.com/b.jpg",
    link: "https://beta.com",
    domain: "beta.com",
  },
  {
    cardId: "03",
    slug: "/three",
    title: "Gamma",
    cardTitle: "GAMMA",
    cardSubtitle: "Three",
    description: ["Gamma short", "Gamma long"],
    image: "https://example.com/c.jpg",
    link: "https://gamma.com",
    domain: "gamma.com",
  },
];

describe("CoverFlow — rendering", () => {
  it("renders all cover cards", () => {
    render(<CoverFlow covers={covers} />);
    expect(screen.getAllByRole("button")).toHaveLength(covers.length);
  });

  it("renders each cover title", () => {
    render(<CoverFlow covers={covers} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("renders the coverflow wrapper", () => {
    const { container } = render(<CoverFlow covers={covers} />);
    expect(container.querySelector(".coverflow-wrapper")).toBeInTheDocument();
  });

  it("renders no cards when covers array is empty", () => {
    render(<CoverFlow covers={[]} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

describe("CoverFlow — card selection", () => {
  it("marks exactly one card as active initially", () => {
    render(<CoverFlow covers={covers} />);
    const buttons = screen.getAllByRole("button");
    const activeCards = buttons.filter((b) => b.classList.contains("active"));
    expect(activeCards).toHaveLength(1);
  });

  it("clicking an inactive card makes it active", () => {
    render(<CoverFlow covers={covers} />);
    const buttons = screen.getAllByRole("button");
    const inactiveCard = buttons.find((b) => !b.classList.contains("active"))!;
    fireEvent.click(inactiveCard);
    expect(inactiveCard).toHaveClass("active");
  });

  it("only one card is active after clicking a different card", () => {
    render(<CoverFlow covers={covers} />);
    const buttons = screen.getAllByRole("button");
    const inactiveCard = buttons.find((b) => !b.classList.contains("active"))!;
    fireEvent.click(inactiveCard);
    const activeCards = screen.getAllByRole("button").filter((b) => b.classList.contains("active"));
    expect(activeCards).toHaveLength(1);
  });
});

describe("CoverFlow — overlay", () => {
  it("opens the overlay when the active card is clicked", async () => {
    render(<CoverFlow covers={covers} />);
    const buttons = screen.getAllByRole("button");
    // Find the already-active card and click it
    const activeCard = buttons.find((b) => b.classList.contains("active"))!;
    fireEvent.click(activeCard);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("overlay shows the active project title as a heading", async () => {
    render(<CoverFlow covers={covers} />);
    const buttons = screen.getAllByRole("button");
    const activeCard = buttons.find((b) => b.classList.contains("active"))!;
    const label = activeCard.getAttribute("aria-label") ?? "";
    fireEvent.click(activeCard);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    // Title appears as a heading inside the dialog (also exists in card, so scope to dialog)
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: new RegExp(label, "i") })).toBeInTheDocument();
  });

  it("closes overlay via the close button", async () => {
    render(<CoverFlow covers={covers} />);
    const buttons = screen.getAllByRole("button");
    const activeCard = buttons.find((b) => b.classList.contains("active"))!;
    fireEvent.click(activeCard);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});
