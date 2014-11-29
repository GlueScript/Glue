FROM ubuntu:latest
MAINTAINER Tim Rodger

# Expose the port
EXPOSE 8781

# Install dependencies
RUN apt-get update -qq && \
    apt-get -y install \
    nodejs \
    npm

# Make the directories
RUN mkdir /home/app 

# Move files into place
COPY src/ /home/app/

# Install dependencies
WORKDIR /home/app

RUN npm install

CMD ["nodejs", "/home/app/index.js"]
