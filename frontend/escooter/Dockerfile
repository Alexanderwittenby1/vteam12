# Use an official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend application into the container
COPY . /app

# Expose port 3000 for the frontend server
EXPOSE 3000

# Use npm run dev to start the Next.js app in development mode
CMD ["npm", "run", "dev"]
