FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

WORKDIR /app/backend
RUN npm install

EXPOSE 5000

CMD ["node", "index.js"]