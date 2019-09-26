<?php

require 'config.php';

$settings = [];

// Slim settings
$settings['displayErrorDetails'] = true;

// Path settings
$settings['root'] = dirname(__DIR__);
$settings['temp'] = $settings['root'] . '/tmp';
$settings['public'] = $settings['root'] . '/public';

// Database settings
$settings['db'] = [
    'driver' => 'mysql',
    'host' => DB_SERVER,
    'username' => DB_USERNAME,
    'database' => DB_DATABASE,
    'password' => DB_PASSWORD,
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'flags' => [
        PDO::ATTR_PERSISTENT => false,
        // Enable exceptions
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // Set default fetch mode
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ],
];

return $settings;
