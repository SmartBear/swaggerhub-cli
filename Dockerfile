FROM node:12-alpine
WORKDIR /cli
COPY package*.json ./
COPY ./bin ./bin
COPY ./src ./src
COPY ./LICENSE ./LICENSE
COPY ./.github/action/entrypoint.sh ./gh_entrypoint.sh
RUN npm install
ENTRYPOINT ["/cli/bin/run"]
