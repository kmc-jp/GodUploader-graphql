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
        return getattr(img, "is_animated", False)


def _generate_normal_thumbnail(illust_path, thumbnail_path):
    with Image.open(illust_path) as img:
        img.thumbnail(
            (THUMBNAIL_HEIGHT, THUMBNAIL_HEIGHT), resample=Image.Resampling.HAMMING
        )
        img.save(thumbnail_path)


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
