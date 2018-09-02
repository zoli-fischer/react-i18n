<?php

require_once("helpers.php");

header('Content-type:application/json;charset=utf-8');

$request = json_decode(trim(file_get_contents("php://input")), true);
$respons = (object)[
    'ok' => false,
    'data' => []
];
if ( isset($request['command']) ) {
    switch ($request['command']) {
        case 'update':
            $index = $request['index'];
            $collection = $request['collection'];
            $language = $request['language'];
            $tranlation = $request['tranlation'];
            $language_path = realpath(__DIR__.'/'.$language);
            if ( strlen(trim($index)) > 0 && strlen(trim($collection)) > 0 && file_exists($language_path) ) {
                $collection_file = $language_path.'/'.$collection.'.json';
                $collection_data = file_exists( $collection_file) ? json_decode( file_get_contents($collection_file), true ) : [];
                $collection_data[$index] = $tranlation;
                if ( file_put_contents( $collection_file, json_encode($collection_data) ) ) {
                    updateConfig();
                    $respons->ok = true;
                    $respons->data = [
                        'index' => $index,
                        'tranlation' => $tranlation
                    ];
                }
            }
            break;
    }
}
ob_start("ob_gzhandler");
echo json_encode($respons);
ob_end_flush();