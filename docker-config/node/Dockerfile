################################################################################
# Set the base image to Ubuntu
################################################################################

FROM ubuntu:16.04

MAINTAINER "Abhijeet Kohakade" <abhijeet.kohakade@selenite.co>

RUN apt-get update --fix-missing

################################################################################
# Install Node Js And Dependencies
################################################################################

RUN apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get -y install python build-essential nodejs node-gyp


################################################################################
# Install tools
################################################################################

RUN apt-get update && apt-get install -my \
	git \
	wget \
	pdftk \
	g++ \
    && apt-get clean

RUN npm install -g supervisor

################################################################################
# Boot
################################################################################

CMD ["/usr/bin/supervisord"]

################################################################################