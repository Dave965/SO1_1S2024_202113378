FROM node:alpine as build

WORKDIR /client

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /client/build /usr/share/nginx/html
COPY --from=build /client/nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]


