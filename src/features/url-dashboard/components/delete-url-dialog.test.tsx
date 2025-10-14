import { useToast } from "@/hooks/use-toast";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeEach, expect, type Mock } from "vitest";
import { DeleteUrlDialog } from "./delete-url-dialog";

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe(DeleteUrlDialog, () => {
  const urlId = "test-id";
  const shortUrl = "https://short.url/abc";
  let onDelete: Mock;
  let onSuccess: Mock;
  let mockToast: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockToast = vi.fn();
    (useToast as Mock).mockReturnValue({ toast: mockToast });
    onDelete = vi.fn(() => Promise.resolve());
    onSuccess = vi.fn();
  });

  it("renders delete button", () => {
    render(
      <DeleteUrlDialog urlId={urlId} shortUrl={shortUrl} onDelete={onDelete} />,
    );
    expect(screen.getByTestId("dialog-trigger-delete-url")).toBeInTheDocument();
  });

  it("opens dialog on trigger click", () => {
    render(
      <DeleteUrlDialog urlId={urlId} shortUrl={shortUrl} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByTestId("dialog-trigger-delete-url"));
    expect(
      screen.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();
    expect(screen.getByText(shortUrl)).toBeInTheDocument();
  });

  it("calls onDelete and onSuccess when confirmed", async () => {
    render(
      <DeleteUrlDialog
        urlId={urlId}
        shortUrl={shortUrl}
        onDelete={onDelete}
        onSuccess={onSuccess}
      />,
    );
    fireEvent.click(screen.getByTestId("dialog-trigger-delete-url"));
    fireEvent.click(screen.getByTestId("dialog-action-delete-url"));
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(urlId));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("disables buttons while deleting", async () => {
    let resolveDelete: (() => void) | undefined;
    onDelete = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = () => resolve();
        }),
    );
    render(
      <DeleteUrlDialog urlId={urlId} shortUrl={shortUrl} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByTestId("dialog-trigger-delete-url"));
    fireEvent.click(screen.getByTestId("dialog-action-delete-url"));
    expect(
      screen.getAllByRole("button", { name: /delete url/i })[0],
    ).toBeDisabled();
    if (resolveDelete) resolveDelete();
    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /delete url/i })[0],
      ).not.toBeDisabled(),
    );
  });

  it("handles delete error gracefully", async () => {
    onDelete = vi.fn(() => Promise.reject(new Error("fail")));
    render(
      <DeleteUrlDialog urlId={urlId} shortUrl={shortUrl} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByTestId("dialog-trigger-delete-url"));
    fireEvent.click(screen.getByTestId("dialog-action-delete-url"));
    await waitFor(() => expect(onDelete).toHaveBeenCalled());
    expect(mockToast).toHaveBeenCalledWith({
      title: "Failed to delete URL",
      description: "The URL has not been deleted.",
      variant: "destructive",
    });

    expect(
      screen.getAllByRole("button", { name: /delete url/i })[0],
    ).not.toBeDisabled();
  });
});
