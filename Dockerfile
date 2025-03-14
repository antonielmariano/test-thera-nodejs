FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG PORT
ENV PORT=${API_PORT}
EXPOSE ${API_PORT}
CMD ["npm", "run", "start"]
