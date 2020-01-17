CREATE SCHEMA IF NOT EXISTS treeEditor;
USE treeEditor;

CREATE USER IF NOT EXISTS gegege
    IDENTIFIED BY 'MWXw9$Ppmjl51drrm7';

GRANT ALL
    ON treeEditor.*
    TO gegege;
FLUSH PRIVILEGES;

CREATE TABLE Projects (
 project_id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL,
 width FLOAT NOT NULL,
 height FLOAT NOT NULL,
 PRIMARY KEY (project_id)
)ENGINE=INNODB;

CREATE TABLE Nodes (
    node_id VARCHAR(128),
    project_id INT NOT NULL,
    element JSON NOT NULL,
    PRIMARY KEY (node_id),
    FOREIGN KEY (project_id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Files (
    project_id INT NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (project_id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Links (
   project_id INT NOT NULL,
   element JSON NOT NULL,
   FOREIGN KEY (project_id)
       REFERENCES Projects(project_id)
       ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Foreign_Nodes (
    foreign_id INT NOT NULL,
    project_id INT NOT NULL,
    node_id VARCHAR(128) NOT NULL,
    x FLOAT,
    y FLOAT,
    connectors JSON DEFAULT NULL,
    FOREIGN KEY (project_id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (node_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE,
    UNIQUE(project_id,node_id)
)ENGINE=INNODB;