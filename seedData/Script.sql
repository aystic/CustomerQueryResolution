USE BranchBackend;

CREATE TABLE IF NOT EXISTS Users (
	id BIGINT NOT NULL AUTO_INCREMENT,
	emailID varchar(100) NOT NULL,
	CONSTRAINT users_PK PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Agents (
	id BIGINT NOT NULL AUTO_INCREMENT,
	emailID varchar(100) NOT NULL,
	CONSTRAINT agents_PK PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Chats (
	id BIGINT NOT NULL AUTO_INCREMENT,
	userID BIGINT NOT NULL,
	priority INT NOT NULL DEFAULT 55,
	issue varchar(100) NOT NULL DEFAULT "dummy",
	subIssue varchar(100) NOT NULL DEFAULT "dummy",
	description varchar(255) NOT NULL DEFAULT "dummy",
	resolved bool NOT NULL DEFAULT TRUE,
	resolvedBy BIGINT NOT NULL DEFAULT -1,
	createdAt timestamp DEFAULT current_timestamp,
	updatedAt timestamp DEFAULT current_timestamp ON UPDATE current_timestamp,
	CONSTRAINT chats_PK PRIMARY KEY (id),
	CONSTRAINT user_FK FOREIGN KEY (userID) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ChatProgress (
	id BIGINT NOT NULL AUTO_INCREMENT,
	chatID BIGINT NOT NULL,
	agentID BIGINT NOT NULL,
	userID BIGINT NOT NULL,
	CONSTRAINT chatProgress_PK PRIMARY KEY (id),
	CONSTRAINT chatChatProgress_FK FOREIGN KEY (chatID) REFERENCES Chats(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT agentChatProgress_FK FOREIGN KEY (agentID) REFERENCES Agents(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT userChatProgress_FK FOREIGN KEY (userID) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

LOAD DATA INFILE '/var/data/UserList.csv'
INTO
	TABLE Users FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;

LOAD DATA INFILE '/var/data/AgentList.csv'
INTO
	TABLE Agents FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;

LOAD DATA INFILE '/var/data/ChatList.csv'
INTO
	TABLE Chats FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
	
UPDATE Agents SET emailID=SUBSTR(emailID,1,LENGTH(emailID)-1); 
	
UPDATE Users SET emailID=SUBSTR(emailID,1,LENGTH(emailID)-1);
