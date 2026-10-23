<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-admin-pin, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataPath = __DIR__ . '/../data/birthday.json';

if (!file_exists(dirname($dataPath))) {
    mkdir(dirname($dataPath), 0777, true);
}

if (!file_exists($dataPath)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'birthday.json tidak ditemukan']);
    exit;
}

$raw = file_get_contents($dataPath);
$content = json_decode($raw, true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Sanitize admin PIN for public view
    $safeContent = $content;
    unset($safeContent['adminPin']);
    echo json_encode(['success' => true, 'data' => $safeContent]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $pin = isset($input['pin']) ? trim($input['pin']) : '';
    $newContent = isset($input['content']) ? $input['content'] : null;

    if ($pin !== trim($content['adminPin'])) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Akses ditolak: PIN salah']);
        exit;
    }

    if (!$newContent) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Data konten tidak boleh kosong']);
        exit;
    }

    $merged = array_merge($content, $newContent);
    // Keep admin pin if not updated
    if (!empty($newContent['adminPin'])) {
        $merged['adminPin'] = trim($newContent['adminPin']);
    }

    file_put_contents($dataPath, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(['success' => true, 'message' => 'Konten berhasil diperbarui!', 'data' => $merged]);
    exit;
}
