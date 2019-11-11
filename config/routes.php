<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\Stream;
use Slim\Views\PhpRenderer as PhpRenderer;
use Slim\Http\UploadedFile;
use Cake\Database\Connection;
use Slim\Container;


$app->get('/treeEditor', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/home.html", $args);
});

$app->get('/treeEditor/project', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/project.html", $args);
});

$app->post('/treeEditor/files/upload', function($request, $response) {
    $directory = $this->get('upload_directory');
    $uploadedFiles = $request->getUploadedFiles();
    $uploadedFile = $uploadedFiles['file'];
    $filename = "";
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

$app->post('/treeEditor/save', \App\Controllers\DBController::class);
