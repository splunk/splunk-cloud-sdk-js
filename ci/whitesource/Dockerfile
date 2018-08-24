FROM 137462835382.dkr.ecr.us-west-1.amazonaws.com/ssc-sdk-shared-whitesource:temporary

RUN apk update && \
    apk upgrade && \
    apk add --no-cache yarn

COPY . /opt/splunk/ssc-client-js

WORKDIR /opt/splunk/ssc-client-js

RUN yarn