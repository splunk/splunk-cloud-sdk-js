# Start from the latest Node.js image
FROM node:9

# Install git for Codecov
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /

# Copy the content of your repository into the image
COPY . ./

# Install all Node.js dependencies, using yarn
RUN yarn install --non-interactive --silent
