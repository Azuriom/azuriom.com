---
title: Auth API
---

# AzAuth

AzAuth adalah sebuah api yang memperbolehkan anda untuk mengautentikasi pengguna dari sebuah laman dibawah Azuriom diberbagai platform.

## Download

AzAuth tersedia di [GitHub](https://github.com/Azuriom/AzAuth)
dan file jar dapat di download [disini](https://github.com/Azuriom/AzAuth/releases/download/v1.0.0/azauth-1.0.0.jar).

Jika anda menggunakan dependency manager, anda bisa menambahkan AzAuth sebagai
depedency sebagai berikut:

### Gradle

di `build.gradle`:

```groovy
repositories {
    mavenCentral()
} 
dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

di `pom.xml`:
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

{{< warn >}}
Kesampingkan bagaimana cara anda menggunakan auth api bagian pengguna, anda harus verifikasi di
server yang mengakses token yang diberikan oleh pengguna valid dengan menggunakan
metode `verify`.
{{< /warn >}}

## Penggunaan dari AzAuth (Java)

Sebelum menggunakan AzAuth, mohon pastikan bahwa API telah aktif dengan pergi ke
setelan dari laman anda, di panel admin anda.

### Penggunaan dengan [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(for minecraft launcher)_

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

### Penggunaan tanpa OpenLauncherLib

AzAuth telah dibuat dengan [Gson](https://github.com/google/gson) untuk dependencynya, jadi anda bisa menggunakannya dengan sangat baik meskipun tidak menggunakan
OpenLauncherLib, anda bisa memakai `AzAuthenticator#authenticate(String username, String password)` dan ini akan 
memberikan anda sebuah `User` berisi username, uuid, rank, token akses dan banyak data yang berguna lainnya.


## Penggunaan dengan NodeJs

### Instalasi

Sumber kode tersedia di [GitHub](https://github.com/Azuriom/AzAuthJs)
dan paket bisa install dengan `npm install azuriom-auth`.

### Penggunaan

```js
const AzuriomAuth = require('azuriom-auth');

async function login(email, password) {
  const authenticator = new Authenticator('<laman url anda>');

  try {
    const user = await authenticator.auth(email, password);

    console.log(`Masuk dengan ${user.email}`);
  } catch (e) {
    console.log(e);
  }
}
```


### Endpoints

#### Autentifikasi

**POST** `/authenticate`

Otentikasi sebuah pengguna dengan kredensial laman mereka

##### Permintaan
|   Field   |        Deskripsi         |
| --------- | -------------------------- |
|   email   | Username atau alamat e-mail address |
| kata sandi  |           Kata Sandi         |

##### Tanggapan

Memberikan ke pengguna dengan berbagai informasi, dan token unik
yang dapat digunakan untuk memverifikasi sebuah koneksi atau putus jaringan.

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

#### Verifikasi

**POST** `/verify`

##### Request
|     Field    |     Deskripsi     |
| ------------ | ------------------- |
| access_token | Token akses unik  |

##### Tanggapan

Memberikan pengguna dengan informasi berbagai, dan token unik
yang bisa digunakan untuk verifikasi sebuah koneksi atau untuk memutuskan jaringan.

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

Mebgeluarkan pengguna dan membatalkan token akses.

##### Request
|     Field    |     Deskripsi     |
| ------------ | ------------------- |
| access_token | Token akses unik  |

##### Tanggapan

Tanggapan kosong, dengan kode status `2xx`.
