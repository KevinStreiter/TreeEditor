<?php
require '../vendor/autoload.php';

// Instantiate the app
$app = new \Slim\App(['settings' => require __DIR__ . '../../config/settings.php']);

// Register routes
require __DIR__ . '../../config/routes.php';

// Register container
require __DIR__ . '../../config/container.php';

// Start
$app->run();
