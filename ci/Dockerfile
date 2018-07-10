# Start from the latest Node.js image
FROM node:9-alpine

# Install git for Codecov
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh && \
    apk add --no-cache curl jq

RUN mkdir /build
WORKDIR /build

# Copy the content of your repository into the image
COPY . ./