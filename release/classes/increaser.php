<?php

header('Content-Type: application/json');

$countContene = file_get_contents('count.json');
$counts = json_decode($countContene);

$counts->count++;

$countent = json_encode($counts);

file_put_contents('count.json', $countent);

echo $countent;