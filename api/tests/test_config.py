import os

from goduploader.config import ConfigFromEnvironmentVariableMeta


def test_ConfigFromEnvironmentVariableBase():
    class MyConfig(metaclass=ConfigFromEnvironmentVariableMeta):
        foo = ""
        bar = False
        baz = 10

    os.environ["FOO"] = "aaa"

    myconfig = MyConfig()
    assert myconfig.foo == "aaa"

    myconfig.foo = "bbb"
    assert myconfig.foo == "bbb"

    assert not myconfig.bar

    myconfig.bar = True
    assert myconfig.bar
    assert isinstance(myconfig.bar, bool)

    assert myconfig.baz == 10

    myconfig.baz = 20
    assert myconfig.baz == 20
