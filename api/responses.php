<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-admin-pin, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$contentPath = __DIR__ . '/../data/birthday.json';
$content = file_exists($contentPath) ? json_decode(file_get_contents($contentPath), true) : [];
$adminPin = isset($content['adminPin']) ? trim($content['adminPin']) : '1708';

$headers = getallheaders();
$pin = $headers['x-admin-pin'] ?? $headers['X-Admin-Pin'] ?? $_GET['pin'] ?? '';

if (trim($pin) !== $adminPin) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Akses ditolak: PIN tidak valid']);
    exit;
}

$respPath = __DIR__ . '/../data/responses.json';
$allResponses = file_exists($respPath) ? json_decode(file_get_contents($respPath), true) : [];
if (!is_array($allResponses)) $allResponses = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['success' => true, 'data' => $allResponses]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        $uriParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
        $id = end($uriParts);
    }

    $filtered = array_values(array_filter($allResponses, function($r) use ($id) {
        return isset($r['id']) && $r['id'] !== $id;
    }));

    file_put_contents($respPath, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'message' => 'Respon berhasil dihapus']);
    exit;
}
