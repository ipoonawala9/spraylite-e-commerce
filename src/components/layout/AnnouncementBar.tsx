import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart-math";
import { formatINR } from "@/lib/format";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-tin">
      <p className="page-x py-2 text-center type-small">
        Free delivery on orders over {formatINR(FREE_DELIVERY_THRESHOLD)}.
        <span className="hidden sm:inline"> Made in Mumbai.</span>
      </p>
    </div>
  );
}
