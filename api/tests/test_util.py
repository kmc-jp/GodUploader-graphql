import pytest
from goduploader.util import bool_from_env_var


@pytest.mark.parametrize(
    "input_value, expected",
    [
        ("0", False),
        ("1", True),
        ("true", True),
        ("True", True),
        ("false", False),
        ("False", False),
    ],
)
def test_bool_from_env_var(input_value, expected):
    assert bool_from_env_var(input_value) == expected
