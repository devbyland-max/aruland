const IG_URL = "https://www.instagram.com/aru_land_/";

const HIGHLIGHTS = [
  { label: "Capybara", img: "/products/capybara.jpg" },
  { label: "Clients 💖", img: "/products/stitch-blue.jpg" },
  { label: "Dumbo 🧸", img: "/AruLand-logo.png" },
  { label: "About Us 🧸", img: "/AruLand-logo.png" },
  { label: "Stitch 🧸", img: "/products/stitch-pink.jpg" },
  { label: "Fryma 😴", img: "/products/breathing-otter.jpg" },
];

const POSTS = [
  { src: "/products/stitch-blue.jpg", video: true },
  { src: "/products/stitch-blue.jpg", video: true },
  { src: "/products/capybara.jpg", video: false },
  { src: "/products/capybara.jpg", video: false },
  { src: "/products/capybara.jpg", video: false },
  { src: "/products/stitch-blue.jpg", video: false },
  { src: "/products/stitch-blue.jpg", video: false },
  { src: "/products/stitch-blue.jpg", video: true },
  { src: "/products/stitch-blue.jpg", video: false },
  { src: "/products/breathing-bunny.jpg", video: true },
  { src: "/products/stitch-pink.jpg", video: true },
  { src: "/products/elephant.jpg", video: false },
];

function GridIcon({ active = false }: { active?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`w-5 h-5 ${active ? "text-white" : "text-[#a8a8a8]"}`}
      fill="currentColor"
    >
      <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
    </svg>
  );
}

function ReelsIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 text-[#a8a8a8]" fill="currentColor">
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.5 4.5L16 12l-7.5 4.5V7.5z" />
    </svg>
  );
}

function TaggedIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="w-5 h-5 text-[#a8a8a8]" fill="currentColor">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5z" />
    </svg>
  );
}

function VideoBadge() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow"
      fill="currentColor"
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

export function InstagramProfile() {
  return (
    <section id="instagram" className="py-8 sm:py-12 bg-[#0a0a0a]">
      <div className="container-page">
        <div className="max-w-[935px] mx-auto text-white">
          {/* Profile header — IG desktop style */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 sm:items-start px-2 sm:px-4 mb-8">
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="mx-auto sm:mx-0 shrink-0"
              aria-label="Profili Instagram @aru_land_"
            >
              <div className="w-[86px] h-[86px] sm:w-[150px] sm:h-[150px] rounded-full p-[3px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                <div className="w-full h-full rounded-full bg-black p-[3px]">
                  <img
                    src="/AruLand-logo.png"
                    alt="aru_land_"
                    className="w-full h-full rounded-full object-contain bg-white"
                  />
                </div>
              </div>
            </a>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-light tracking-wide">aru_land_</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-1.5 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-sm font-semibold"
                  >
                    Follow
                  </a>
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-1.5 rounded-lg bg-[#363636] hover:bg-[#262626] text-sm font-semibold"
                  >
                    Message
                  </a>
                </div>
              </div>

              <ul className="flex justify-center sm:justify-start gap-6 sm:gap-10 text-sm mb-4">
                <li>
                  <span className="font-semibold">12</span> posts
                </li>
                <li>
                  <span className="font-semibold">437</span> followers
                </li>
                <li>
                  <span className="font-semibold">767</span> following
                </li>
              </ul>

              <div className="text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
                <p className="font-semibold">AruLand</p>
                <p>🧸AruLand | Butësi, ngrohtësi, dashuri.</p>
                <p>Vendi ku arushët gjejnë shtëpinë e tyre të re ✨</p>
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#e0f1ff] font-semibold hover:underline"
                >
                  instagram.com/aru_land_
                </a>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scroll px-2 sm:px-4 pb-6 mb-2">
            {HIGHLIGHTS.map((h) => (
              <a
                key={h.label}
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 shrink-0 w-[72px] sm:w-[80px]"
              >
                <span className="w-[66px] h-[66px] sm:w-[77px] sm:h-[77px] rounded-full border border-[#363636] p-[3px]">
                  <img
                    src={h.img}
                    alt={h.label}
                    className="w-full h-full rounded-full object-cover bg-[#121212]"
                  />
                </span>
                <span className="text-[12px] text-center truncate w-full text-[#f5f5f5]">
                  {h.label}
                </span>
              </a>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-t border-[#262626] flex justify-center gap-12 sm:gap-16 text-xs tracking-widest uppercase">
            <div className="flex items-center gap-2 py-3 border-t border-white -mt-px text-white">
              <GridIcon active />
              <span className="hidden sm:inline font-semibold">Posts</span>
            </div>
            <div className="flex items-center gap-2 py-3 text-[#a8a8a8]">
              <ReelsIcon />
              <span className="hidden sm:inline">Reels</span>
            </div>
            <div className="flex items-center gap-2 py-3 text-[#a8a8a8]">
              <TaggedIcon />
              <span className="hidden sm:inline">Tagged</span>
            </div>
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-3 gap-[2px] sm:gap-1 mt-0">
            {POSTS.map((p, i) => (
              <a
                key={`${p.src}-${i}`}
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="relative aspect-square bg-[#121212] overflow-hidden group"
                aria-label={`Postim Instagram ${i + 1}`}
              >
                <img
                  src={p.src}
                  alt={`Postim ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:opacity-80 transition"
                />
                {p.video && <VideoBadge />}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </a>
            ))}
          </div>

          <div className="text-center py-6">
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex px-5 py-2.5 rounded-lg bg-[#363636] hover:bg-[#262626] text-sm font-semibold"
            >
              Show more posts from aru_land_
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
