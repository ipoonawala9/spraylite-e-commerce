import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "./cart";
import { moveToCart, useWishlist } from "./wishlist";

const wishlist = () => useWishlist.getState();

beforeEach(() => {
  useWishlist.setState({ ids: [] });
  useCart.setState({ items: [] });
});

describe("wishlist store", () => {
  it("toggle adds, then removes, and reports the new state", () => {
    expect(wishlist().toggle("ghee")).toBe(true);
    expect(wishlist().ids).toEqual(["ghee"]);

    expect(wishlist().toggle("ghee")).toBe(false);
    expect(wishlist().ids).toEqual([]);
  });

  it("remove drops a saved product", () => {
    wishlist().toggle("olive");
    wishlist().remove("olive");
    expect(wishlist().ids).toEqual([]);
  });

  it("restore puts a removed product back where it was", () => {
    wishlist().toggle("natural");
    wishlist().toggle("olive");
    wishlist().toggle("ghee");
    wishlist().remove("olive");
    wishlist().restore("olive", 1);
    expect(wishlist().ids).toEqual(["natural", "olive", "ghee"]);

    wishlist().restore("olive", 0);
    expect(wishlist().ids).toEqual(["natural", "olive", "ghee"]);
  });

  it("moveToCart puts the product in the cart and takes it off the wishlist", () => {
    wishlist().toggle("olive");
    moveToCart("olive");
    expect(wishlist().ids).toEqual([]);
    expect(useCart.getState().items).toEqual([{ id: "olive", qty: 1 }]);
  });
});
