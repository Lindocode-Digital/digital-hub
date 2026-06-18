import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectOverlay from "@/components/landing/overlay/ProjectOverlay";
import type { Project } from "@/lib/projects";

// Prevent real network calls from the link-check validation effect
let savedFetch: typeof global.fetch;
beforeAll(() => { savedFetch = global.fetch; });
beforeEach(() => {
  global.fetch = jest.fn().mockRejectedValue(new Error("fetch blocked in tests")) as typeof global.fetch;
});
afterEach(() => {
  global.fetch = savedFetch;
});

const showcaseProject: Project = {
  cardId: "01",
  slug: "/showcase",
  title: "Showcase Project",
  cardTitle: "SHOWCASE",
  cardSubtitle: "Web App",
  description: ["Short desc", "Full overlay description here"],
  image: "https://example.com/cover.jpg",
  background: "https://example.com/bg.jpg",
  link: "https://showcase.com",
  domain: "showcase.com",
};

const linkCheckProject: Project = {
  cardId: "link-check",
  slug: "/scan",
  title: "example.com",
  cardTitle: "example.com",
  description: "Link Safety Check",
  image: "",
  link: "https://example.com",
  domain: "example.com",
};

function renderOverlay(
  project: Project | null,
  isOpen: boolean,
  onClose = jest.fn(),
) {
  return render(
    <ProjectOverlay project={project} isOpen={isOpen} onClose={onClose} />,
  );
}

describe("ProjectOverlay — closed state", () => {
  it("renders nothing when project is null and isOpen is false", () => {
    renderOverlay(null, false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders nothing when isOpen is false even with a project", () => {
    renderOverlay(showcaseProject, false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("ProjectOverlay — showcase mode", () => {
  it("renders the dialog when open with a showcase project", async () => {
    renderOverlay(showcaseProject, true);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("shows SHOWCASE badge for non-link-check projects", async () => {
    renderOverlay(showcaseProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    // "SHOWCASE" appears multiple times in the overlay (badge, status chip, stream text)
    expect(screen.getAllByText("SHOWCASE").length).toBeGreaterThan(0);
  });

  it("displays the project title as a heading", async () => {
    renderOverlay(showcaseProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: /Showcase Project/i })).toBeInTheDocument();
  });

  it("displays the domain", async () => {
    renderOverlay(showcaseProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getAllByText("showcase.com").length).toBeGreaterThan(0);
  });

  it("shows the full overlay description", async () => {
    renderOverlay(showcaseProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByText("Full overlay description here")).toBeInTheDocument();
  });

  it("has a close button", async () => {
    renderOverlay(showcaseProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = jest.fn();
    renderOverlay(showcaseProject, true, onClose);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = jest.fn();
    renderOverlay(showcaseProject, true, onClose);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});

describe("ProjectOverlay — link-check mode", () => {
  it("renders the dialog for a link-check project", async () => {
    renderOverlay(linkCheckProject, true);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("shows LIVE PREVIEW badge for link-check projects", async () => {
    renderOverlay(linkCheckProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByText("LIVE PREVIEW")).toBeInTheDocument();
  });

  it("shows the link identification section", async () => {
    renderOverlay(linkCheckProject, true);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByText("LINK IDENTIFICATION")).toBeInTheDocument();
  });
});
