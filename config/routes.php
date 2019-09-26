<?php

use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Views\PhpRenderer as PhpRenderer;
use Cake\Database\Connection;
use Slim\Container;


$app->get('/bubbles', function ($request, $response, $args) {
    return $this->get(PhpRenderer::class)->render($response, "/login.html", $args);
});

$app->post('/bubbles', \App\Controllers\UserController::class);


$app->get('/databases', function (Request $request, Response $response) {
    /** @var Container $this */

    $query = $this->get(Connection::class)->newQuery();

    // fetch all rows as array
    $query = $query->select('*')->from('Users');

    $rows = $query->execute()->fetchAll('assoc') ?: [];

    // return a json response
    return $response->withJson($rows);
});
