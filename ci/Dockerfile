# Start from the latest Node.js image
FROM node:10-alpine

# Install git for Codecov
RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash \
                       curl \
                       git \
                       jq \
                       openssh

RUN mkdir -p /opt/splunk/splunk-cloud-sdk-js

# Copy the content of your repository into the image
COPY . /opt/splunk/splunk-cloud-sdk-js

WORKDIR /opt/splunk/splunk-cloud-sdk-js

RUN npm -g uninstall yarn
RUN npm -g install yarn@1.9

RUN yarn install --non-interactive && yarn build

VOLUME /opt/splunk/splunk-cloud-sdk-js