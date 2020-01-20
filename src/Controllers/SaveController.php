<?php

namespace App\Controllers;

use Cake\Database\Connection;

class SaveController
{
    protected $container;

    function __construct($container)
    {
        $this->container = $container;
    }

    function __invoke($request, $response, $args)
    {
        $connection = $this->container->get(Connection::class);
        $nodes = $request->getBody();
        $data = json_decode($nodes, true);
        $nodes = $data["nodes"]["childNodes"];
        $files = $data["files"]["childNodes"];
        $links = $data["links"]["childNodes"];
        $size = $data["size"];
        $projectName = $request->getParam('projectName');
        $projectID = $request->getParam('projectID');
        if (is_numeric($projectID)) {
            $this->updateProject($connection, $projectName, $projectID, $size);
            $foreignData = $this->getForeignData($connection);
            $this->updateNodes($nodes, $connection, $projectID);
            $this->insertForeignData($connection, $foreignData, $nodes, $projectID);
            $this->saveFiles($files, $connection, $projectID);
            $this->saveLinks($links, $connection, $projectID);
            return $response->withJson($projectID);
        } else {
            $this->saveProject($connection, $projectName, $size);
            $projectID = $this->getRecentProjectID($connection);
            $this->saveNodes($nodes, $connection, $projectID);
            $this->saveFiles($files, $connection, $projectID);
            $this->saveLinks($links, $connection, $projectID);
            return $response->withJson($projectID);
        }
    }

    function saveProject($connection, $projectName, $size)
    {
        $project = ['name' => $projectName, 'width' => $size[0], 'height' => $size[1]];
        $connection->insert('Projects', $project);
    }

    function updateProject($connection, $projectName, $projectID, $size)
    {
        $connection->query("UPDATE Projects SET name = '{$projectName}', 
            width = '$size[0]', height = '$size[1]' WHERE project_id = {$projectID}");
    }

    function getRecentProjectID($connection)
    {
        $query = $connection->newQuery();
        $query = $query->select('MAX(project_id)')->from('Projects');
        $row = $query->execute()->fetch('assoc') ?: [];
        return $row['MAX(project_id)'];
    }

    function saveNodes($data, $connection, $projectID)
    {
        foreach ($data as $node) {
            if ((int)$node['nodeType'] == 1) {
                $attributes = $node['attributes'];
                $node_data = ['node_id' => $projectID . '_' . $attributes[0][1], 'project_id' => $projectID,
                    'element' => json_encode($node)];
                $connection->insert('Nodes', $node_data);
            }
        }
    }

    function updateNodes($data, $connection, $projectID)
    {
        $connection->query("DELETE FROM Nodes WHERE project_id={$projectID}");
        $connection->query("DELETE FROM Files WHERE project_id={$projectID}");
        $connection->query("DELETE FROM Links WHERE project_id={$projectID}");
        $this->saveNodes($data, $connection, $projectID);
    }

    function getForeignData($connection)
    {
        $query = $connection->newQuery()->select('*')->from('Foreign_Nodes');
        return $query->execute()->fetchAll('assoc') ?: [];
    }

    function insertForeignData($connection, $foreignData, $nodes, $projectID) {
        foreach ($foreignData as $foreign) {
            foreach ($nodes as $node) {
                $attributes = $node['attributes'];
                if ($foreign['node_id'] == $projectID . '_' . $attributes[0][1]) {
                    $connection->insert('Foreign_Nodes', $foreign);
                    break;
                }
            }
        }
    }

    function saveFiles($data, $connection, $projectID) {
        foreach ($data as $file) {
            if ($file['tagName'] == "li") {
                $element_data = ['project_id' => $projectID];
                $element_data['element'] = json_encode($file);
                $connection->insert('Files', $element_data);
            }
        }
    }

    function saveLinks($data, $connection, $projectID) {
        foreach ($data as $file) {
            if ($file['tagName'] == "li") {
                $element_data = ['project_id' => $projectID];
                $element_data['element'] = json_encode($file);
                $connection->insert('Links', $element_data);
            }
        }
    }
}
