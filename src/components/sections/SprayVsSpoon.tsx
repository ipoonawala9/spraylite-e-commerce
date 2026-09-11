"use client";

import { useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import {
  KCAL_PER_SPRAY,
  KCAL_PER_TBSP,
  ML_PER_TBSP,
  monthlySavings,
} from "@/lib/calories";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";

const steps = [
  {
    title: "Shake the tin",
    body: "A few shakes mixes the oil so the mist comes out even.",
  },
  {
    title: "Hold it 15 cm away",
    body: "About a hand's length from the pan. One pass covers a whole tava.",
  },
  {
    title: "Spray for one second",
    body: "Then start cooking. Add another second only if the pan looks dry.",
  },
];

export function SprayVsSpoon() {
  const [uses, setUses] = useState(10);
  const { kcal, ml } = monthlySavings(uses);
  const usesLabel = `${uses} ${uses === 1 ? "time" : "times"} a week`;

  return (
    <section id="spray-vs-spoon" aria-labelledby="svs-title" className="bg-tin">
      <div className="page-x grid gap-14 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <h2 id="svs-title" className="max-w-[14ch] type-h2">
            One spoon or one spray?
          </h2>
          <p className="mt-4 max-w-[44ch] text-lg text-ink-soft">
            A tablespoon of oil is about {KCAL_PER_TBSP} kcal. A one-second
            spray is about {KCAL_PER_SPRAY}. Across a month of cooking, the
            difference adds up.
          </p>

          <div className="mt-10 max-w-lg">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <label htmlFor="uses" className="font-semibold">
                How often do you cook with oil?
              </label>
              <output
                htmlFor="uses"
                className="font-semibold text-brand tabular-nums"
              >
                {usesLabel}
              </output>
            </div>
            <input
              id="uses"
              type="range"
              min={1}
              max={21}
              value={uses}
              onChange={(event) => setUses(Number(event.target.value))}
              aria-valuetext={usesLabel}
              className="mt-4 h-2 w-full cursor-pointer accent-brand"
            />
            <div
              aria-hidden
              className="mt-2 flex justify-between type-small text-ink-soft"
            >
              <span>Once a week</span>
              <span>Three times a day</span>
            </div>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6">
            <Saving label="Calories skipped a month" value={kcal} unit="kcal" />
            <Saving label="Oil saved a month" value={ml} unit="ml" />
          </dl>
          <p className="mt-6 max-w-[52ch] type-small text-ink-soft">
            Estimates for a typical cooking oil, where a tablespoon is{" "}
            {ML_PER_TBSP} ml. Actual amounts depend on how long you spray.
          </p>
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <NutritionPanel
              title="1 tablespoon of oil"
              serving="15 ml"
              kcal={KCAL_PER_TBSP}
              fat="13.6 g"
            />
            <NutritionPanel
              title="1-second spray"
              serving="About 0.8 g"
              kcal={KCAL_PER_SPRAY}
              fat="0.8 g"
              highlight
            />
          </div>

          <h3 className="mt-12 type-h3">How to use it</h3>
          <ol className="mt-5 space-y-5">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-5 border-t-2 border-ink pt-4"
              >
                <span className="font-display text-4xl leading-none font-extrabold text-brand tabular-nums">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Saving({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div>
      <dt className="type-small text-ink-soft">{label}</dt>
      <dd className="mt-1 font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-none font-extrabold tracking-tight tabular-nums">
        <AnimatedNumber value={value} format={formatCount} />
        <span className="sr-only">{formatCount(value)}</span>{" "}
        <span className="text-lg font-bold tracking-normal">{unit}</span>
      </dd>
    </div>
  );
}

interface NutritionPanelProps {
  title: string;
  serving: string;
  kcal: number;
  fat: string;
  highlight?: boolean;
}

/** Styled after a nutrition-facts label: heavy rules, one big number. */
function NutritionPanel({
  title,
  serving,
  kcal,
  fat,
  highlight = false,
}: NutritionPanelProps) {
  return (
    <figure className="border-2 border-ink bg-white text-ink">
      <figcaption
        className={cn(
          "border-b-[6px] border-ink px-4 pt-3 pb-2 font-display text-[1.5rem] leading-none font-extrabold tracking-tight",
          highlight && "bg-lite",
        )}
      >
        {title}
      </figcaption>
      <dl className="px-4 pb-2 text-sm">
        <div className="flex justify-between gap-3 border-b border-ink py-1.5">
          <dt>Serving</dt>
          <dd className="font-semibold">{serving}</dd>
        </div>
        <div className="flex items-end justify-between gap-3 border-b-4 border-ink py-2">
          <dt className="font-display text-xl font-extrabold">Calories</dt>
          <dd className="font-display text-5xl leading-none font-extrabold tabular-nums">
            {kcal}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-ink py-1.5">
          <dt className="font-semibold">Total fat</dt>
          <dd>{fat}</dd>
        </div>
        <div className="flex justify-between gap-3 py-1.5">
          <dt>Trans fat</dt>
          <dd>0 g</dd>
        </div>
      </dl>
    </figure>
  );
}
