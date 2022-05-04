import subprocess

from PIL import Image


def generate_webp(illust_path, thumbnail_path):
    if _is_gif(illust_path):
        _generate_animated_webp(illust_path, thumbnail_path)
    else:
        _generate_normal_webp(illust_path, thumbnail_path)


def _is_gif(illust_path: str):
    return illust_path.lower().endswith(".gif")


def _generate_normal_webp(illust_path, webp_path):
    with Image.open(illust_path) as img:
        img.save(webp_path, format=None, quality=80)


def _generate_animated_webp(illust_path, webp_path):
    subprocess.run(
        ["gif2webp", "-q", "80", illust_path, "-o", webp_path]
    ).check_returncode()
