FROM node:18

WORKDIR /simulation

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

CMD ["node", "index.js"]
