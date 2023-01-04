FROM node:18.12.1-slim
WORKDIR /server
COPY package*.json ./
RUN npm install
ENV PORT "8001"
ENV MYSQL_DB "BranchBackend"
ENV MYSQL_USER "root"
ENV MYSQL_PASSWORD "root@branchBackend"
ENV WEBSOCKET_SERVER_PASSKEY "j#nqV#DHx^gdJn97&~nj^yDSscVa7p"
EXPOSE 8001
COPY . .
CMD ["node","/server/server.js"]
