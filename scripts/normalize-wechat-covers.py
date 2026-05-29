"""统一 wechat-feed 封面为 1024×571（cover 居中裁切）。需 Pillow: pip install pillow"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

TARGET = (1024, 571)
FEED_DIR = Path(__file__).resolve().parent.parent / "public" / "wechat-feed"


def normalize(path: Path) -> None:
    img = Image.open(path).convert("RGB")
    tw, th = TARGET
    iw, ih = img.size
    scale = max(tw / iw, th / ih)
    nw, nh = int(round(iw * scale)), int(round(ih * scale))
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    img = img.crop((left, top, left + tw, top + th))
    img.save(path, optimize=True)
    print("ok", path.name, img.size)


def main() -> None:
    names = sys.argv[1:] or [p.name for p in sorted(FEED_DIR.glob("*.png"))]
    for name in names:
        normalize(FEED_DIR / name)


if __name__ == "__main__":
    main()
