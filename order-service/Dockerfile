# Start with a base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the service port
EXPOSE 5001

# Start the application
CMD ["npm", "run", "dev"]
