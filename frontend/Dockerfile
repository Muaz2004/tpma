# 1. Use node image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the code
COPY . .

# 6. Build React app
RUN npm run build

# 7. Serve the app
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port
EXPOSE 3000
