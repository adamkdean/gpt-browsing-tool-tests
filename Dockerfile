# Copyright (C) 2023 Adam K Dean <adamkdean@googlemail.com>
# Use of this source code is governed by the GPL-3.0
# license that can be found in the LICENSE file.

FROM node:lts
MAINTAINER Adam K Dean <adamkdean@googlemail.com>

WORKDIR /www

COPY package*.json ./
RUN npm install

COPY server.js .

CMD ["npm", "start"]
