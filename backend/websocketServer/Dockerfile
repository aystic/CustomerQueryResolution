FROM node:18.12.1-slim
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT "8000"
ENV MYSQL_USER "root"
ENV MYSQL_PASSWORD "root@branchBackend"
ENV MYSQL_DB "BranchBackend"
ENV SOCKETIO_AGENT_ROOM "dCRPiJVJZxoxFSZVtiW9AF4PhC79HT"
ENV WEBSOCKET_SERVER_PASSKEY "j#nqV#DHx^gdJn97&~nj^yDSscVa7p"
EXPOSE 8000
CMD ["node","/server/server.js"]
