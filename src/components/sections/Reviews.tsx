import { Star } from "lucide-react";
import { productsById } from "@/data/products";
import { reviews } from "@/data/reviews";
import { cn } from "@/lib/cn";

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="page-x py-20 lg:py-28"
    >
      <h2 id="reviews-title" className="max-w-[18ch] type-h2">
        What home cooks tell us
      </h2>
      <p className="mt-3 text-ink-soft">
        Sample reviews written for this demo storefront.
      </p>

      <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {reviews.map((review) => {
          const product = productsById[review.productId];
          return (
            // The top rule takes the cap colour of the tin they bought.
            <li
              key={review.id}
              className="border-t-4 pt-6"
              style={{ borderColor: product.capColor }}
            >
              <figure className="flex h-full flex-col">
                <p
                  role="img"
                  aria-label={`${review.rating} out of 5 stars`}
                  className="flex gap-0.5"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden
                      strokeWidth={1.5}
                      className={cn(
                        "size-4",
                        i < review.rating
                          ? "fill-lite text-ink"
                          : "text-ink/25",
                      )}
                    />
                  ))}
                </p>
                <blockquote className="mt-4 text-lg leading-relaxed">
                  <p>{review.quote}</p>
                </blockquote>
                <figcaption className="mt-auto pt-6">
                  <p className="font-semibold">{review.name}</p>
                  <p className="type-small text-ink-soft">
                    {review.city}. Bought {product.name}.
                  </p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
