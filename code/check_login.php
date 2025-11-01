<?php
// check_login.php
session_start();
header('Content-Type: application/json');

$response = ['loggedIn' => false, 'username' => null];

// 优先检查 Session
if (isset($_SESSION['username'])) {
    $response['loggedIn'] = true;
    $response['username'] = $_SESSION['username'];
} 
// 如果 Session 没有，再检查 Cookie (实现自动登录)
else if (isset($_COOKIE['user_token'])) {
    // 简单地解码 Cookie，真实项目中需要验证 token 有效性
    $username = base64_decode($_COOKIE['user_token']);
    // 找到了有效的 Cookie，那么就帮用户重新登录 (重建 Session)
    $_SESSION['username'] = $username; 
    $response['loggedIn'] = true;
    $response['username'] = $username;
}

echo json_encode($response);
?>