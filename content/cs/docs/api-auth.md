---
title: Přihlašovací API
---

# AzAuth

AzAuth je API umožňující přihlašování uživatelů na Azuriom webu na všech platformách.

## Stažení

Zdroje AzAuth jsou dostupné na [GitHubu](https://github.com/Azuriom/AzAuth)
a jar soubor může být stažen [odsud](https://azuriom.s3.fr-par.scw.cloud/azauth-1.0-SNAPSHOT.jar).

Pokud používáte správce závislostí, můžete přidat AzAuth jako
závislost následujícím způsobem:

### Gradle

v `build.gradle`:

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

v `pom.xml`:
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
Nezávisle na způsobu použití API na straně klienta, musíte na serveru
ověřit, že je vrácený přístupový token vrácený klientem platný pomocí
metody `verify`.
{{< /warn >}}

## Použití AzAuth (Java)

Před použitím AzAuth se ujistěte, že je aktivováno tak, že půjdete do
nastavení vašeho webu ve vašem správcovském panelu.

### Použití s [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(pro Minecraft Launcher)_

Pro začátek přidejte AzAuth jako závislost do vašeho projektu.
Pokud také používáte [OpenAuth](https://github.com/Litarvan/OpenAuth/), je doporučeno jej odebrat,
protože přesto že nezpůsobuuje žádné reálné problémy, již není používáno, pokud používáte AzAuth.

V kódu vašeho launcheru byste měli mít metodu `auth` podobnou kódu níže:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```
Stačí ji pouze nahradit kódem níže a upravit `<url>` základní adresou URL vašeho Azuriom webu.
```java
public static void auth(String username, String password) throws AuthenticationException, IOException {
    AzAuthenticator authenticator = new AzAuthenticator("<url>");
    authInfos = authenticator.authenticate(username, password, AuthInfos.class);
}
```
Jakmile je toto hotové, stačí naimportovat třídy `AzAuthenticator` a
`AuthenticationException` z balíčku `com.azuriom.auth` a AzAuth bude integrován
do vašeho launcheru.

### Použití bez OpenLauncherLib

AzAuth byl vytvořen s [Gson](https://github.com/google/gson) jako jedinou závislostí, takže jej můžete normálně použít, pokud nepoužíváte
OpenLauncherLib, můžete jednoduše použít `AzAuthenticator#authenticate(String username, String password)`, což vám
přímo dá `User` obsahující uživatelské jméno, uuid, rank, přístupový token a spoustu dalších užitečných dat.


## Použití s NodeJs

### Instalace

Zdrojový kód je dostupný na [GitHubu](https://github.com/Azuriom/AzAuthJs)
a balíček může být nainstalován pomocí `npm install azuriom-auth`.

### Použití

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


### Endpointy

#### Autentifikace

**POST** `/authenticate`

Ověřit uživatele s jeho webovými údaji

##### Žádost
| Pole     | Popis                         |
|----------|-------------------------------|
| email    | Uživatelské jméno nebo e-mail |
| password | Heslo                         |

##### Odpověď

Vrátí uživatele s jeho různými informacemi a unikátním tokenem,
který může být použit k ověření připojení nebo k odpojení.

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

#### Ověření

**POST** `/verify`

##### Žádost
| Pole         | Popis                     |
|--------------|---------------------------|
| access_token | Unikátní přístupový token |

##### Odpověď

Vrátí uživatele s jeho různými informacemi a unikátním tokenem,
který může být použit k ověření připojení nebo k odpojení.

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

#### Odhlášení

**POST** `/logout`

Odhlásí uživatele a zneplatní přístupový token

##### Žádost
| Pole         | Popis                     |
|--------------|---------------------------|
| access_token | Unikátní přístupový token |

##### Odpověď

Prázdná odpověď se stavovým kódem `2xx.
