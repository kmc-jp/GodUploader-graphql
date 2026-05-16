from PIL import Image, ImageSequence

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
    # アニメーションGIFの各フレームを個別にリサイズしてから再合成する。
    # Pillowのthumbnail()はin-placeで動作するため、フレームをコピーしてからリサイズする。
    # 各フレームのdurationを保持してアニメーションの速度を維持する。
    with Image.open(illust_path) as img:
        frames = []
        durations = []
        for frame in ImageSequence.Iterator(img):
            resized = frame.copy()
            resized.thumbnail(
                (THUMBNAIL_HEIGHT * resized.width // resized.height, THUMBNAIL_HEIGHT),
                resample=Image.Resampling.HAMMING,
            )
            frames.append(resized)
            durations.append(frame.info.get("duration", 100))

        frames[0].save(
            thumbnail_path,
            save_all=True,
            append_images=frames[1:],
            loop=img.info.get("loop", 0),
            duration=durations,
            optimize=False,
        )
