from collections import deque
from pathlib import Path
from PIL import Image

src = Path("client/public/products/capybara.jpg")
dst = Path("client/public/products/capybara.png")

im = Image.open(src).convert("RGBA")
w, h = im.size
px = im.load()

# Flood-fill near-white background from edges
visited: set[tuple[int, int]] = set()
q: deque[tuple[int, int]] = deque()
for x in range(w):
    q.append((x, 0))
    q.append((x, h - 1))
for y in range(h):
    q.append((0, y))
    q.append((w - 1, y))

THRESH = 235


def is_bg(r: int, g: int, b: int) -> bool:
    return r >= THRESH and g >= THRESH and b >= THRESH


while q:
    x, y = q.popleft()
    if (x, y) in visited or x < 0 or y < 0 or x >= w or y >= h:
        continue
    visited.add((x, y))
    r, g, b, a = px[x, y]
    if not is_bg(r, g, b):
        continue
    px[x, y] = (r, g, b, 0)
    q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

# Soften leftover near-white fringe on edges of subject
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if r >= 245 and g >= 245 and b >= 245:
            px[x, y] = (r, g, b, 0)
        elif r >= 230 and g >= 230 and b >= 230:
            # semi-transparent fringe
            px[x, y] = (r, g, b, 90)

bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)

im.save(dst, "PNG")
print(f"saved {dst} {im.size}")
