import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CartSheet } from "./CartSheet";

beforeEach(() => {
  useCart.setState({ items: [] });
  useUI.setState({ panel: "cart", quickViewId: null });
});

const cartDialog = () => screen.getByRole("dialog", { name: "Your cart" });

describe("CartSheet", () => {
  it("shows an empty state with a way to start shopping", () => {
    render(<CartSheet />);
    const dialog = cartDialog();

    expect(within(dialog).getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Add to cart" }),
    ).toBeInTheDocument();
  });

  it("lists items with their totals", () => {
    useCart.setState({ items: [{ id: "natural", qty: 2 }] });
    render(<CartSheet />);
    const dialog = cartDialog();

    expect(
      within(dialog).getByText("Natural Cooking Spray"),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("2 items")).toBeInTheDocument();
    // ₹698 is over the free-delivery threshold, so delivery is free.
    expect(within(dialog).getByText("Free")).toBeInTheDocument();
    expect(within(dialog).getAllByText("₹698").length).toBeGreaterThan(0);
  });

  it("brings a removed line back with Undo", async () => {
    const user = userEvent.setup();
    useCart.setState({ items: [{ id: "natural", qty: 2 }] });
    render(<CartSheet />);
    const dialog = cartDialog();

    await user.click(
      within(dialog).getByRole("button", { name: "Remove Natural" }),
    );
    expect(useCart.getState().items).toEqual([]);
    expect(within(dialog).getByRole("status")).toHaveTextContent(
      "Removed Natural.",
    );

    await user.click(within(dialog).getByRole("button", { name: "Undo" }));
    expect(useCart.getState().items).toEqual([{ id: "natural", qty: 2 }]);
  });
});
