FROM ubuntu:latest
MAINTAINER Tim Rodger

# Install dependencies
RUN apt-get update -qq && \
    apt-get -y install \
    nodejs \
    npm

EXPOSE 80

CMD ["nodejs", "/home/app/index.js"]

# Move files into place
COPY src/ /home/app/

# Install dependencies
WORKDIR /home/app

RUN npm install
