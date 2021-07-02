import os

from goduploader.config import ConfigFromEnvironmentVariableBase


def test_ConfigFromEnvironmentVariableBase():
    class MyConfig(metaclass=ConfigFromEnvironmentVariableBase):
        foo = ""
        bar = False
        baz = 10

    os.environ["FOO"] = "aaa"

    myconfig = MyConfig()
    assert myconfig.foo == "aaa"

    os.environ["FOO"] = "bbb"
    assert myconfig.foo == "bbb"

    assert not myconfig.bar

    os.environ["BAR"] = "1"
    assert myconfig.bar
    assert isinstance(myconfig.bar, bool)

    assert myconfig.baz == 10

    os.environ["BAZ"] = "20"
    assert myconfig.baz == 20
