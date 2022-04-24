FROM python:3.10-bullseye

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq

RUN apt-get install -y -qq --no-install-recommends imagemagick webp default-mysql-client

# poetry
ENV PIP_NO_CACHE_DIR=yes
ENV PIP_DISABLE_PIP_VERSION_CHECK=yes
ENV POETRY_HOME="/opt/poetry"
ENV POETRY_NO_INTERACTION=1
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
RUN chmod 755 $POETRY_HOME/bin/poetry

COPY ./poetry.toml ./
COPY ./pyproject.toml ./poetry.lock ./
RUN --mount=type=cache,target=/app/.venv poetry install

COPY ./alembic.ini ./pytest.ini ./
COPY ./script ./script
COPY ./src ./src
RUN poetry install
