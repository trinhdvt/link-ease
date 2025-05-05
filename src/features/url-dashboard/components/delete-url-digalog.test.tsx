import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DeleteUrlDialog } from "./delete-url-dialog";

describe(DeleteUrlDialog, () => {
  const urlId = "test-id";
  const shortUrl = "https://short.url/abc";
  let onDelete: jest.Mock;
  let onSuccess: jest.Mock;

  beforeEach(() => {
    onDelete = jest.fn(() => Promise.resolve());
    onSuccess = jest.fn();
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
    onDelete = jest.fn(
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
    onDelete = jest.fn(() => Promise.reject(new Error("fail")));
    render(
      <DeleteUrlDialog urlId={urlId} shortUrl={shortUrl} onDelete={onDelete} />,
    );
    fireEvent.click(screen.getByTestId("dialog-trigger-delete-url"));
    fireEvent.click(screen.getByTestId("dialog-action-delete-url"));
    await waitFor(() => expect(onDelete).toHaveBeenCalled());
    // No crash, button re-enabled
    expect(
      screen.getAllByRole("button", { name: /delete url/i })[0],
    ).not.toBeDisabled();
  });
});
