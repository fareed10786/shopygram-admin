FROM node:12.20-slim as node
WORKDIR /app

# Install build deps pckgs
RUN apt update && \
    apt install -y git python3 gcc make g++
# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code and build
COPY . .
RUN npm run build --prod

#stage 2
FROM nginx:stable-alpine
COPY --from=node /app/www /usr/share/nginx/html/
COPY --from=node /app/nginx-conf/default.conf /etc/nginx/conf.d/default.conf
