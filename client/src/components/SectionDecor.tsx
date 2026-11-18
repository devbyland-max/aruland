type Tone = "cream" | "white" | "blush";

type Props = {
  tone?: Tone;
  /** Extra stickers for larger bands */
  rich?: boolean;
};

/** Soft background washes + floating stickers for homepage sections. */
export function SectionDecor({ tone = "cream", rich = false }: Props) {
  return (
    <div className={`section-decor section-decor--${tone}`} aria-hidden>
      <div className="section-decor-wash" />
      <div className="section-decor-dots" />
      <span className="section-sticker section-sticker--heart">♥</span>
      <span className="section-sticker section-sticker--star">★</span>
      {rich && (
        <>
          <span className="section-sticker section-sticker--pill">NEW</span>
          <span className="section-sticker section-sticker--dot" />
          <span className="section-sticker section-sticker--dot2" />
        </>
      )}
    </div>
  );
}
