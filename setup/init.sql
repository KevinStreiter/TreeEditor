CREATE SCHEMA IF NOT EXISTS treeEditor;
USE treeEditor;

CREATE TABLE Projects (
 project_id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL,
 PRIMARY KEY (project_id)
) ENGINE=INNODB;

CREATE TABLE Nodes (
    id INT,
    node_id VARCHAR(128) NOT NULL,
    project_id INT NOT NULL,
    element JSON NOT NULL,
    PRIMARY KEY (node_id),
    FOREIGN KEY (id)
        REFERENCES Projects(project_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Rects (
    rect_id VARCHAR(128),
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (rect_id)
       REFERENCES Nodes(node_id)
       ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Texts (
     text_id VARCHAR(128),
     node_id VARCHAR(128) NOT NULL,
     element JSON NOT NULL,
     FOREIGN KEY (text_id)
         REFERENCES Nodes(node_id)
         ON DELETE CASCADE
)ENGINE=INNODB;


CREATE TABLE Circles (
    circle_id VARCHAR(128),
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (circle_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE Connectors (
    connector_id VARCHAR(128),
    node_id VARCHAR(128) NOT NULL,
    element JSON NOT NULL,
    FOREIGN KEY (connector_id)
        REFERENCES Nodes(node_id)
        ON DELETE CASCADE
)ENGINE=INNODB;