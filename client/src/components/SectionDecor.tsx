export type DecorVariant =
  | "hero"
  | "collections"
  | "trending"
  | "trust"
  | "about"
  | "reviews"
  | "faq";

/** Unique soft decor per homepage section — not the same stickers everywhere. */
export function SectionDecor({ variant }: { variant: DecorVariant }) {
  switch (variant) {
    case "hero":
      return (
        <div className="section-decor section-decor--hero" aria-hidden>
          <div className="section-decor-wash" />
          <div className="section-decor-blobs">
            <span className="blob blob-a" />
            <span className="blob blob-b" />
          </div>
        </div>
      );

    case "collections":
      return (
        <div className="section-decor section-decor--collections" aria-hidden>
          <div className="section-decor-wash" />
          <span className="mark mark-arc left-[8%] top-[30%]" />
          <span className="mark mark-arc mark-arc--sm right-[10%] bottom-[25%]" />
        </div>
      );

    case "trending":
      return (
        <div className="section-decor section-decor--trending" aria-hidden>
          <div className="section-decor-lines" />
          <span className="section-sticker section-sticker--star right-[6%] top-[20%]">★</span>
          <span className="section-sticker section-sticker--pill left-[5%] bottom-[18%]">HOT</span>
        </div>
      );

    case "trust":
      return (
        <div className="section-decor section-decor--trust" aria-hidden>
          <div className="section-decor-wash" />
          <div className="section-decor-dots section-decor-dots--sparse" />
        </div>
      );

    case "about":
      return (
        <div className="section-decor section-decor--about" aria-hidden>
          <div className="section-decor-wash" />
          <span className="mark mark-ring right-[12%] top-[18%]" />
          <span className="mark mark-ring mark-ring--sm left-[6%] bottom-[22%]" />
        </div>
      );

    case "reviews":
      return (
        <div className="section-decor section-decor--reviews" aria-hidden>
          <div className="section-decor-wash" />
          <span className="section-sticker section-sticker--quote left-[5%] top-[28%]">“</span>
          <span className="section-sticker section-sticker--star right-[6%] bottom-[22%]">★</span>
        </div>
      );

    case "faq":
      return (
        <div className="section-decor section-decor--faq" aria-hidden>
          <div className="section-decor-grid" />
          <span className="section-sticker section-sticker--q right-[8%] top-[16%]">?</span>
        </div>
      );

    default:
      return null;
  }
}
