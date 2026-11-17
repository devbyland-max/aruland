from PIL import Image
from pathlib import Path

src = Path("client/public/instagram/profile-shot.jpg")
out = Path("client/public/instagram")
out.mkdir(parents=True, exist_ok=True)

im = Image.open(src).convert("RGB")
w, h = im.size
print("size", w, h)

# Save full preview for debugging reference
# Approximate regions for 564x1024 IG mobile web screenshot:
# Header/profile ~0-320, highlights ~320-420, tabs ~420-460, grid starts ~460

# Detect grid by looking for content starting around mid page.
# From description: 3-col grid with multiple rows.

# Empirically tuned for this screenshot aspect:
grid_top = int(h * 0.455)
grid_bottom = int(h * 0.92)
grid = im.crop((0, grid_top, w, grid_bottom))
gw, gh = grid.size
print("grid", gw, gh)

cols, rows = 3, 4
cell_w = gw // cols
cell_h = gh // rows
gap = max(1, int(gw * 0.004))

n = 0
for r in range(rows):
    for c in range(cols):
        left = c * cell_w + gap
        top = r * cell_h + gap
        right = (c + 1) * cell_w - gap
        bottom = (r + 1) * cell_h - gap
        cell = grid.crop((left, top, right, bottom))
        n += 1
        path = out / f"post-{n}.jpg"
        cell.save(path, "JPEG", quality=88)
        print("saved", path.name, cell.size)

# Crop profile avatar roughly (left circle in header)
avatar = im.crop((int(w * 0.04), int(h * 0.09), int(w * 0.28), int(h * 0.22)))
avatar.save(out / "avatar.jpg", "JPEG", quality=90)
print("avatar", avatar.size)

# Highlights row
hl_top = int(h * 0.33)
hl_bottom = int(h * 0.43)
hl_row = im.crop((0, hl_top, w, hl_bottom))
hl_w, hl_h = hl_row.size
for i in range(6):
    left = int(hl_w * (0.02 + i * 0.16))
    right = left + int(hl_w * 0.14)
    circle = hl_row.crop((left, 0, min(right, hl_w), hl_h))
    circle.save(out / f"highlight-{i+1}.jpg", "JPEG", quality=88)
    print("hl", i + 1, circle.size)
