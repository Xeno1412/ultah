<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataPath = __DIR__ . '/../data/birthday.json';
$raw = file_exists($dataPath) ? file_get_contents($dataPath) : '{}';
$content = json_decode($raw, true);

$input = json_decode(file_get_contents('php://input'), true);
$pin = isset($input['pin']) ? trim($input['pin']) : '';

$correctPin = isset($content['adminPin']) ? trim($content['adminPin']) : '1708';

if ($pin === $correctPin) {
    echo json_encode([
        'success' => true,
        'message' => 'PIN Admin valid',
        'fullContent' => $content
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'PIN Admin salah.']);
}
