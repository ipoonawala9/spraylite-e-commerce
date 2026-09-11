import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { productsById } from "@/data/products";
import { MAX_QTY, useCart } from "@/store/cart";
import { AddToCartButton } from "./AddToCartButton";

const natural = productsById.natural;

beforeEach(() => {
  useCart.setState({ items: [] });
});

describe("AddToCartButton", () => {
  it("turns into a stepper once added, with focus on the + button", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton product={natural} notify={false} />);

    await user.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(useCart.getState().items).toEqual([{ id: "natural", qty: 1 }]);
    expect(
      screen.getByRole("button", { name: "One more Natural" }),
    ).toHaveFocus();
    expect(
      screen.getByRole("group", { name: "Quantity of Natural" }),
    ).toHaveTextContent("1");
  });

  it("goes back to Add, with focus on it, when the last one is removed", async () => {
    const user = userEvent.setup();
    useCart.setState({ items: [{ id: "natural", qty: 1 }] });
    render(<AddToCartButton product={natural} notify={false} />);

    await user.click(screen.getByRole("button", { name: "Remove Natural" }));

    expect(useCart.getState().items).toEqual([]);
    expect(screen.getByRole("button", { name: "Add to cart" })).toHaveFocus();
  });

  it("counts down without removing while more than one is in the cart", async () => {
    const user = userEvent.setup();
    useCart.setState({ items: [{ id: "natural", qty: 3 }] });
    render(<AddToCartButton product={natural} notify={false} />);

    await user.click(screen.getByRole("button", { name: "One fewer Natural" }));

    expect(useCart.getState().items).toEqual([{ id: "natural", qty: 2 }]);
  });

  it("stops at the per-line limit", () => {
    useCart.setState({ items: [{ id: "natural", qty: MAX_QTY }] });
    render(<AddToCartButton product={natural} notify={false} />);

    expect(
      screen.getByRole("button", { name: "One more Natural" }),
    ).toBeDisabled();
  });
});
