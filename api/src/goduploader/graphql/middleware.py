import graphene
from flask.wrappers import Request
from goduploader.config import app_config


def check_referer_for_mutation_middleware(
    next, root, info: graphene.ResolveInfo, **args
):
    # skip check for normal query
    if info.operation.operation == "query":
        return next(root, info, **args)

    req: Request = info.context
    referer = req.headers.get("Referer", "")
    if not referer.startswith(app_config.base_url):
        raise Exception(f"Referer check failed ({referer})")

    return next(root, info, **args)
