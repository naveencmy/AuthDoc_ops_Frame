FROM node:20-alpine
WORKDIR /app
COPY services/workers/package*.json ./
RUN npm install --production
COPY services/workers/src ./src
CMD ["node","src/worker.js"]