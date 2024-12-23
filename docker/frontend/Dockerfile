FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build-stage /app/dist/hotel-order-frontend/browser /usr/share/nginx/html

COPY start.sh ./

RUN chmod +x start.sh

CMD ["sh","start.sh"]

EXPOSE 80