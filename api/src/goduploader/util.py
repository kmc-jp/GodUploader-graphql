def bool_from_env_var(from_env_var: str) -> bool:
    lowered = from_env_var.lower()
    if lowered == "true":
        return True

    if lowered.isdigit() and bool(int(lowered)):
        return True

    return False
