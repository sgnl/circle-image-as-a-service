FROM node:wheezy

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY .yarnclean /usr/src/app
COPY yarn.lock /usr/src/app
RUN npm install -g yarn && yarn && apt-get install -y imagemagick graphicsmagick

# Bundle app source
COPY . /usr/src/app

EXPOSE 6565
CMD [ "npm", "start" ]