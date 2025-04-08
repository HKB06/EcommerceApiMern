FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env* ./
RUN if [ ! -f .env ]; then cp .env.example .env; fi

EXPOSE 3000

CMD ["npm", "start"]