FROM node:16
COPY . /api_digitalsoft
WORKDIR /api_digitalsoft
RUN npm install
EXPOSE 8443