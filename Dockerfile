FROM node:22.14.0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx prisma generate
ARG PORT
ENV PORT=${API_PORT}
EXPOSE ${API_PORT}
CMD npx prisma migrate deploy && npm run start:dev
