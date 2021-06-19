import subprocess

THUMBNAIL_HEIGHT = 186


def generate_thumbnail(illust_path, thumbnail_path):
    if _is_animated_gif(illust_path):
        _generate_animated_thumbnail(illust_path, thumbnail_path)
    else:
        _generate_normal_thumbnail(illust_path, thumbnail_path)


def _is_animated_gif(illust_path):
    identify = subprocess.run(
        ["identify", illust_path], encoding="utf-8", capture_output=True
    )
    return identify.stdout.count("\n") > 1


def _generate_normal_thumbnail(illust_path, thumbnail_path):
    return subprocess.run(
        ["convert", "-resize", f"x{THUMBNAIL_HEIGHT}", illust_path, thumbnail_path]
    )


def _generate_animated_thumbnail(illust_path, thumbnail_path):
    return subprocess.run(
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
    )
