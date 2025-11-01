<?php
header('Content-Type: application/json');
$response = ['success' => false, 'message' => '未知错误'];

// 处理普通表单数据
$username = $_POST['username'] ?? '';
// ... 获取其他 $_POST 数据 ...

// 处理文件上传
if (isset($_FILES['profile']) && $_FILES['profile']['error'] === 0) {
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $filename = uniqid() . '-' . basename($_FILES['profile']['name']);
    $target_file = $upload_dir . $filename;
    
    if (move_uploaded_file($_FILES['profile']['tmp_name'], $target_file)) {
        // 文件上传成功，可以将 $target_file 路径存入用户信息
    } else {
        $response['message'] = '文件上传失败';
        echo json_encode($response);
        exit();
    }
}

// ... 验证用户名是否已存在，然后将新用户信息（包括头像路径）写入 users.json ...
// 此处省略写入文件的详细代码，逻辑与 posts.php 类似

$response = ['success' => true, 'message' => '注册成功'];
echo json_encode($response);
?>