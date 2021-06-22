import os
from pathlib import Path
import subprocess

base = os.environ["BASE"]

cwd = Path(__file__).parent.parent
local_db_path = cwd / "god.db"
local_db_path.unlink(missing_ok=True)


def run(args):
    subprocess.run(args, cwd=cwd)


run(["rsync", "-auvz", f"{base}/god.db", "./from.db"])
run(["rsync", "-auvz", f"{base}/public/illusts/", "public/illusts/"])
run(["rsync", "-auvz", f"{base}/public/thumbnail/", "public/thumbnail/"])

run(["poetry", "run", "python", "script/create_schema.py"])
run(["poetry", "run", "python", "script/migrate.py"])
