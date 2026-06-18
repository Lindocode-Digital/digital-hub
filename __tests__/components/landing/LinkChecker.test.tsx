import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LinkChecker from "@/components/landing/LinkChecker";

// Prevent network calls from the validation fetch inside ProjectOverlay
let savedFetch: typeof global.fetch;
beforeAll(() => { savedFetch = global.fetch; });
beforeEach(() => {
  global.fetch = jest.fn().mockRejectedValue(new Error("fetch blocked in tests")) as typeof global.fetch;
});
afterEach(() => {
  global.fetch = savedFetch;
});

describe("LinkChecker — initial render", () => {
  it("renders the URL input", () => {
    render(<LinkChecker />);
    expect(screen.getByRole("textbox", { name: /enter a url/i })).toBeInTheDocument();
  });

  it("renders the SCAN LINK button", () => {
    render(<LinkChecker />);
    expect(screen.getByRole("button", { name: /scan link/i })).toBeInTheDocument();
  });

  it("SCAN LINK button is disabled when input is empty", () => {
    render(<LinkChecker />);
    expect(screen.getByRole("button", { name: /scan link/i })).toBeDisabled();
  });

  it("shows the helper caption", () => {
    render(<LinkChecker />);
    expect(screen.getByText(/live preview/i)).toBeInTheDocument();
  });
});

describe("LinkChecker — input interaction", () => {
  it("enables SCAN LINK button when a URL is typed", async () => {
    const user = userEvent.setup();
    render(<LinkChecker />);
    const input = screen.getByRole("textbox", { name: /enter a url/i });
    await user.type(input, "https://example.com");
    expect(screen.getByRole("button", { name: /scan link/i })).toBeEnabled();
  });

  it("disables SCAN LINK button again when input is cleared", async () => {
    const user = userEvent.setup();
    render(<LinkChecker />);
    const input = screen.getByRole("textbox", { name: /enter a url/i });
    await user.type(input, "https://example.com");
    await user.clear(input);
    expect(screen.getByRole("button", { name: /scan link/i })).toBeDisabled();
  });

});

describe("LinkChecker — scan flow", () => {
  it("opens the overlay after clicking SCAN LINK", async () => {
    const user = userEvent.setup();
    render(<LinkChecker />);
    const input = screen.getByRole("textbox", { name: /enter a url/i });
    await user.type(input, "https://example.com");
    await user.click(screen.getByRole("button", { name: /scan link/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("uses the hostname as the overlay dialog heading", async () => {
    const user = userEvent.setup();
    render(<LinkChecker />);
    const input = screen.getByRole("textbox", { name: /enter a url/i });
    await user.type(input, "https://example.com");
    await user.click(screen.getByRole("button", { name: /scan link/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    // "example.com" appears many times; find it as a heading inside the dialog
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /example\.com/i })).toBeInTheDocument();
  });

  it("prepends https:// when input lacks a protocol — hostname becomes dialog title", async () => {
    const user = userEvent.setup();
    render(<LinkChecker />);
    const input = screen.getByRole("textbox", { name: /enter a url/i });
    await user.type(input, "example.com");
    await user.click(screen.getByRole("button", { name: /scan link/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /example\.com/i })).toBeInTheDocument();
  });

  it("does not open overlay when SCAN button is disabled (empty input)", () => {
    render(<LinkChecker />);
    // Button is disabled when empty; no click can trigger it
    expect(screen.getByRole("button", { name: /scan link/i })).toBeDisabled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the LIVE PREVIEW badge for link-check overlay", async () => {
    const user = userEvent.setup();
    render(<LinkChecker />);
    const input = screen.getByRole("textbox", { name: /enter a url/i });
    await user.type(input, "https://example.com");
    await user.click(screen.getByRole("button", { name: /scan link/i }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("LIVE PREVIEW")).toBeInTheDocument();
  });
});
