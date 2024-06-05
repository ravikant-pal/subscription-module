# Use an official node image as the base image for building
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY public/ public/
COPY src/ src/

# Build the application
RUN npm run build

# Start a new stage to serve the built application
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy build folder from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# CMD to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]
