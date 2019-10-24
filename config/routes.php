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

$app->post('/treeEditor', function($request, $response) {
    $directory = $this->get('upload_directory');
    $uploadedFiles = $request->getUploadedFiles();
    $encryptedFileName = "";
    $rectInfo = $request->getParam('rectInfo');
    $uploadedFile = $uploadedFiles['file'];
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $encryptedFileName = moveUploadedFile($directory, $uploadedFile, $rectInfo);
    }
    $data = array('name' => $uploadedFile->getClientFilename(), 'encrypted' => $encryptedFileName);
    return $response->withJson($data);
});

function moveUploadedFile($directory, UploadedFile $uploadedFile, $rectInfo)
{
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $filename = $rectInfo . "_" . $filename;
    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
    return $filename;
}