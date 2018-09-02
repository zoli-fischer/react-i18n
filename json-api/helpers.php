<?php

function updateConfig() {
    $config_file = realpath(__DIR__.'/config.json');
    $config = json_decode(file_get_contents($config_file), true);
    foreach ( $config as $key => $language ) {
        $collections = [];
        $collections_path = realpath(__DIR__.'/'.$language['index']);
        $jsons = glob($collections_path."/*.json");
        foreach ($jsons as $collection_file) {
            $collections[basename($collection_file, ".json")]['mtime'] = filemtime($collection_file);
        }
        $config[$key]['collections'] = $collections;
    }
    file_put_contents($config_file,json_encode($config));
}