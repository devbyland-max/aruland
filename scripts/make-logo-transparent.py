from collections import deque
from PIL import Image

SRC = "client/public/AruLand.png"
DST = "client/public/AruLand-logo.png"


def make_transparent(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()
    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque(
        [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    )

    while q:
        x, y = q.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= w or y >= h:
            continue
        visited.add((x, y))
        r, g, b, _a = px[x, y]
        is_bg = (r <= 35 and g <= 35 and b <= 35) or (
            r >= 245 and g >= 245 and b >= 245
        )
        if not is_bg:
            continue
        px[x, y] = (0, 0, 0, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    # Trim transparent edges a bit for tighter navbar fit
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)

    im.save(dst, "PNG")
    print(f"saved {dst} {im.size}")


if __name__ == "__main__":
    make_transparent(SRC, DST)
