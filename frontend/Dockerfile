# pull the official base image from https://hub.docker.com/_/node
FROM node:16-alpine

# set working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./

# rebuild node-sass
RUN yarn add node-sass

# add app
COPY . ./

# start app
CMD ["yarn", "start"]