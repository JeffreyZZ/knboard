# Dockerfile for Django Applications

# Base Image from https://hub.docker.com/_/python/
FROM python:3.10

# Sets an environmental variable that ensures output from python is sent straight to the terminal without buffering it first
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

# install dependencies  
RUN pip install --upgrade pip

COPY ./requirements/. ./

# runs the pip install command for all packages listed in the local.txt file
RUN pip install --no-cache-dir -r local.txt

# add app
COPY . ./

# port where the Django app runs  
EXPOSE 8000  

# start server  
CMD python manage.py runserver 0.0.0.0:8000