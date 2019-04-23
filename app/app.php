<?php

use Controller\DefaultController;

/**
 * Web Application Front Controller
**/

// composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/config.php';

// get route name
$url = parse_url($_SERVER['REQUEST_URI']);
$uri = explode("/", $url['path']);

// Router for /api prefix
if (in_array('api', $uri) && isset($uri[2]) && isset($uri[3])) {
    header('Content-Type: application/json');
    $controller = new DefaultController();

    switch ($uri[3]) {
        case 'getContacts':
            echo $controller->getContacts();
            exit;
        case 'getPhonesById':
            $id = $uri[4] ? $uri[4] : null;
            echo $controller->getPhonesById($id);
            exit;
        case 'setPhonesForId':
            echo $controller->setPhonesForId();
            exit;
        case 'removeContact':
            echo $controller->removeContact();
            exit;
        case 'addNewContact':
            echo $controller->addNewContact();
            exit;
        case 'getContactById':
            echo $controller->getContactById();
            exit;
        case 'editContact':
            echo $controller->editContact();
            exit;
        default:
            header("HTTP/1.0 404 Not Found");
            break;
    }
}

header("HTTP/1.0 404 Not Found");
