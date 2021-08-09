FROM node:14

# Create app directory
WORKDIR /app

# Install app dependencies (separately to cache the steps)
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Bundle app source
COPY . /app

EXPOSE 3000
CMD [ "yarn", "start" ]