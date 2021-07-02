import os
import re
from typing import List

from goduploader.util import bool_from_env_var

VARIABLE_PATTERN = re.compile(r"[a-z][0-9a-z_]*")


def _create_getter(env_var_name, default_value, var_type="str"):
    @property
    def getter(self):
        if var_type == "bool":
            return bool_from_env_var(os.environ.get(env_var_name, ""))
        elif var_type == "int":
            return int(os.environ.get(env_var_name, default_value))
        else:
            return os.environ.get(env_var_name, default_value)

    return getter


class ConfigFromEnvironmentVariableMeta(type):
    def __new__(cls, classname, bases, dic):
        variables: List[str] = [k for k in dic if VARIABLE_PATTERN.match(k)]
        new_dic = {}

        for variable in variables:
            default_value = dic[variable]
            env_var_name = variable.upper()
            var_type = type(default_value).__name__

            new_dic[variable] = _create_getter(env_var_name, default_value, var_type)

        return type.__new__(cls, classname, bases, new_dic)


class AppConfig(metaclass=ConfigFromEnvironmentVariableMeta):
    base_url = "http://localhost:3000/"
    debug = False
    db_url = "sqlite:///god.db"
    gyazo_access_token = ""
    public_folder = os.path.join(os.path.dirname(__file__), "../../public")
    slack_token = ""

    testing = False


app_config = AppConfig()
