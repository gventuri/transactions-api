FROM node:14

# Create app directory
WORKDIR /app/

# Install app dependencies (separately to cache the steps)
COPY package.json yarn.lock ./
RUN yarn

# Bundle app source
COPY . /