# Use an official node image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

# Install dependencies
RUN npm install

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]



