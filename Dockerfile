#Base image
FROM node:20-alpine

#Create app directory
WORKDIR /usr/src/app

#Copy package files
COPY package*.json ./

#install dependencies
RUN npm install

#copy source code
COPY . .

#Build the application
RUN npm run build

#expose port
EXPOSE 3000