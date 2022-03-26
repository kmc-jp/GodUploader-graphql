from goduploader.db import session
from goduploader.generate_webp import generate_webp
from goduploader.model.illust import Illust

all_illusts = session.query(Illust).all()
for illust in all_illusts:
    illust_path = illust.image_path("full")
    webp_path = illust.image_path("webp")
    try:
        generate_webp(illust_path, webp_path)
    except Exception as e:
        print(f"Failed to convert {illust_path}, skipping")
        print(e)
