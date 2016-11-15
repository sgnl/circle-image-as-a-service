FROM node:wheezy

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY .yarnclean /usr/src/app
COPY yarn.lock /usr/src/app
RUN npm install -g yarn && yarn
RUN apt-get update && apt-get install -y imagemagick php5-imagick graphicsmagick

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]