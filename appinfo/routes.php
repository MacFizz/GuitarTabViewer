<?php
return [
    'routes' => [
        ['name' => 'viewer#index',       'url' => '/',          'verb' => 'GET'],
        ['name' => 'viewer#getFile',     'url' => '/file',      'verb' => 'GET'],
        ['name' => 'viewer#getSoundFont', 'url' => '/soundfont', 'verb' => 'GET'],
    ],
];
