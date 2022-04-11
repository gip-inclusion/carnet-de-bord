# build from
# https://github.com/python-poetry/poetry/discussions/1879#discussioncomment-216865
# https://github.com/python-poetry/poetry/issues/1178#issuecomment-998549092
FROM python:3.10.4-slim-bullseye as base

WORKDIR /app

# python
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.1.13 \
    POETRY_HOME="/opt/poetry" \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1 \
    # paths
    # this is where our requirements + virtual environment will live
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

# prepend poetry and venv to path
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"


# `builder-base` stage is used to build deps + create our virtual environment
FROM base as builder
# System deps:
RUN set -x \
  && apt-get update \
  && apt-get install --no-install-recommends --yes curl build-essential \
  && rm -rf /var/lib/apt/lists/*

# install poetry - respects $POETRY_VERSION & $POETRY_HOME
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py  | python

# copy project requirement files here to ensure they will be cached.
WORKDIR $PYSETUP_PATH

COPY poetry.lock pyproject.toml ./

# install runtime deps - uses $POETRY_VIRTUALENVS_IN_PROJECT internally
RUN poetry install --no-dev

# `production` image used for runtime
FROM base as production

RUN set -x \
  && apt-get update \
  && apt-get install --no-install-recommends --yes openssh-client \
  && rm -rf /var/lib/apt/lists/*

ENV FASTAPI_ENV=production

WORKDIR /app

COPY --from=builder $PYSETUP_PATH $PYSETUP_PATH
COPY ./api /app/api
COPY ./scripts /app/scripts

RUN addgroup --gid 1000 python
RUN useradd --uid 1000 --gid 1000 -m python

RUN chown -R 1000:1000 /app
USER 1000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "4000"]
