<?php
// get_posts.php

// 1. 启动 Session，以便检查登录状态
session_start();

header('Content-Type: application/json');

// 2. 检查 Session 中是否存在用户名
if (isset($_SESSION['username'])) {
    // --- 用户已登录 ---
    // 只有登录了，才去读取并返回帖子数据
    $posts_file = __DIR__ . '/posts.json';
    if (file_exists($posts_file)) {
        $content = file_get_contents($posts_file);
        // 如果文件内容为空，也返回一个空数组，防止json_decode(null)报错
        if (empty($content)) {
            echo json_encode([]);
        } else {
            echo $content;
        }
    } else {
        // 如果文件不存在，返回空数组
        echo json_encode([]);
    }
} else {
    // --- 用户未登录 ---
    // 如果用户未登录，直接返回一个空数组，不给任何数据
    echo json_encode([]);
}
?>