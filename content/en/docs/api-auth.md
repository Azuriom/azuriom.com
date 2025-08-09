---
title: Auth API
---

# AzAuth

AzAuth is an API for authenticating users with Azuriom. It can be used in Java, JavaScript, or any other language that can make HTTP requests.

Before using AzAuth, please make sure it is enabled in the admin dashboard, in Settings -> Authentication.

{{< warn >}}
Regardless of how you use the API on the client side, you must verify the access token returned by the client on the server side.
This can be done by calling the `/verify` endpoint or using the `verify` method.
{{< /warn >}}

## Java

{{< info >}}
AzAuth Java is a Java library and not a Minecraft plugin, and can be used for example in a Minecraft launcher,
to add Azuriom authentication to it.
{{< /info >}}

AzAuth Java sources are available on [GitHub](https://github.com/Azuriom/AzAuth) and the jar file can be downloaded from [GitHub releases](https://github.com/Azuriom/AzAuth/releases).

The recommended way to use AzAuth in a project is to use a dependency manager, like Maven or Gradle.

### Installation

On Gradle, add these lines to the `build.gradle`:

```gradle
repositories {
    mavenCentral()
} 

dependencies {
    implementation 'com.azuriom:azauth:1.1.0'
}
```

On Maven, add these lines to the `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>com.azuriom</groupId>
        <artifactId>azauth</artifactId>
        <version>1.1.0</version>
    </dependency>
</dependencies>
```

### Usage

AzAuth is lightweight and has as [Google Gson](https://github.com/google/gson) as its only dependency.

The entry point of the library is the `AuthClient` class. You can create an instance of it by passing the URL of your Azuriom website.
Then, you can use the `login(String username, String password, Supplier<String> codeSupplier)` method to authenticate a user.
The `codeSupplier` is called when the user has 2FA enabled, and the user code should be returned to the supplier.

Here is an example of how to use AzAuth in a Java application:

```java{hl_lines=["2-3", "9-10"]}
public static User auth(String username, String password) throws AuthException {
    // IMPORTANT: Replace <url> with the URL of your Azuriom website
    AuthClient authenticator = new AuthClient("<url>");

    return authenticator.authenticate(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // IMPORTANT: Replace <2fa_code> with the user's temporary code
            code = "<2fa_code>";
        }

        return code;
    });
}
```

### OpenLauncherLib Usage

For a Minecraft launcher with [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib),
the default `auth` method should look like this:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```

This method can be replaced with the following code to use AzAuth instead of Mojang's authentication system:
```java{hl_lines=["2-3", "9-12"]}
public static void auth(String username, String password) throws AuthException {
    // IMPORTANT: Replace <url> with the URL of your Azuriom website
    AuthClient authenticator = new AuthClient("<url>");

    authInfos = authenticator.login(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // IMPORTANT: The parent component for the dialog. You should replace the code
            // below with an instance of your launcher frame/panel/etc
            Container parentComponent = LauncherFrame.getInstance().getLauncherPanel();
            parentComponent.setVisible(true);

            code = JOptionPane.showInputDialog(parentComponent, "Enter your 2FA code", "2FA", JOptionPane.PLAIN_MESSAGE);
        }

        return code;
    }, AuthInfos.class);
}
```

## JavaScript

### Installation

The source code is available on [GitHub](https://github.com/Azuriom/AzAuthJS)
and the package can be installed with [npm](https://www.npmjs.com/):
```sh
npm install azuriom-auth
```

### Usage

The entry point of the library is the `AuthClient` class. You can create an instance of it by passing the URL of your Azuriom website.
Then, you can use the `login` method to authenticate a user.

```js{hl_lines=["4-5", "10-11"]}
import { AuthClient } from 'azuriom-auth'

async function login(email, password) {
    // IMPORTANT: Replace <url> with the URL of your Azuriom website
    const client = new AuthClient('<url>')

    let result = await client.login(email, password)

    if (result.status === 'pending' && result.requires2fa) {
        // IMPORTANT: Replace <2fa_code> with the user's temporary code
        const twoFactorCode = '<2fa_code>'

        result = await client.login(email, password, twoFactorCode)
    }

    if (result.status !== 'success') {
        throw 'Unexpected result: ' + JSON.stringify(result)
    }

    return result
}
```

## HTTP API

AzAuth can be used in any language without the need for a specific library,
directly by making plain HTTP requests to the API endpoints.

The API uses JSON, and the base path of the API is `/api/auth`.

A code 200 is returned on success, and a code 422 on missing or invalid parameters. Dates are returned in ISO 8601 format.

### Endpoints

#### Authentification

**POST** `/authenticate`

Authenticate a user with their website credentials

##### Request
| Field    | Description                                                                                       |
|----------|---------------------------------------------------------------------------------------------------|
| email    | Username or email address                                                                         |
| password | Password                                                                                          |
| code     | 2FA code, should be included only if the response `status` is `pending` and the `reason` is `2fa` |

##### Response

Returns the user and the unique token that can be used to verify the connection or to log out.

Success response example (HTTP `2xx`):

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

#### Verification

**POST** `/verify`

##### Request
| Field        | Description         |
|--------------|---------------------|
| access_token | Unique access token |

##### Response

Returns the user and the unique token that can be used to verify the connection or to log out.

Success response example (HTTP `2xx`):

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

Error response example (HTTP `4xx`):
```json
{
    "status": "error",
    "reason": "invalid_credentials",
    "message": "Invalid credentials"
}
```

#### Logout

**POST** `/logout`

Log out the user and invalidate the access token.

##### Request
| Field        | Description         |
|--------------|---------------------|
| access_token | Unique access token |

##### Response

Empty response, with `2xx` status code on success.
