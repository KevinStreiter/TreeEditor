<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\Stream;
use Slim\Views\PhpRenderer;
use Slim\Http\UploadedFile;
use Cake\Database\Connection;

$app->get('/treeEditor', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/home.html", $args);
});

$app->get('/treeEditor/project', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/project.html", $args);
});

$app->get('/treeEditor/projects', function ($request, $response, $args) {
    $query = $this->get(Connection::class)->newQuery();
    $query = $query->select('*')->from('Projects');
    $rows = $query->execute()->fetchAll('assoc') ?: [];
    return $response->withJson($rows);
});

$app->get('/treeEditor/projectsAndNodes', function ($request, $response, $args) {
    $connection = $this->get(Connection::class);
    $rows = $connection->execute('SELECT * FROM Projects INNER JOIN Nodes using (project_id)')
        ->fetchAll('assoc');
    return $response->withJson($rows);
});

$app->post('/treeEditor/projects/delete', function (Request $request) {
    $id = $request->getParam('id');
    $connection = $this->get(Connection::class);
    $connection->query("DELETE FROM Projects WHERE project_id={$id}");
});

$app->get('/treeEditor/node', function ($request, $response, $args) {
    $id = $request->getParam('id');
    $query = $this->get(Connection::class)->newQuery();
    $query = $query->select('*')->from('Nodes')->andWhere(['node_id' => $id]);;
    $rows = $query->execute()->fetchAll('assoc') ?: [];
    return $response->withJson($rows);
});

$app->get('/treeEditor/nodes', function ($request, $response, $args) {
    $id = $request->getParam('id');
    $query = $this->get(Connection::class)->newQuery();
    $query = $query->select('*')->from('Nodes')->andWhere(['project_id' => $id]);;
    $rows = $query->execute()->fetchAll('assoc') ?: [];
    return $response->withJson($rows);
});

$app->get('/treeEditor/projectFiles', function ($request, $response, $args) {
    $id = $request->getParam('id');
    $query = $this->get(Connection::class)->newQuery();
    $query = $query->select('*')->from('Files')->andWhere(['project_id' => $id]);
    $rows = $query->execute()->fetchAll('assoc') ?: [];
    return $response->withJson($rows);
});

$app->post('/treeEditor/files/upload', function($request, $response) {
    $directory = $this->get('upload_directory');
    $uploadedFiles = $request->getUploadedFiles();
    $uploadedFile = $uploadedFiles['file'];
    $filename = null;
    $rectIndex = $request->getParam('rectInfo');
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $filename = moveUploadedFile($directory, $uploadedFile, $rectIndex);
    }
    return $response->write($filename);
});

function moveUploadedFile($directory, UploadedFile $uploadedFile, $rectIndex) {
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $filename = $rectIndex . "_" . $filename;
    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
    return $filename;
}

$app->get('/treeEditor/files', function (Request $request, Response $response, array $args) {
    $filename = $request->getParam('filename');
    $directory = $this->get('upload_directory');
    $path = $directory . DIRECTORY_SEPARATOR . $filename;
    $fh = fopen($path, 'rb');
    $file_stream = new Stream($fh);
    return $response->withBody($file_stream)
        ->withHeader('Content-Disposition', "attachment; filename=$filename;")
        ->withHeader('Content-Type', mime_content_type($path))
        ->withHeader('Content-Length', filesize($path));
})->setOutputBuffering(false);


$app->post('/treeEditor/files/delete', function (Request $request) {
    $filename = $request->getParam('filename');
    $directory = $this->get('upload_directory');
    unlink($directory . DIRECTORY_SEPARATOR . $filename);
});


$app->post('/treeEditor/foreignNode/save', function (Request $request, Response $response) {
    $connection = $this->get(Connection::class);
    $data = $request->getBody();
    $data = json_decode($data, true);
    $foreign_id = $data["foreign_id"];
    $node_id = $data["node_id"];
    $project_id = $data["project_id"];
    $x = $data["x"];
    $y = $data["y"];
    $node = ['foreign_id' => $foreign_id, 'node_id' => $node_id, 'project_id' => $project_id, 'x' => $x, 'y' => $y];
    $connection->insert('Foreign_Nodes', $node);
});

$app->post('/treeEditor/foreignNodes/delete', function ($request, $response, $args) {
    $foreign_id = $request->getParam('foreign_id');
    $project_id = $request->getParam('project_id');
    $connection = $this->get(Connection::class);
    $connection->query("DELETE FROM Foreign_Nodes WHERE foreign_id ='{$foreign_id}' AND project_id='{$project_id}'");
});

$app->post('/treeEditor/foreignNode/update', function (Request $request) {
    $connection = $this->get(Connection::class);
    $data = $request->getBody();
    $data = json_decode($data, true);
    $foreign_id = $data["foreign_id"];
    $project_id = $data["project_id"];
    $x = $data["x"];
    $y = $data["y"];
    $connection->query("UPDATE Foreign_Nodes SET x = {$x}, y = {$y} WHERE foreign_id = '{$foreign_id}' AND project_id = '{$project_id}'");
});

$app->get('/treeEditor/foreignNodes', function ($request, $response, $args) {
    $id = $request->getParam('id');
    $connection = $this->get(Connection::class);
    $rows = $connection->execute("SELECT F.foreign_id, F.project_id, F.node_id, F.x, F.y, N.element 
        FROM Foreign_Nodes AS F INNER JOIN Nodes as N ON F.node_id=N.node_id 
        WHERE F.project_id={$id}")
        ->fetchAll('assoc');
    return $response->withJson($rows);
});

$app->post('/treeEditor/save', \App\Controllers\SaveController::class);


