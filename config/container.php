<?php
use Slim\Container;
use Cake\Database\Connection;
use Cake\Database\Driver\Mysql;
use Slim\Views\PhpRenderer as PhpRenderer;

/** @var \Slim\App $app */
$container = $app->getContainer();

$container[Connection::class] = function (Container $container) {
    $settings = $container->get('settings');
    $driver = new Mysql($settings['db']);

    return new Connection(['driver' => $driver]);
};

$container[PDO::class] = function (Container $container) {
    /** @var Connection $connection */
    $connection = $container->get(Connection::class);
    $connection->getDriver()->connect();

    return $connection->getDriver()->getConnection();
};

$container[PhpRenderer::class] = new PhpRenderer("./templates");

$container['user'] = new \App\Factories\UserFactory();
