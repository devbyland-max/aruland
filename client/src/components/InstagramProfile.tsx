const POSTS = [
  { src: "/instagram/post-1.jpg", alt: "Pelush AruLand në Instagram" },
  { src: "/instagram/post-2.jpg", alt: "Arushë e butë nga AruLand" },
  { src: "/instagram/post-3.jpg", alt: "Detaj pelushi AruLand" },
  { src: "/instagram/post-4.jpg", alt: "Koleksion pelushësh AruLand" },
  { src: "/instagram/post-6.jpg", alt: "Pelush i fotografuar nga AruLand" },
  { src: "/instagram/post-12.jpg", alt: "Moment nga profili @aru_land_" },
];

/** Small cream Instagram strip. Uses our own photos, not a third-party widget. */
export function InstagramProfile() {
  return (
    <section className="bg-[#f8efe8] py-12 sm:py-16">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#3F2412]">
              Na ndiq në Instagram
            </h2>
            <p className="text-sm text-[#5c3a22] mt-1">@aru_land_</p>
          </div>
          <a
            href="https://www.instagram.com/aru_land_/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex justify-center px-5 py-2.5 rounded-full bg-[#3F2412] text-white text-sm font-semibold"
          >
            Na ndiq
          </a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {POSTS.map((post) => (
            <a
              key={post.src}
              href="https://www.instagram.com/aru_land_/"
              target="_blank"
              rel="noreferrer"
              className="block aspect-square overflow-hidden rounded-xl bg-white"
            >
              <img
                src={post.src}
                alt={post.alt}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
