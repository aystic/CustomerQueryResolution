# Branch International-Assignment by Mohit Pathak

## Features implemented

- Agent Interface and Customer Interface
  ![](images/Screenshot%20from%202023-01-09%2019-59-18.png)
  ![](images/Screenshot%20from%202023-01-09%2019-59-50.png)
- Intuitive UI for user and customer agent
  ![](images/Screenshot%20from%202023-01-05%2006-15-52.png)
- Feature for user to add new queries and a way to prioritise these new queries; User can select a total of 16 different cases (4 issues x 4 subissues) comprising different issues having different prioritties
  ![](images/Screenshot%20from%202023-01-05%2006-21-27.png)
- Way for customer agents to keep any eye on the incoming messages and prioritising urgent issues
  - The chats having highest priority and are most recent displayed on the top
  - Implemented pagination so that only a handful of selected chats are fetched at a time from the server
  - The customer agent can select a chat request to resolve, After selection the chat is removed from the "new chats request" table thereby avoiding multiple agents to work on same chat simultaneously
    ![](images/Screenshot%20from%202023-01-05%2006-18-13.png)
- Realtime chat between user and customer agent. Even when either side is offline the messages are not lost and stored in DB which are then fetched when a user clicks to open the chat
  ![](images/video.gif)
- Also implemented the online status of users
  ![](images/Screenshot%20from%202023-01-05%2008-05-56.png)
- The agent or user can mark the chat as resolved. Once resolved, The chat will be read-only. The user and agent both can view the resolved chats by going to the resolved section
  ![](images/Screenshot%20from%202023-01-05%2006-54-06.png)
- Implemented New chat request notification for agents and new messages notifications
  ![](images/Screenshot%20from%202023-01-09%2020-03-14.png)
  ![](images/Screenshot%20from%202023-01-09%2020-03-54.png)
- Populated the DB with the chats provided in the CSV files (Gives some extra attributes to rows to fit the data model)
- Dockerized the application (consisting of 5 containers viz Frontend(ReactJS), Backend: Stateless Application server(NodeJS), Backend: Stateful websocket server, Database: MySQL(For relational data), MongoDB(For storing the chats)). Running the application requires just one command `docker compose up --build`.

---

## Setting up the application on local machine

### Requirements

- [Git](https://git-scm.com/downloads) and [docker](https://get.docker.com/)

#### Steps

1. Clone the GitHub repo on your local machine

```bash
git clone https://github.com/aystic/BranchInternational-Assignment.git
```

2. Navigate inside the cloned repo

```bash
cd BranchInternational-Assignment
```

3. Run the docker compose command

```bash
docker compose up --build
```

4. Run the following command for mongoDB chat migration

```bash
docker container exec -it branchinternational-assignment-db_mongodb-1 mongoimport --type=csv -d BranchBackend -c chats  --columnsHaveTypes --fields 'chatID.int64(),userID.int64(),agentID.int64(),type.string(),sender.string(),timestamp.string(),message.string()' --file=ChatsMongo.csv
```

If step 4 fails then check the name of the docker container for the mongoDB database using

```bash
docker container ls -a
#"branchinternational-assignment-db_mongodb-1" in this case
```

![](images/Screenshot%20from%202023-01-05%2007-13-25.png)

---

### Note

As instructed, I have not implemented authentication feature. But there is need of an email ID to use the application. Since a user cannot signup, List of all valid email ID which can be used to access the application can be found in `db/UserList.csv` and `db/AgentList.csv` files

---
