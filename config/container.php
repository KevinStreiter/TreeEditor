<?php
use Slim\Container;
use Cake\Database\Connection;
use Cake\Database\Driver\Mysql;
use Slim\Views\PhpRenderer as PhpRenderer;

$container = $app->getContainer();

$container[Connection::class] = function (Container $container) {
    $settings = $container->get('settings');
    $driver = new Mysql($settings['db']);
    return new Connection(['driver' => $driver]);
};

$container[PDO::class] = function (Container $container) {
    $connection = $container->get(Connection::class);
    $connection->getDriver()->connect();
    return $connection->getDriver()->getConnection();
};

$container[PhpRenderer::class] = new PhpRenderer("./templates");

$container['upload_directory'] = __DIR__ . '/../public/uploads';
