---
title: Auth API
---

# AzAuth

AzAuth is an api allowing you to authenticate users of a website under Azuriom on any platform.

{{< warn >}}
Regardless of how you use the client-side auth api, you must verify on
the server that the access token returned by the client is valid by using
the `verify` method.
{{< /warn >}}

## Download

AzAuth sources are available on [GitHub](https://github.com/Azuriom/AzAuth)
and the jar file can be downloaded [here](https://repo.maven.apache.org/maven2/com/azuriom/azauth/1.0.0/azauth-1.0.0.jar).

If you are using a dependency manager, you can add AzAuth as a
dependency by the following way:

### Gradle

In the `build.gradle`:

```groovy
repositories {
    mavenCentral()
} 

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

In the `pom.xml`:
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

## AzAuth usage (Java)

Before using AzAuth, please make sure that the API is activated by going to
in the settings of your site, on your admin panel.

### Usage without OpenLauncherLib

AzAuth has been designed with [Gson](https://github.com/google/gson) as its only dependency, so you can use it perfectly well if you don't use
OpenLauncherLib, you can simply use `AuthClient#authenticate(String username, String password, Supplier<String> codeSupplier)` and that will
give you directly a `User` containing a username, uuid, rank, access token and lots of other useful data. The `codeSupplier`
is called when the user has 2FA enabled, and the user code should be returned to the supplier.

### Using with [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(for minecraft launcher)_

To begin, add AzAuth as a dependency to your project.
Also, if you are using [OpenAuth](https://github.com/Litarvan/OpenAuth/), it is recommended that you remove it,
although it does not cause any real problems, it is no longer used if you use AzAuth.

You should have in the code of your launcher an `auth` method similar to the code below:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```

You just have to replace it by the code below, to modify `<url>` by the URL of your Azuriom's website root.
```java
public static void auth(String username, String password) throws AuthException {
    AuthClient authenticator = new AuthClient("<url>");

    authInfos = authenticator.login(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // The parent component for the dialog. You should replace the code
            // below with an instance of your launcher frame/panel/etc
            Container parentComponent = LauncherFrame.getInstance().getLauncherPanel();
            parentComponent.setVisible(true);

            code = JOptionPane.showInputDialog(parentComponent, "Enter your 2FA code", "2FA", JOptionPane.PLAIN_MESSAGE);
        }

        return code;
    }, AuthInfos.class);
}
```

## Usage with JavaScript

### Installation

The source code is available on [GitHub](https://github.com/Azuriom/AzAuthJS)
and the package can be installed with [npm](https://www.npmjs.com/):
```
npm install azuriom-auth
```

### Example

```js
import { AuthClient } from 'azuriom-auth'

async function login(email, password) {
    const client = new AuthClient('<url of your website>')

    let result = await client.login(email, password)

    if (result.status === 'pending' && result.requires2fa) {
        const twoFactorCode = '' // IMPORTANT: Replace with the 2FA user temporary code

        result = await client.login(email, password, twoFactorCode)
    }

    if (result.status !== 'success') {
        throw 'Unexpected result: ' + JSON.stringify(result)
    }

    return result
}
```


### Endpoints

#### Authentification

**POST** `/authenticate`

Authenticate a user with their website credentials

##### Request
| Field    | Description                                                                                       |
|----------|---------------------------------------------------------------------------------------------------|
| email    | Username or e-mail address                                                                        |
| password | Password                                                                                          |
| code     | 2FA code, should be included only if the response `status` is `pending` and the `reason` is `2fa` |

##### Response

Returns the user with his various information, and the unique token
which can be used to verify the connection or to disconnect.

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

##### Réponse

Returns the user with his various information, and the unique token
which can be used to verify the connection or to disconnect.

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

Logout the user and invalidates the access token.

##### Request
| Field        | Description         |
|--------------|---------------------|
| access_token | Unique access token |

##### Response

Empty response, with `2xx` status code.
