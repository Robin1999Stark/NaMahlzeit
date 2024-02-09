FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

COPY Pipfile Pipfile.lock /backend/

# install pipenv on the container
RUN pip install -U pipenv

# install project dependencies
RUN pipenv install --system

COPY . /backend/
