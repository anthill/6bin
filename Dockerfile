FROM node:4
MAINTAINER David Bruant <david.bruant@ants.builders>

WORKDIR /usr/6bin

ENV NODE_ENV=production
ENV VIRTUAL_PORT=3000

COPY . ./

CMD ["npm", "start"]
