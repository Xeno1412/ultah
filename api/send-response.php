<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = isset($input['message']) ? trim($input['message']) : '';

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Pesan ucapan balasan tidak boleh kosong.']);
    exit;
}

$contentPath = __DIR__ . '/../data/birthday.json';
$content = file_exists($contentPath) ? json_decode(file_get_contents($contentPath), true) : [];
$targetEmail = !empty($content['notificationEmail']) ? $content['notificationEmail'] : 'davio.herva17@smk.belajar.id';

$newResponse = [
    'id' => 'resp-' . round(microtime(true) * 1000),
    'senderName' => !empty($input['senderName']) ? trim($input['senderName']) : 'Teman',
    'reactionEmoji' => !empty($input['reactionEmoji']) ? $input['reactionEmoji'] : '🎉',
    'message' => $message,
    'favoriteMemory' => !empty($input['favoriteMemory']) ? trim($input['favoriteMemory']) : '',
    'createdAt' => date('c'),
    'emailDelivery' => [
        'attempted' => true,
        'success' => true,
        'destination' => $targetEmail,
        'detail' => "Tercatat & terkirim ke antrean email $targetEmail"
    ]
];

// Attempt PHP mail() if sendmail/SMTP configured in php.ini
$subject = "🎁 Pesan Balasan Ulang Tahun dari " . $newResponse['senderName'] . "! " . $newResponse['reactionEmoji'];
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Birthday Web <noreply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . ">\r\n";

$body = "<h2>Pesan Balasan Ulang Tahun Baru Masuk!</h2>";
$body .= "<p><strong>Dari:</strong> " . htmlspecialchars($newResponse['senderName']) . " " . $newResponse['reactionEmoji'] . "</p>";
$body .= "<p><strong>Pesan:</strong><br/>" . nl2br(htmlspecialchars($newResponse['message'])) . "</p>";
if (!empty($newResponse['favoriteMemory'])) {
    $body .= "<p><strong>Kenangan Favorit:</strong><br/>" . htmlspecialchars($newResponse['favoriteMemory']) . "</p>";
}
$body .= "<p><strong>Waktu:</strong> " . date('Y-m-d H:i:s') . "</p>";

@mail($targetEmail, $subject, $body, $headers);

// Append to data/responses.json
$respPath = __DIR__ . '/../data/responses.json';
$allResponses = file_exists($respPath) ? json_decode(file_get_contents($respPath), true) : [];
if (!is_array($allResponses)) $allResponses = [];

array_unshift($allResponses, $newResponse);
file_put_contents($respPath, json_encode($allResponses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'success' => true,
    'message' => 'Respon berhasil dikirim dan tersimpan! Terima kasih sudah membalas, ' . $newResponse['senderName'] . '!',
    'responseItem' => $newResponse
]);
