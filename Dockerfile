FROM node:22-slim
WORKDIR /usr/
ENV NODE_OPTIONS=--max-old-space-size=4096
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]