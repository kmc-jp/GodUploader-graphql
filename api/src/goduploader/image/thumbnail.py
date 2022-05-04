import subprocess

from PIL import Image

THUMBNAIL_HEIGHT = 186


def generate_thumbnail(illust_path, thumbnail_path):
    if _is_animated_gif(illust_path):
        _generate_animated_thumbnail(illust_path, thumbnail_path)
    else:
        _generate_normal_thumbnail(illust_path, thumbnail_path)


def _is_animated_gif(illust_path):
    with Image.open(illust_path) as img:
        return img.is_animated


def _generate_normal_thumbnail(illust_path, thumbnail_path):
    subprocess.run(
        ["convert", "-resize", f"x{THUMBNAIL_HEIGHT}", illust_path, thumbnail_path]
    ).check_returncode()


def _generate_animated_thumbnail(illust_path, thumbnail_path):
    subprocess.run(
        [
            "convert",
            illust_path,
            "-coalesce",
            "-resize",
            f"x{THUMBNAIL_HEIGHT}",
            "-layers",
            "optimize",
            thumbnail_path,
        ]
    ).check_returncode()
