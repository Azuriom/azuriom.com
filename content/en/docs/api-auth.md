---
title: Auth API
---

# AzAuth

AzAuth is an api allowing you to authenticate users of a website under Azuriom on any platform.

## Download

AzAuth sources are available on [GitHub](https://github.com/Azuriom/AzAuth)
and the jar file can be downloaded [here](https://azuriom.s3.fr-par.scw.cloud/azauth-1.0-SNAPSHOT.jar).

If you are using a dependency manager, you can add AzAuth as a
dependency by the following way:

### Gradle

in `build.gradle`:

```groovy
repositories {
    maven { url 'https://oss.sonatype.org/content/repositories/snapshots/' }
}
```
```groovy
dependencies {
    implementation 'com.azuriom:azauth:1.0-SNAPSHOT'
}
```

### Maven

in `pom.xml`:
```xml
<repositories>
    <repository>
        <id>sonatype-repo</id>
        <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
    </repository>
</repositories>
```
```xml
<dependencies>
    <dependency>
        <groupId>com.azuriom</groupId>
        <artifactId>azauth</artifactId>
        <version>1.0-SNAPSHOT</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

{{< warn >}}
Regardless of how you use the client-side auth api, you must verify on
the server that the access token returned by the client is valid by using
the `verify` method.
{{< /warn >}}

## Use of AzAuth (Java)

Before using AzAuth, please make sure that the API is activated by going to
in the settings of your site, on your admin panel.

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
public static void auth(String username, String password) throws AuthenticationException, IOException {
    AzAuthenticator authenticator = new AzAuthenticator("<url>");
    authInfos = authenticator.authenticate(username, password, AuthInfos.class);
}
```
Once this is done, you just need to import the class `AzAuthenticator` &
`AuthenticationException` from the `com.azuriom.auth` package and AzAuth will be integrated
into your launcher.

### Usage without OpenLauncherLib

AzAuth has been designed with [Gson](https://github.com/google/gson) as its only dependency, so you can use it perfectly well if you don't use
OpenLauncherLib, you can simply use `AzAuthenticator#authenticate(String username, String password)` and that will 
give you directly a `User` containing a username, uuid, rank, access token and lots of other useful data.


## Usage with NodeJs

### Installation

The source code is available on [GitHub](https://github.com/Azuriom/AzAuthJs)
and the package can be installed with `npm install azuriom-auth`.

### Usage

```js
const AzuriomAuth = require('azuriom-auth');

async function login(email, password) {
  const authenticator = new Authenticator('<url of your website>');

  try {
    const user = await authenticator.auth(email, password);

    console.log(`Logged in with ${user.email}`);
  } catch (e) {
    console.log(e);
  }
}
```


### Endpoints

#### Authentification

**POST** `/authenticate`

Authenticate a user with their website credentials

##### Request
|   Field   |        Description         |
| --------- | -------------------------- |
|   email   | Username or e-mail address |
| password  |           Password         |

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
|     Field    |     Description     |
| ------------ | ------------------- |
| access_token | Unique access token |

##### Réponse

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

#### Logout

**POST** `/logout`

Logout the user and invalidates the access token.

##### Request
|     Field    |     Description     |
| ------------ | ------------------- |
| access_token | Unique access token |

##### Response

Empty response, with `2xx` status code.
