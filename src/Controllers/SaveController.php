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
        $size = $data["size"];
        $projectName = $request->getParam('projectName');
        $projectID = $request->getParam('projectID');
        if (is_numeric($projectID)) {
            $this->updateProject($connection, $projectName, $projectID, $size);
            $this->updateNodes($nodes, $connection, $projectID);
            $this->saveFiles($files, $connection, $projectID);
            return $response->withJson($projectID);
        } else {
            $this->saveProject($connection, $projectName, $size);
            $projectID = $this->getRecentProjectID($connection);
            $this->saveNodes($nodes, $projectID, $connection);
            $this->saveFiles($nodes, $projectID, $connection);
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

    function saveNodes($data, $projectID, $connection)
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
        $this->saveNodes($data, $projectID, $connection);
    }

    function saveFiles($data, $connection, $projectID)
    {
        foreach ($data as $file) {
            if ($file['tagName'] == "li") {
                $element_data = ['project_id' => $projectID];
                $element_data['element'] = json_encode($file);
                $connection->insert('Files', $element_data);
            }
        }
    }
}
