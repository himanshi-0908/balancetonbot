# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port if needed (Telegraf uses webhook if you integrate with that)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]
