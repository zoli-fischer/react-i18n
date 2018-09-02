<?php

$collections = [
    "home" => [
        "en" => [
            'Car repair' => 'Car repair',
            'Car wash' => 'Car wash',
            'Auto diagnostics' => 'Auto diagnostics',
            'top-text' => '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nisi nulla, scelerisque vel scelerisque vitae, gravida sit amet purus. In lacinia fermentum metus ut varius. Quisque est tellus, vestibulum ut nibh nec, pretium dignissim metus. Vestibulum eget est nec felis elementum efficitur eu quis odio. In quis dolor ac erat imperdiet pharetra. Nullam posuere sit amet dolor sit amet pharetra. Morbi condimentum neque in purus efficitur, in posuere ex dapibus. Aliquam eros eros, aliquam in purus et, feugiat condimentum est. Ut rhoncus vulputate velit. Ut et justo sit amet leo tincidunt posuere. Fusce non nibh hendrerit dui accumsan commodo non quis leo.</p>'
        ],
        "da" => [
            'Car repair' => 'Bil reparation',
            'Car wash' => 'Bilvask',
            'Auto diagnostics' => 'Automatisk diagnostik',
            'top-text' => '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean nisi nulla, scelerisque vel scelerisque vitae, gravida sit amet purus. In lacinia fermentum metus ut varius. Quisque est tellus, vestibulum ut nibh nec, pretium dignissim metus. Vestibulum eget est nec felis elementum efficitur eu quis odio. In quis dolor ac erat imperdiet pharetra. Nullam posuere sit amet dolor sit amet pharetra. Morbi condimentum neque in purus efficitur, in posuere ex dapibus. Aliquam eros eros, aliquam in purus et, feugiat condimentum est. Ut rhoncus vulputate velit. Ut et justo sit amet leo tincidunt posuere. Fusce non nibh hendrerit dui accumsan commodo non quis leo.</p> '
        ]
    ],
    "menu" => [
        "en" => [
            'Home' => 'Home',
            'About' => 'About us',
            'Services' => 'Services',
            'Repair' => 'Repair',
            'Contact' => 'Contact'
        ],
        "da" => [
            'Home' => 'Hjem',
            'About' => 'Om os',
            'Services' => 'Services',
            'Repair' => 'Reparation',
            'Contact' => 'Kontak'
        ]
    ]
];

$collections_mtime = [];
foreach ( $collections as $key => $collection ) {
    foreach ( $collection as $language => $data ) {
        $file = "$language/$key.json";
        file_put_contents($file,json_encode($data));
        $collections_mtime[$language][$key] = ['mtime'=>filemtime($file)];
    }
}

file_put_contents('config.json',json_encode([
    [
        "index" => "en",
        "default" => true,
        'collections' => $collections_mtime["en"]
    ],
    [
        "index" => "da",
        'collections' => $collections_mtime["da"]
    ]
]));