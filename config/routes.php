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
    echo $uploadedFiles;
    $encryptedFileName = "";
    $uploadedFile = $uploadedFiles['file'];
    if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
        $encryptedFileName = moveUploadedFile($directory, $uploadedFile);
    }
    return $response->withHeader('Content-Type', 'text/plain')->write($encryptedFileName);

});

function moveUploadedFile($directory, UploadedFile $uploadedFile) {
    $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
    $basename = bin2hex(random_bytes(8));
    $filename = sprintf('%s.%0.8s', $basename, $extension);
    $uploadedFile->moveTo($directory . DIRECTORY_SEPARATOR . $filename);
    return $filename;
}

$app->get('/treeEditor/files', function (Request $request, Response $response, array $args) {
    // a 100mb file
    $path = '../public/uploads/0_0cbb154dbc2f3ebf.pdf';
    $fh = fopen($path, 'rb');
    $file_stream = new Stream($fh);
    return $response->withBody($file_stream)
        ->withHeader('Content-Disposition', 'attachment; filename=document.pdf;')
        ->withHeader('Content-Type', mime_content_type($path))
        ->withHeader('Content-Length', filesize($path));
})->setOutputBuffering(false);