<?php
// login.php

// 1. 始终在文件顶部启动 Session
session_start();

header('Content-Type: application/json');

$response = ['success' => false, 'message' => '用户名或密码错误！'];

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username_from_form = $_POST['username'];
    $password_from_form = $_POST['password'];

    $file_path = __DIR__ . '/users.json';

    if (file_exists($file_path)) {
        $users_data = file_get_contents($file_path);
        $users_array = json_decode($users_data, true);

        if (is_array($users_array)) {
            foreach ($users_array as $user) {
                if ($user['username'] === $username_from_form && $user['password'] === $password_from_form) {
                    
                    // --- Session 和 Cookie 的核心逻辑 ---
                    
                    // (A) 设置 Session: 无论如何，登录成功就记录 Session
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['login_time'] = time();

                    // (B) 检查是否需要设置 Cookie
                    if (isset($_POST['rememberMe']) && $_POST['rememberMe'] === 'on') {
                        // "记住我"被勾选了
                        $cookie_name = "user_token";
                        // 真实项目中 token 应该是随机生成的复杂字符串
                        $cookie_value = base64_encode($user['username']); 
                        // 设置 Cookie 7天后过期 (86400秒 = 1天)
                        setcookie($cookie_name, $cookie_value, time() + (86400 * 7), "/");
                    }
                    
                    $response = ['success' => true];
                    break;
                }
            }
        } else {
            $response['message'] = '用户数据文件格式错误。';
        }
    } else {
        $response['message'] = '服务器找不到用户数据文件。';
    }
}

echo json_encode($response);
?>