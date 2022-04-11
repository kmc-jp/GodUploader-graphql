import os
import subprocess
import sys
from pathlib import Path

from goduploader.config import app_config


def sqlite_url_to_local_path(path_str: str) -> str:
    return path_str.replace("sqlite:///", "./", 1)


def main():
    base = os.environ["BASE"]

    cwd = Path(__file__).parent.parent
    local_db_path = cwd / sqlite_url_to_local_path(app_config.db_url)
    local_db_path.unlink(missing_ok=True)

    def run(args):
        result = subprocess.run(args, cwd=cwd)
        if result.returncode != 0:
            sys.exit(result.returncode)

    run(["rsync", "-auvz", f"{base}/api/db/god.db", str(local_db_path)])
    run(["rsync", "-auvz", f"{base}/api/public/illusts/", "public/illusts/"])
    run(["rsync", "-auvz", f"{base}/api/public/thumbnail/", "public/thumbnail/"])
    run(["rsync", "-auvz", f"{base}/api/public/webp/", "public/webp/"])

    run(["poetry", "run", "alembic", "upgrade", "head"])


if __name__ == "__main__":
    main()
