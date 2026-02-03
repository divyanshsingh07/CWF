FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source (excluding files in .dockerignore, e.g. .env, node_modules)
COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "server.js"]

