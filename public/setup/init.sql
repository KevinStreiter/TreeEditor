CREATE SCHEMA IF NOT EXISTS treeEditor;
USE treeEditor;

CREATE TABLE Projects (
 project_id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL UNIQUE,
 PRIMARY KEY (project_id)
) ENGINE=INNODB;

CREATE TABLE Nodes (
    node_id INT NOT NULL,
    project_id INT NOT NULL,
    title  VARCHAR(255) NOT NULL UNIQUE,
    content VARCHAR(255),
    rect JSON NOT NULL,
    circleTop JSON NOT NULL,
    circleBottom JSON NOT NULL,
    circleLeft JSON NOT NULL,
    circleRight JSON NOT NULL,
    FOREIGN KEY (node_id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Connectors (
    connector_id INT NOT NULL AUTO_INCREMENT,
    FOREIGN KEY (connector_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;