import os
import re
from typing import List

from goduploader.util import bool_from_env_var

VARIABLE_PATTERN = re.compile(r"[a-z][0-9a-z_]*")


def _create_getter(env_var_name, default_value, var_type="str"):
    @property
    def getter(self):
        if var_type == "bool":
            if env_var_name in os.environ:
                return bool_from_env_var(os.environ[env_var_name])
            else:
                return default_value
        elif var_type == "int":
            return int(os.environ.get(env_var_name, default_value))
        else:
            return os.environ.get(env_var_name, default_value)

    return getter


class ConfigFromEnvironmentVariableBase(type):
    def __new__(cls, classname, bases, dic):
        variables: List[str] = [k for k in dic if VARIABLE_PATTERN.match(k)]
        new_dic = {}

        for variable in variables:
            default_value = dic[variable]
            env_var_name = variable.upper()
            var_type = type(default_value).__name__

            new_dic[variable] = _create_getter(env_var_name, default_value, var_type)

        return type.__new__(cls, classname, bases, new_dic)
