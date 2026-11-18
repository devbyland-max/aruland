const IG_URL = "https://www.instagram.com/aru_land_/";

/** Clean product shots only — posts with captions burned into the photo are left out. */
const POSTS = [
  { src: "/instagram/post-1.jpg", alt: "Capybara AruLand nga afër" },
  { src: "/instagram/post-2.jpg", alt: "Capybara AruLand" },
  { src: "/instagram/post-3.jpg", alt: "Stitch blu AruLand" },
  { src: "/instagram/post-4.jpg", alt: "Stitch dhe fletorja" },
  { src: "/instagram/post-6.jpg", alt: "Stitch blu në dhomë" },
  { src: "/instagram/post-12.jpg", alt: "Detaj i Stitch blu" },
];

export function InstagramProfile() {
  return (
    <section id="instagram" className="py-4 sm:py-6 bg-[#F3E7D9]">
      <div className="container-page">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#3F2412]">
              Na ndiq në Instagram
            </h2>
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#5c3a22] hover:underline"
            >
              @aru_land_
            </a>
          </div>
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-[#3F2412] text-[#F3E7D9] text-sm font-semibold hover:bg-[#5c3a22]"
          >
            Na ndiq
          </a>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {POSTS.map((post) => (
            <li key={post.src} className="sm:w-[170px]">
              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="block aspect-square overflow-hidden rounded-[12px] bg-[#e7d3be]"
              >
                <img
                  src={post.src}
                  alt={post.alt}
                  loading="lazy"
                  width={170}
                  height={170}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
