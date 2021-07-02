import os
import subprocess
import sys
from pathlib import Path

base = os.environ["BASE"]

cwd = Path(__file__).parent.parent
local_db_path = cwd / "god.db"
local_db_path.unlink(missing_ok=True)


def run(args):
    result = subprocess.run(args, cwd=cwd)
    if result.returncode != 0:
        sys.exit(result.returncode)


run(["rsync", "-auvz", f"{base}/api/god.db", "./god.db"])
run(["rsync", "-auvz", f"{base}/api/public/illusts/", "public/illusts/"])
run(["rsync", "-auvz", f"{base}/api/public/thumbnail/", "public/thumbnail/"])

run(["poetry", "run", "alembic", "upgrade", "head"])
