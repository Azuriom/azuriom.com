---
title: Auth API
---

# AzAuth

AzAuth adalah sebuah api yang memperbolehkan anda untuk mengautentikasi pengguna dari sebuah laman dibawah Azuriom diberbagai platform.

## Download

AzAuth tersedia di [GitHub](https://github.com/Azuriom/AzAuth)
dan file jar dapat di download [disini](https://azuriom.s3.fr-par.scw.cloud/azauth-1.0-SNAPSHOT.jar).

Jika anda menggunakan dependency manager, anda bisa menambahkan AzAuth sebagai
depedency sebagai berikut:

### Gradle

di `build.gradle`:

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

di `pom.xml`:
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
Kesampingkan bagaimana cara anda menggunakan auth api bagian pengguna, anda harus verifikasi di
server yang mengakses token yang diberikan oleh pengguna valid dengan menggunakan
metode `verify`.
{{< /warn >}}

## Penggunaan dari AzAuth (Java)

Sebelum menggunakan AzAuth, mohon pastikan bahwa API telah aktif dengan pergi ke
setelan dari laman anda, di panel admin anda.

### Menggunakan dengan [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(for minecraft launcher)_

Untuk mulai, tambahkan AzAuth sebagai sebuah dependency ke projek anda.
Juga, jika anda menggunakan [OpenAuth](https://github.com/Litarvan/OpenAuth/), disarankan bahwa anda menghapusnya,
meskipun ini tidak memberikan masalah serius, ini tidak lagi dipakai jika anda memakai AzAuth.

Anda harus memiliki kode dari launcher anda sebuah metode `auth` yang sama dengan kode di bawah ini:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```
Anda hanya harus menggantinya dengan kode dibawah ini, untuk menngubah `<url>` dengan URL Azuriom laman root anda.
```java
public static void auth(String username, String password) throws AuthenticationException, IOException {
    AzAuthenticator authenticator = new AzAuthenticator("<url>");
    authInfos = authenticator.authenticate(username, password, AuthInfos.class);
}
```
Setelah selesai melakukan ini, anda hanya harus mengimpor kelas `AzAuthenticator` &
`AuthenticationException` dari paket `com.azuriom.auth` dan AzAuth akan langsung terintegrasi
ke launcher anda.

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
