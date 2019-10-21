<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Views\PhpRenderer as PhpRenderer;
use Slim\Http\UploadedFile;
use Cake\Database\Connection;
use Slim\Container;


$app->get('/treeEditor', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/home.html", $args);
});

$app->post('/treeEditor', function(Request $request, Response $response) {
    $directory = $this->get('upload_directory');
    print($directory);
    $uploadedFiles = $request->getUploadedFiles();

    // handle single input with single file upload
    $uploadedFile = $uploadedFiles['file'];
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $filename = moveUploadedFile($directory, $uploadedFile);
        $response->write('uploaded ' . $filename . '<br/>');
    }
});

function moveUploadedFile($directory, UploadedFile $uploadedFile)
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
    $filename = sprintf('%s.%0.8s', $basename, $extension);

    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);

    return $filename;
}

/*

$app->get('/bubbles', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/login.html", $args);
});

$app->post('/bubbles', \App\Controllers\UserController::class);


$app->get('/databases', function (Request $request, Response $response) {
    /** @var Container $this */
/*
    $query = $this->get(Connection::class)->newQuery();

    // fetch all rows as array
    $query = $query->select('*')->from('Users');

    $rows = $query->execute()->fetchAll('assoc') ?: [];

    // return a json response
    return $response->withJson($rows);
});
*/