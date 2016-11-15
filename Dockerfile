FROM node:wheezy

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn && apt-get install -y imagemagick graphicsmagick

# Bundle app source
COPY . /usr/src/app

EXPOSE 6565
CMD [ "npm", "start" ]