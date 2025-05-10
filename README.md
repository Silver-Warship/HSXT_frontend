## 部署说明

环境准备：npm, pnpm, node.js

### 1. 导入必要配置文件

创建或导入`.env`文件，内容大致如下：

```js
VITE_APP_WS_URL = 'ws://www.example.com:8080/chat';
VITE_APP_HTTP_URL = 'http://www.example.com:8080/api';
```

其中，`www.example.com`需要替换为实际的服务器 IP 或域名。

### 2. 生产构建项目

在本地项目根目录运行：

```bash
pnpm install
pnpm build
```

构建产物位于 `dist/` 文件夹。

---

### 3. 上传构建产物到服务器

#### 方式一：使用宝塔面板的文件管理器

1. 登录宝塔面板。
2. 创建一个站点（如 `example.com`），选择静态网站。
3. 上传并解压 `dist/` 文件夹内容到站点根目录（例如 `/www/wwwroot/example.com/`）。

---

### 4. 配置宝塔面板网站

1. 在宝塔中打开该站点的「网站设置」>「伪静态」。
2. 设置为：

```nginx
try_files $uri $uri/ /index.html;
```

---

### 5. 配置防火墙与安全组

确保以下端口开放：

- 网站端口（默认为 80）

在：

- 阿里云控制台中：配置安全组规则，放行 80（一般默认开放）；
- 宝塔面板中：「安全」>「放行端口」。
