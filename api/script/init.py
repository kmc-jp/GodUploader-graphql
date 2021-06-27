import os
from pathlib import Path
import subprocess

base = os.environ["BASE"]

cwd = Path(__file__).parent.parent
local_db_path = cwd / "god.db"
local_db_path.unlink(missing_ok=True)


def run(args):
    subprocess.run(args, cwd=cwd)


run(["rsync", "-auvz", f"{base}/api/god.db", "./god.db"])
run(["rsync", "-auvz", f"{base}/api/public/illusts/", "public/illusts/"])
run(["rsync", "-auvz", f"{base}/api/public/thumbnail/", "public/thumbnail/"])

run(["poetry", "run", "alembic", "upgrade", "head"])
