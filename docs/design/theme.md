# Spraylite: Mist & Metal

A cool, precise palette taken from the product itself: brushed aluminium tins, a white label, the blue-and-yellow Spraylite logo, and seven colour-coded caps.

The tokens live in `src/app/globals.css` as Tailwind v4 `@theme` variables.

## Color Palette

- **Aluminium**: `#E6E9EC` - Page ground, the brushed metal of the tin
- **Tin white**: `#FBFCFD` - Panels and product cards, the tin body
- **Deep ink**: `#10325C` - Text and headings, a darkened logo blue
- **Spraylite blue**: `#1D5FB4` - Primary actions and links, the logo tile (6.3:1 on white, 5.1:1 on aluminium)
- **Lite yellow**: `#F5C518` - The "lite" highlight: free-delivery meter, badges, focus ring. Always paired with ink text, never used as text
- **Coral**: `#FD866C` - Wishlist heart only, carried over from the spray-lite.in launch page

### Variant colours

Each flavour has two colours. The cap colour identifies the tin; the oil colour tints the hero mist, so the spray takes on the colour of the oil inside.

| Variant        | Cap       | Oil       |
| -------------- | --------- | --------- |
| Natural        | `#2F5DA8` | `#E8C766` |
| Olive Oil      | `#8FA04A` | `#A7A13A` |
| Baking         | `#5A4E26` | `#C9923E` |
| Ghee Flavour   | `#E9D24B` | `#E0A526` |
| Coconut Oil    | `#1F8A6E` | `#CFC6A4` |
| Butter Flavour | `#D4382C` | `#F2CF5B` |
| Oriental       | `#8E1B24` | `#A8652A` |

Variant colours only appear on product surfaces: swatches, card tints, tin caps and the mist.

## Typography

- **Headings**: Bricolage Grotesque (variable, with the optical-size axis, 700–800)
- **Body**: Be Vietnam Pro (400 and 600), the typeface of the existing spray-lite.in page

Tracking changes with size: −0.03em on the hero, −0.02em on section headings, 0 on body, +0.01em on small text. Prices use tabular figures.

## Shape and motion

- Radius follows hierarchy: product panels 28px, inputs 14px, buttons and chips fully rounded like a tin cap.
- No resting shadows. Depth comes from translucency (the header) and from the sheet scrim.
- Springs: `bounce 0, duration 0.4` by default, so nothing overshoots unless a gesture threw it.
- Press feedback: scale 0.97 over 100ms on pointer-down.
