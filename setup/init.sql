CREATE SCHEMA IF NOT EXISTS treeEditor;
USE treeEditor;

CREATE TABLE Projects (
 project_id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL,
 PRIMARY KEY (project_id)
) ENGINE=INNODB;

CREATE TABLE Nodes (
    node_id INT NOT NULL,
    project_id INT NOT NULL,
    rect JSON NOT NULL,
    FOREIGN KEY (node_id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Texts (
     text_id INT NOT NULL AUTO_INCREMENT,
     node_id INT NOT NULL,
     element JSON NOT NULL,
     FOREIGN KEY (text_id)
         REFERENCES Nodes(node_id)
         ON DELETE CASCADE
)ENGINE=INNODB;


CREATE TABLE Circles (
    circle_id INT NOT NULL AUTO_INCREMENT,
    node_id INT NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (circle_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Connectors (
    connector_id INT NOT NULL AUTO_INCREMENT,
    node_id INT NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (connector_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;