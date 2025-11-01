document.addEventListener("DOMContentLoaded", function () {
  const pathname = window.location.pathname;
  function checkLoginStatus() {
    const userStatusDiv = document.getElementById('userStatus');
    if (!userStatusDiv) return; // 如果页面没有这个div，就不执行

    fetch('check_login.php')
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          // 如果已登录
          userStatusDiv.innerHTML = `
            <span>欢迎, <strong>${data.username}</strong>!</span>
            <a href="logout.php">退出登录</a>
          `;
          // 将登录状态也保存在 sessionStorage，方便其他JS逻辑快速判断
          sessionStorage.setItem("login", data.username);
        } else {
          // 如果未登录
          sessionStorage.removeItem("login");
        }
      })
      .catch(err => {
        console.error("检查登录状态失败", err);
        userStatusDiv.innerHTML = '<a href="login.html">登录状态异常</a>';
      });
  }
  
  // --- 在这里立即调用它 ---
  checkLoginStatus();
  // 登录验证（login.html）
  if (pathname.includes("login.html")) {
    const form = document.querySelector("form");

  // 2. 然后，给这个表单元素添加提交事件的监听器
  form.addEventListener("submit", function (e) {
    // 3. 阻止表单的默认提交行为（页面跳转）
    e.preventDefault();

    // 4. 在事件被触发后，在函数内部创建 FormData 对象
    //    这里的 'form' 就是指我们正在监听的那个表单
    const formData = new FormData(form);

    // 5. 使用这个包含了最新数据的 formData 对象来发送请求
    fetch("login.php", {
      method: "POST",
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("登录成功！");
        window.location.href = "home.html";
      } else {
        alert(data.message || "用户名或密码错误！");
      }
    })
    .catch(err => {
      console.error("登录请求失败", err);
      alert("登录请求出错！");
    });
  });
}



  // 发帖功能（write.html）
