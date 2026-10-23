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
$password = isset($input['password']) ? trim($input['password']) : '';

$correctPassword = isset($content['friendPassword']) ? trim($content['friendPassword']) : 'teman2026';

if (strcasecmp($password, $correctPassword) === 0) {
    echo json_encode(['success' => true, 'message' => 'Password benar!']);
} else {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Password teman salah. Coba lagi ya!']);
}
