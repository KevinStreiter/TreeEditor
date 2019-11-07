<?php

namespace App\Controllers;

use Cake\Database\Connection;
use Slim\Views\PhpRenderer as PhpRenderer;

class DBController
{
    protected $container;

    function __construct($container) {
        $this->container = $container;
    }

    function __invoke($request, $response, $args) {
        $renderer = $this->container->get(PhpRenderer::class);
        $connection = $this->container->get(Connection::class);
        $nodes = $request->getBody();
        $svg = json_decode($nodes, true);
        $nodes = $svg["childNodes"];
        $projectName = $request->getParam('projectName');
        $this->saveData($nodes, $connection, $projectName);
        #return $response->withJson($id);
    }

    function saveData($data, $connection, $projectName) {
        $project = ['name' => $projectName];
        $connection->insert('Projects', $project);
        $project = $this->getRecentProjectID($connection);
        $element_data = [];
        foreach($data as $node) {
            if ((int)$node['nodeType'] == 1) {
                $attributes = $node['attributes'];
                $node_data = ['node_id' => $project['MAX(project_id)'] . '_' . $attributes[0][1], 'project_id' => (int)$project['MAX(project_id)'],
                    'element' => json_encode($node)];
                $connection->insert('Nodes', $node_data);
                $element_data = ['node_id' =>  $project['MAX(project_id)'] . '_' . $attributes[0][1]];

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


    function getRecentProjectID($connection) {
        $query = $connection->newQuery();
        $query = $query->select('MAX(project_id)')->from('Projects');
        $row = $query->execute()->fetch('assoc') ?: [];
        return $row;
    }

    function insertUser($user,$connection) {
        $data = ['Username' => $user->getUsername(), 'Password' => $user->getPassword()];
        if (!empty($this->getUser($user->getUsername(), $connection))) {
            $message = $user->getUsername() . " already exists";
        }
        elseif ($data['Username'] !== '' and $data['Password'] !== '') {
            $connection->insert('Users', $data);
            $message = $user->getUsername() . " has been registered";
        }
        else {
            $message = "Please fill in the mandatory blanks";
        }
        echo "<script type='text/javascript'>alert('$message');</script>";
    }

}
