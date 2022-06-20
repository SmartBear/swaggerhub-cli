FROM node:12-alpine
WORKDIR /cli
COPY package*.json ./
COPY ./bin ./bin
COPY ./src ./src
COPY ./LICENSE ./LICENSE
COPY ./.github/action/entrypoint.sh ./gh_entrypoint.sh
RUN npm install
HEALTHCHECK --interval=15s --timeout=3s CMD curl --fail ${SWAGGERHUB_URL} || exit 1
ENTRYPOINT ["/cli/gh_entrypoint.sh"]
