<?php

namespace App\Controllers;

use Cake\Database\Connection;

class DBController
{
    protected $container;

    function __construct($container) {
        $this->container = $container;
    }

    function __invoke($request, $response, $args) {
        $connection = $this->container->get(Connection::class);
        $nodes = $request->getBody();
        $data = json_decode($nodes, true);
        $nodes = $data["nodes"]["childNodes"];
        $files = $data["files"]["childNodes"];
        $projectName = $request->getParam('projectName');
        $projectID = $request->getParam('projectID');
        if (is_numeric($projectID)) {
            $this->updateProject($connection, $projectName, $projectID);
            $this->updateNodes($nodes, $connection, $projectID);
            $this->saveFiles($files, $connection, $projectID);
            return $response->withJson($projectID);
        }
        else {
            $this->saveProject($connection, $projectName);
            $projectID = $this->getRecentProjectID($connection);
            $this->saveNodes($nodes, $projectID, $connection);
            $this->saveFiles($nodes, $projectID, $connection);
            return $response->withJson($projectID);
        }
    }

    function saveProject($connection, $projectName) {
        $project = ['name' => $projectName];
        $connection->insert('Projects', $project);
    }

    function updateProject($connection, $projectName, $projectID) {
        $connection->query("UPDATE Projects SET name = '{$projectName}' WHERE project_id = $projectID");
    }

    function getRecentProjectID($connection) {
        $query = $connection->newQuery();
        $query = $query->select('MAX(project_id)')->from('Projects');
        $row = $query->execute()->fetch('assoc') ?: [];
        return $row['MAX(project_id)'];
    }

    function saveNodes($data, $projectID, $connection) {
        $element_data = [];
        foreach($data as $node) {
            if ((int)$node['nodeType'] == 1) {
                $attributes = $node['attributes'];
                $node_data = ['node_id' => $projectID . '_' . $attributes[0][1], 'project_id' => $projectID,
                    'element' => json_encode($node)];
                $connection->insert('Nodes', $node_data);
                $element_data = ['node_id' =>  $projectID . '_' . $attributes[0][1]];

                foreach($node['childNodes'] as $child) {
                    if ($child['tagName'] == "rect") {
                        $element_data['element'] = json_encode($child);
                        $connection->insert('Rects', $element_data);
                    }

                    elseif ($child['tagName'] == 'text') {
                        $element_data['element'] = json_encode($child);
                        $connection->insert('Texts', $element_data);
                    }

                    elseif ($child['tagName'] == 'circle') {
                        $element_data['element'] = json_encode($child);
                        $connection->insert('Circles', $element_data);
                    }

                    elseif ($child['tagName'] == 'line') {
                        $element_data['element'] = json_encode($child);
                        $connection->insert('Connectors', $element_data);
                    }
                }
            }
        }
    }

    function updateNodes($data, $connection, $projectID) {
        $connection->query("DELETE FROM Nodes WHERE project_id=$projectID");
        $this->saveNodes($data, $projectID, $connection);
    }

    function saveFiles($data, $connection, $projectID) {

        foreach($data as $file) {
            if ($file['tagName'] == "li") {
                $id = $file["attributes"][0][1];
                $id = substr($id, 0, 1);
                $element_data = ['node_id' =>  $projectID . '_' . $id];
                $element_data['element'] = json_encode($file);
                $connection->insert('Files', $element_data);
            }
        }
    }
}
