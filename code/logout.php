<?php
// logout.php
session_start();

// 1. 清空 Session 数据
$_SESSION = array();

// 2. 销毁 Session
session_destroy();

// 3. 清除 "记住我" 的 Cookie
if (isset($_COOKIE['user_token'])) {
    // 将 cookie 的过期时间设置为过去，浏览器就会删除它
    setcookie('user_token', '', time() - 3600, '/');
}

// 4. 重定向回首页
header('Location: home.html');
exit();
?>