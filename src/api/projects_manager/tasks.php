<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

require "config/db.php";

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

// مهم للـ CORS
if ($method == 'OPTIONS') {
    http_response_code(200);
    exit();
}

/////////////////////////
// 📥 GET → عرض المهام
/////////////////////////
if ($method == "GET") {

    if (!isset($_GET['project_id'])) {
        echo json_encode([
            "status" => "error",
            "message" => "project_id is required"
        ]);
        exit;
    }

    $project_id = $_GET['project_id'];

    $stmt = $conn->prepare("SELECT * FROM tasks WHERE project_id=? ORDER BY id DESC");
    $stmt->execute([$project_id]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

/////////////////////////
// 📦 POST → كل العمليات
/////////////////////////
if ($method == "POST") {

    $action = $data['action'] ?? '';

    // ➕ إضافة
    if ($action == "create") {

        $stmt = $conn->prepare("
            INSERT INTO tasks (project_id, title, description, status)
            VALUES (?, ?, ?, ?)
        ");

        $stmt->execute([
            $data['project_id'],
            $data['title'],
            $data['description'],
            $data['status']
        ]);

        echo json_encode([
            "message" => "created",
            "id" => $conn->lastInsertId()
        ]);
        exit;
    }

    // ✏️ تعديل
    if ($action == "update") {

        $stmt = $conn->prepare("
            UPDATE tasks
            SET title=?, description=?, status=?
            WHERE id=?
        ");

        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['status'],
            $data['id']
        ]);

        echo json_encode(["message" => "updated"]);
        exit;
    }

    // 🗑 حذف
    if ($action == "delete") {

        $stmt = $conn->prepare("DELETE FROM tasks WHERE id=?");
        $stmt->execute([$data['id']]);

        echo json_encode(["message" => "deleted"]);
        exit;
    }

    // ❌ لو action غير معروف
    echo json_encode([
        "status" => "error",
        "message" => "Invalid action"
    ]);
}