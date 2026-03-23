FROM node:20-alpine
WORKDIR /app
COPY services/api/package*.json ./
RUN npm install --production
COPY services/api/src ./src
EXPOSE 4000
CMD ["node","src/server.js"]