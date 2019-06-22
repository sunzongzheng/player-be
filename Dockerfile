FROM node:8

ENV APP_ROOT /app
ENV NODE_ENV production

WORKDIR ${APP_ROOT}

COPY package.json tsconfig.json ${APP_ROOT}/

COPY config ${APP_ROOT}/config/

COPY src ${APP_ROOT}/src/

RUN npm i

EXPOSE 8080 8081

CMD ["npm", "run", "start"]
