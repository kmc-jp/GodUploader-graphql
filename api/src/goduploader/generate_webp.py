import subprocess


def generate_webp(illust_path, thumbnail_path):
    if _is_animated_gif(illust_path):
        _generate_animated_webp(illust_path, thumbnail_path)
    else:
        _generate_normal_webp(illust_path, thumbnail_path)


def _is_animated_gif(illust_path):
    identify = subprocess.run(
        ["identify", illust_path], encoding="utf-8", capture_output=True
    )
    return identify.stdout.count("\n") > 1


def _generate_normal_webp(illust_path, webp_path):
    subprocess.run(
        ["cwebp", "-q", "80", illust_path, "-o", webp_path]
    ).check_returncode()


def _generate_animated_webp(illust_path, webp_path):
    subprocess.run(
        ["gif2webp", "-q", "80", illust_path, "-o", webp_path]
    ).check_returncode()
