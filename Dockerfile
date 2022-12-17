FROM node:16

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

# build front end
RUN npx webpack build

# build backend
RUN npx tsc

# run backend / serve frontend
CMD [ "node", "dist/server/index.js" ]

EXPOSE 6827
