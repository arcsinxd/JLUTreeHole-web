<?php
// posts.php

// 1. 启动 Session
session_start();

header('Content-Type: application/json');

// 2. 检查 Session 中是否有用户名，以此判断是否登录
if (!isset($_SESSION['username'])) {
    echo json_encode(['success' => false, 'message' => '请先登录！']);
    exit();
}

$response = ['success' => false, 'message' => '发表失败！'];
$content = $_POST['content'] ?? '';

// 3. 检查内容是否为空
if (!empty($content)) {
    // 定义文件路径
    $posts_file = __DIR__ . '/posts.json';

    // --- 这是你缺失的关键逻辑 ---

    // 4. 读取现有的帖子数据
    //    如果文件不存在或为空，则初始化为一个空数组
    $posts = file_exists($posts_file) ? json_decode(file_get_contents($posts_file), true) : [];

    // 5. 如果解码失败（比如文件内容不是有效的JSON），也视为空数组，防止出错
    if (!is_array($posts)) {
        $posts = [];
    }

    // 6. 创建一个新的帖子数组
    $new_post = [
        'user'    => $_SESSION['username'],
        'content' => htmlspecialchars($content), // 使用 htmlspecialchars 防止XSS攻击
        'time'    => date('Y-m-d H:i:s')
    ];

    // 7. 将新帖子添加到帖子数组的末尾
    $posts[] = $new_post;

    // 8. 将更新后的整个数组转换成格式化的JSON字符串，并写回文件
    //    JSON_UNESCAPED_UNICODE 确保中文字符不会被转义成 \uXXXX
    if (file_put_contents($posts_file, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        // 只有当文件写入成功时，才返回成功响应
        $response = ['success' => true];
    } else {
        // 如果写入失败，返回一个服务器错误信息
        $response['message'] = '写入文件失败，请检查服务器文件权限。';
    }
    // --- 关键逻辑结束 ---

} else {
    $response['message'] = '发表内容不能为空！';
}

// 9. 将最终的响应（成功或失败）返回给前端
echo json_encode($response);
?>