else if (pathname.includes("write.html")) {
  const form = document.getElementById('postForm'); // 注意form的id
  const textarea = document.getElementById('text');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // 阻止默认提交跳转

    const content = textarea.value.trim();
    if (content === '') {
      alert('内容不能为空！');
      return;
    }

    const username = sessionStorage.getItem('login');
    if (!username) {
      alert('请先登录！');
      window.location.href = 'login.html'; // 没登录跳去登录
      return;
    }

    fetch("posts.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:  `content=${encodeURIComponent(content)}`

    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('发表成功！');
        window.location.href = "home.html"; // 跳转到首页
        textarea.value = '';
      } else {
        alert(data.message || '发表失败');
      }
    })
    .catch(err => {
      console.error("发帖失败", err);
      alert("发帖请求出错！");
    });
  });
}


  // 首页展示内容（home.html）
  else if (pathname.includes("home.html")) {
    const container = document.getElementById("postListBody"); 
    if (!container) return;
  
    let allPosts = []; 
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");


    // 加载帖子
    fetch(`get_posts.php?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(posts => {
        if (!Array.isArray(posts) || posts.length === 0) {
          // 如果没有内容，可以显示一个提示行
          container.innerHTML = '<tr><td colspan="3" style="text-align:center;">暂无发言</td></tr>';
          return;
        }

        allPosts = posts.reverse();
        displayPosts(allPosts);
     })
      .catch(err => {
        console.error("加载帖子失败", err);
        container.innerHTML = '<tr><td colspan="3" style="text-align:center;">加载失败</td></tr>';
      });

    // 2. 这是核心修改：修改渲染帖子的函数
    function displayPosts(posts) {
      container.innerHTML = ""; // 清空旧内容
      posts.forEach(post => {
        // 创建一个表格行 <tr>
        const tr = document.createElement("tr");
        
        // 设置行的内容，每一项都是一个单元格 <td>
        tr.innerHTML = `
          <td><span class="username">${post.user}</span></td>
          <td>${post.content}</td>
          <td>${post.time}</td>
        `;
        // 将新创建的行添加到tbody中
        container.appendChild(tr);
      });
    }
    
    // 搜索按钮的事件监听逻辑完全不需要修改，因为它最终也是调用 displayPosts 函数
    searchButton.addEventListener("click", function () {
      const keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        displayPosts(allPosts);
        return;
      }
    
      const filtered = allPosts.filter(post =>
        post.user.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword)
      );
    
      displayPosts(filtered);
    });
  }
  
  //注册页面（register.html）
  //表格检查
  else if (pathname.includes("register.html"))
  {
    
      const form = document.getElementById('myForm');
      const inputs = {
          username: document.getElementById('username'),
          studentId: document.getElementById('studentId'),
          phone: document.getElementById('phone'),
          email: document.getElementById('email'),
          password: document.getElementById('password'),
          confirmPassword: document.getElementById('confirmPassword'),
          agreement: document.getElementById('agreement')
      };
    
      // 为每个输入字段创建错误提示元素
      Object.keys(inputs).forEach(key => {
          if (key === 'agreement') return;
          const errorSpan = document.createElement('span');
          errorSpan.className = 'error';
          errorSpan.style.color = 'red';
          errorSpan.style.display = 'none';
          inputs[key].parentNode.insertBefore(errorSpan, inputs[key].nextSibling);
      });
    
      // 为协议复选框创建错误提示
      const agreementError = document.createElement('span');
      agreementError.className = 'error';
      agreementError.style.color = 'red';
      agreementError.style.display = 'none';
      inputs.agreement.parentNode.insertBefore(agreementError, inputs.agreement.nextSibling);
    
      // 正则表达式规则
      const patterns = {
          username: /^[a-zA-Z0-9_]{1,20}$/,
          studentId: /^\d{8,}$/,
          phone: /^1[3-9]\d{9}$/,
          email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      };
    
      // 显示错误信息
      function showError(input, isValid, message) 
      {
        const errorSpan = input.nextElementSibling;
        input.setCustomValidity(isValid ? '' : message); // 关键修改
        
        if (!isValid) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'inline';
            input.classList.add('invalid');
            input.classList.remove('valid');
        } else {
            errorSpan.style.display = 'none';
            input.classList.add('valid');
            input.classList.remove('invalid');
        }
      }
    
      // 验证函数集合
      const validators = {
          username: () => {
              const isValid = patterns.username.test(inputs.username.value.trim());
              showError(inputs.username, isValid, '用户名必须是1-20位字母、数字或下划线');
              return isValid;
          },
          studentId: () => {
              const isValid = patterns.studentId.test(inputs.studentId.value.trim());
              showError(inputs.studentId, isValid, '学号至少需要8位数字');
              return isValid;
          },
          phone: () => {
              const isValid = patterns.phone.test(inputs.phone.value.trim());
              showError(inputs.phone, isValid, '请输入有效的11位手机号码');
              return isValid;
          },
          email: () => {
              const isValid = patterns.email.test(inputs.email.value.trim());
              showError(inputs.email, isValid, '请输入有效的邮箱地址');
              return isValid;
          },
          password: () => {
              const password = inputs.password.value.trim();
              const confirm = inputs.confirmPassword.value.trim();
              const isValid = password === confirm && password !== '';
              showError(inputs.confirmPassword, isValid, '两次输入的密码不一致');
              return isValid;
          },
          agreement: () => {
              const isValid = inputs.agreement.checked;
              showError(inputs.agreement, isValid, '必须同意注册条款');
              return isValid;
          }
      };
    
      // 绑定事件监听
      inputs.username.addEventListener('blur', validators.username);
      inputs.studentId.addEventListener('blur', validators.studentId);
      inputs.phone.addEventListener('blur', validators.phone);
      inputs.email.addEventListener('blur', validators.email);
      inputs.password.addEventListener('input', validators.password);
      inputs.confirmPassword.addEventListener('input', validators.password);
    
      // 表单提交处理
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // 执行所有验证
          const results = [
              validators.username(),
              validators.studentId(),
              validators.phone(),
              validators.email(),
              validators.password(),
              validators.agreement()
          ];
    
          // 如果全部验证通过
          if (results.every(result => result === true)) {
            const formElement = document.getElementById('myForm');
    const formData = new FormData(formElement);
        
            fetch("register.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("注册成功，跳转到首页！");
                    window.location.href = "home.html";
                } else {
                    alert("注册失败：" + result.message);
                }
            })
            .catch(error => {
                console.error("注册请求失败", error);
                alert("提交失败，请稍后重试");
            });
        }
        
      });
  }
});
