# Use an official Node.js image as the base
FROM node:18

# Set the working directory to /app inside the container
WORKDIR /app

# Copy the backend package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the backend dependencies
RUN npm install

# Copy all the backend files into the container
COPY . .

# Expose port 4000 for the backend server
EXPOSE 4000

# Start the backend server
CMD ["npm", "run", "server"]