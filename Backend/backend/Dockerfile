FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /backend

COPY Pipfile Pipfile.lock /backend/

# install pipenv on the container
RUN pip install -U pipenv

# install project dependencies
RUN pipenv install --system

COPY . /backend/

# copy entrypoint and make it executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

