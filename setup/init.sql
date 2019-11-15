CREATE SCHEMA IF NOT EXISTS treeEditor;
USE treeEditor;

CREATE TABLE Projects (
 project_id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL,
 PRIMARY KEY (project_id)
) ENGINE=INNODB;

CREATE TABLE Nodes (
    node_id VARCHAR(128) NOT NULL,
    project_id INT NOT NULL,
    element JSON NOT NULL,
    PRIMARY KEY (node_id),
    FOREIGN KEY (project_id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Rects (
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (node_id)
       REFERENCES Nodes(node_id)
       ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Texts (
     node_id VARCHAR(128) NOT NULL,
     element JSON NOT NULL,
     FOREIGN KEY (node_id)
         REFERENCES Nodes(node_id)
         ON DELETE CASCADE
)ENGINE=INNODB;


CREATE TABLE Circles (
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (node_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Connectors (
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (node_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Files (
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (node_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;