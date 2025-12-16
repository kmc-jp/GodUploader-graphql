FROM python:3.12-bookworm

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq

RUN apt-get install -y -qq --no-install-recommends libjpeg-dev libwebp-dev imagemagick webp

# poetry
ENV PIP_NO_CACHE_DIR=yes
ENV PIP_DISABLE_PIP_VERSION_CHECK=yes
ENV POETRY_HOME="/opt/poetry"
ENV POETRY_NO_INTERACTION=1
ENV PATH="$POETRY_HOME/bin:$PATH"
ENV POETRY_VERSION=1.8.3
RUN curl -sSL https://install.python-poetry.org | python3 -
RUN chmod 755 $POETRY_HOME/bin/poetry

COPY ./poetry.toml ./
COPY ./pyproject.toml ./poetry.lock ./
RUN poetry install

COPY ./alembic.ini ./pytest.ini ./.env.test ./
COPY ./script ./script
COPY ./src ./src
RUN poetry install

ARG TARGETARCH
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-${TARGETARCH} /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
