import { cardDescription, overlayDescription, projects } from "@/lib/projects";
import type { Project } from "@/lib/projects";

const plain: Project = {
  cardId: "x",
  slug: "/x",
  title: "X",
  cardTitle: "X Card",
  description: "plain string",
  image: "/x.jpg",
};

const tuple: Project = {
  cardId: "y",
  slug: "/y",
  title: "Y",
  cardTitle: "Y Card",
  description: ["card text", "overlay text"],
  image: "/y.jpg",
};

describe("cardDescription", () => {
  it("returns the plain string when description is a string", () => {
    expect(cardDescription(plain)).toBe("plain string");
  });

  it("returns the first tuple element when description is a two-element array", () => {
    expect(cardDescription(tuple)).toBe("card text");
  });
});

describe("overlayDescription", () => {
  it("returns the plain string when description is a string", () => {
    expect(overlayDescription(plain)).toBe("plain string");
  });

  it("returns the second tuple element when description is a two-element array", () => {
    expect(overlayDescription(tuple)).toBe("overlay text");
  });
});

describe("projects array", () => {
  it("exports a non-empty array", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has exactly 5 projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("every project has a unique cardId", () => {
    const ids = projects.map((p) => p.cardId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every project has a non-empty title", () => {
    projects.forEach((p) => expect(p.title).toBeTruthy());
  });

  it("every project has a non-empty cardTitle", () => {
    projects.forEach((p) => expect(p.cardTitle).toBeTruthy());
  });

  it("every project has a non-empty image URL", () => {
    projects.forEach((p) => expect(p.image).toBeTruthy());
  });

  it("every project has a non-empty slug", () => {
    projects.forEach((p) => expect(p.slug).toBeTruthy());
  });

  it("every project with a link uses https", () => {
    projects
      .filter((p) => p.link)
      .forEach((p) => expect(p.link).toMatch(/^https:\/\//));
  });
});
