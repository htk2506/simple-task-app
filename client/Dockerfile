FROM node:23-slim

WORKDIR /client

# Copy and install depencencies
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

# Copy source code
COPY ./src ./src
COPY ./public ./public

# Production 
ENV NODE_ENV="production"

# Use port 3000
EXPOSE 3000

# Run the client
CMD ["npm", "run", "start"]