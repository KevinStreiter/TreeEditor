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
    }

    function saveData($data, $connection, $projectName) {
        $project = ['name' => $projectName];
        $connection->insert('Projects', $project);
        $project = $this->getRecentProjectID($connection);
        $node_data = [];
        $circle_data = [];
        $connector_data = [];
        $text_data = [];
        foreach($data as $node) {
            if ($node['nodeType'] == 1) {
                $attributes = $node['attributes'];
                $node_data = ['node_id' => $attributes, 'project_id' => $project['project_id']];
                $circle_data = ['node_id' => $attributes];
                $connector_data = $circle_data;
                $text_data = $circle_data;

                foreach($node as $child) {

                    if($child['tagName'] == 'rect') {
                        $node_data['rect'] = json_encode($child);
                    }

                    elseif ($child['tagName'] == 'text') {
                        $text_data['element'] = json_encode($child);
                    }

                    elseif ($child['tagName'] == 'circle') {
                        $circle_data['element'] = json_encode($child);
                    }

                    elseif ($child['tagName'] == 'line') {
                        $connector_data['element'] = json_encode($child);
                    }
                }
                $connection->insert('Nodes', $node_data);
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
