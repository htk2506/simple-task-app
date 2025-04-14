FROM node:23-slim

WORKDIR /server

# Copy and install depencencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Copy source code
COPY ./src ./src

# Production 
ENV NODE_ENV="production"

# Use port 5000
ENV SERVER_PORT=5000
EXPOSE 5000

# Run the server
CMD ["node", "src/index.js"]