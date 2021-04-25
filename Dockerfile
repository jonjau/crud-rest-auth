## Build stage

FROM node:latest

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
RUN npm install -g nodemon

# RUN npm rebuild bcrypt --build-from-source

COPY . ./

EXPOSE 2525

CMD ["npm", "run", "dev"]
