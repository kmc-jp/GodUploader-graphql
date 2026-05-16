from PIL import Image, ImageSequence


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
    # アニメーションGIFの各フレームを取り出してアニメーションWebPとして保存する。
    # ImageSequence.Iteratorでフレームを順に取り出し、durationを収集する。
    # save_all=Trueとappend_imagesを使うことで全フレームをまとめて書き出す。
    with Image.open(illust_path) as img:
        frames = []
        durations = []
        for frame in ImageSequence.Iterator(img):
            frames.append(frame.copy())
            durations.append(frame.info.get("duration", 100))

        frames[0].save(
            webp_path,
            format="webp",
            save_all=True,
            append_images=frames[1:],
            quality=80,
            duration=durations,
            loop=img.info.get("loop", 0),
        )
