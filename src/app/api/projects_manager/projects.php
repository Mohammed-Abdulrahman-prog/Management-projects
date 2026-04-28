<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

require "config/db.php";

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET عرض
if ($method == "GET") {
    $stmt = $conn->prepare("
    SELECT p.*, 
           (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS taskCount
    FROM projects p
    ORDER BY p.id DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;   
}

// POST كل العمليات
if ($method == "POST") {

    $action = $data['action'] ?? '';

    // إضافة
    if ($action == "create") {
        $stmt = $conn->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
        $stmt->execute([$data['name'], $data['description']]);
        echo json_encode(["message" => "created", "id" => $conn->lastInsertId()]);
        exit;
    }

    // تعديل
    if ($action == "update") {
        $stmt = $conn->prepare("UPDATE projects SET name=?, description=? WHERE id=?");
        $stmt->execute([$data['name'], $data['description'], $data['id']]);
        echo json_encode(["message" => "updated"]);
        exit;
    }

    // حذف
    if ($action == "delete") {
        try {
            $stmt = $conn->prepare("DELETE FROM projects WHERE id=?");
            $stmt->execute([$data['id']]);  
            echo json_encode(["message" => "deleted"]);

        } catch (PDOException $e) {
            echo json_encode([
                "message" => "cannot_delete",
                "error" => "هذا المشروع يحتوي على مهام"
            ]);
        }
        exit;
    }
}