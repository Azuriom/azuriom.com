---
title: 验证 API
---

# AzAuth

AzAuth 是一个 API, 允许你在任何平台上对 Azuriom 下的网站用户进行认证。

{{< warn >}}
无论你如何使用客户端的认证 API, 必须在服务器上使用 `verify` 方法以验证客户端返回的访问令牌是否有效.
{{< /warn >}}

## 下载

AzAuth 的源码可以在 [GitHub](https://github.com/Azuriom/AzAuth)
上找到, 你可以在 [这里](https://repo.maven.apache.org/maven2/com/azuriom/azauth/1.0.0/azauth-1.0.0.jar) 下载 AzAuth 的 Jar 文件.

如果你正在使用依赖管理器, 你可以通过以下方式将 AzAuth 添加为依赖项:

### Gradle

在 `build.gradle` 文件内:

```groovy
repositories {
    mavenCentral()
} 

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

在 `pom.xml` 文件内:
```xml
<dependencies>
    <dependency>
        <groupId>com.azuriom</groupId>
        <artifactId>azauth</artifactId>
        <version>1.0.0</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

## AzAuth 使用方法 (Java)

在使用 AzAuth 之前，请确保在你的管理面板上激活 API 功能.

### 不使用 OpenLauncherLib

AzAuth 在设计时将 [Gson](https://github.com/google/gson) 作为唯一的依赖关系, 所以如果你不使用 OpenLauncherLib, 你可以直接用 `AuthClient#authenticate(String username, String password, Supplier<String> codeSupplier)` 这将直接给你一个 `User` 包含 用户名, uuid, 等级, 访问令牌 和其他数据. 当用户启用了 2FA 时 `codeSupplier`
被调用, 用户的验证码应返回给 Supplier.

### 使用 [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(用于 Minecraft 启动器)_

首先, 将 AzAuth 作为一个依赖项添加到你的项目中.
另外, 如果你正在使用 [OpenAuth](https://github.com/Litarvan/OpenAuth/), 建议你把它删除,
然它不会造成任何实际问题, 但如果你使用 AzAuth, 它就没什么用了.

你的启动器代码中应该有一个类似于以下代码的 `auth` 方法:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```
你只需用下面的代码替换它, 用你的 Azuriom 网站根目录的 URL 替换 `<url>` .
```java
public static void auth(String username, String password) throws AuthException {
    AuthClient authenticator = new AuthClient("<url>");

    authInfos = authenticator.login(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // 对话框的父组件. 你应该用你的
            // 启动器 框架/面板 等实例来替换下面的代码
            Container parentComponent = LauncherFrame.getInstance().getLauncherPanel();
            parentComponent.setVisible(true);

            code = JOptionPane.showInputDialog(parentComponent, "输入你的 2FA 代码", "2FA", JOptionPane.PLAIN_MESSAGE);
        }

        return code;
    }, AuthInfos.class);
}
```

## 使用 JavaScript 开发

### 安装

源码在 [GitHub](https://github.com/Azuriom/AzAuthJS)
上可以找到, 并且依赖包可以使用 [npm](https://www.npmjs.com/) 安装:
```
npm install azuriom-auth
```

### 示例

```js
import { AuthClient } from 'azuriom-auth'

async function login(email, password) {
    const client = new AuthClient('<你网站的 Url>')

    let result = await client.login(email, password)

    if (result.status === 'pending' && result.requires2fa) {
        const twoFactorCode = '' // 重要信息: 此处使用用户的 2FA 代码替换

        result = await client.login(email, password, twoFactorCode)
    }

    if (result.status !== 'success') {
        throw 'Unexpected result: ' + JSON.stringify(result)
    }

    return result
}
```


### 接口说明

#### 认证

**POST** `/authenticate`

使用 用户的网站凭证 来认证用户

##### 请求参数
| 字段      | 描述                                                            |
|----------|-----------------------------------------------------------------|
| email    | 用户名或邮箱地址                                                  |
| password | 密码                                                             |
| code     | 2FA 代码, 只有在 `status` 为 `pending` 且 `reason` 为 `2fa` 时可用|

##### 返回参数

返回用户和他的各种信息，以及可用于验证连接或断开连接的唯一 token.

```json
{
    "id": 1,
    "username": "Username",
    "uuid": "00000000-0000-0000-0000-000000000000",
    "email_verified": true,
    "money": 100.0,
    "role": {
        "name": "Member",
        "color": "#e10d11"
    },
    "banned": false,
    "created_at": "2020-06-29T17:39:12+00:00",
    "access_token": "xxxxxxxx"
}
```

#### 验证

**POST** `/verify`

##### 请求参数
| 字段          | 描述          |
|--------------|---------------|
| access_token | 唯一的访问令牌 |

##### 返回参数

返回用户和他的各种信息，以及可用于验证连接或断开连接的唯一 token.

正常返回的示例 (HTTP `2xx`):
```json
{
    "id": 1,
    "username": "Username",
    "uuid": "00000000-0000-0000-0000-000000000000",
    "email_verified": true,
    "money": 100.0,
    "role": {
        "name": "Member",
        "color": "#e10d11"
    },
    "banned": false,
    "created_at": "2020-06-29T17:39:12+00:00",
    "access_token": "xxxxxxxx"
}
```

异常返回的示例 (HTTP `4xx`):
```json
{
    "status": "error",
    "reason": "invalid_credentials",
    "message": "Invalid credentials"
}
```

#### 登出

**POST** `/logout`

登出用户并使访问令牌失效.

##### 请求示例
| 字段         | 描述           |
|--------------|---------------|
| access_token | 唯一的访问令牌 |

##### 返回示例

返回为空, HTTP 状态码 `2xx` .
