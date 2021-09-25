---
title: Auth API
---

# AzAuth

AzAuth ist eine API, mit der Du Benutzer einer Website unter Azuriom
auf jeder Plattform authentifizieren kannst.

## Download

AzAuth-Quellen sind auf [GitHub](https://github.com/Azuriom/AzAuth) verfügbar,
die JAR-Datei kann [hier](https://azuriom.s3.fr-par.scw.cloud/azauth-1.0-SNAPSHOT.jar)
heruntergeladen werden.

Wenn Du einen Abhängigkeitsmanager verwendest,
kannst Du AzAuth wie folgt als Abhängigkeit hinzufügen:

### Gradle

In `build.gradle`:

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

In `pom.xml`:
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
Unabhängig davon, wie Du die clientseitige Authentifizierungs-API verwendest,
musst Du auf dem Server überprüfen,
ob das vom Client zurückgegebene Zugriffstoken mithilfe der Überprüfungsmethode gültig ist.
{{< /warn >}}

## Use of AzAuth (Java)

Before using AzAuth, please make sure that the API is activated by going to
in the settings of your site, on your admin panel.


### Verwendung mit [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(für Minecraft Launcher)_

Füge zunächst AzAuth als Abhängigkeit zu Deinem Projekt hinzu.
Wenn Du [OpenAuth](https://github.com/Litarvan/OpenAuth/) verwendest, wird außerdem empfohlen, es zu entfernen.
Obwohl es keine wirklichen Probleme verursacht, wird es nicht mehr verwendet, wenn Du AzAuth verwendest.

Du solltest im Code Deines Launchers eine `Authentifizierungs`methode ähnlich dem folgenden Code haben:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```
Du musst es nur durch den folgenden Code ersetzen, um die `<url>` durch die URL des Website-Roots Deiner Azuriom-Website zu ändern.
```java
public static void auth(String username, String password) throws AuthenticationException, IOException {
    AzAuthenticator authenticator = new AzAuthenticator("<url>");
    authInfos = authenticator.authenticate(username, password, AuthInfos.class);
}
```

Anschließend musst Du nur noch die Klasse `AzAuthenticator` & `AuthenticationException` aus dem Paket `com.azuriom.auth` importieren und AzAuth werden
in deinen Launcher integriert.

### Nutzung ohne OpenLauncherLib

AzAuth wurde mit [Gson](https://github.com/google/gson) als einziger Abhängigkeit entwickelt, sodass Di es perfekt verwenden kannst, wenn Du es nicht verwendest
OpenLauncherLib, Sie können einfach AzAuthenticator#authenticate(String-Benutzername, String-Passwort) verwenden und das wird
Geben Sie direkt einen Benutzer mit einem Benutzernamen, einer UUID, einem Rang, einem Zugriffstoken und vielen anderen nützlichen Daten.

OpenLauncherLib, Du kannst einfach `AzAuthenticator#authenticate(String-Benutzername, String-Passwort)` verwenden, das wird Dir direkt `einen Benutzer` mit einem Benutzernamen, einer UUID, einem Rang, einem Zugriffstoken und viele andere nützlichen Daten geben.


## Verwendung mit NodeJs

### Installation

Der Quellcode ist auf [GitHub](https://github.com/Azuriom/AzAuthJs) verfügbar,
das paket kann mit `npm install azuriom-auth` installiert werden.

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

Authentifiziere einen Benutzer mit seinen Website-Anmeldeinformationen

##### Anfrage
|   Field   |        Description         |
| --------- | -------------------------- |
|   email   | Benutzername oder E-Mail-Adresse |
| password  |           Passwort         |

##### Antwort

Gibt den Benutzer mit seinen verschiedenen Informationen und dem einzigartigen Token zurück
die verwendet werden kann, um die Verbindung zu überprüfen oder zu trennen.

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

#### Verifizierung

**POST** `/verify`

##### Anfrage
|     Field    |     Description     |
| ------------ | ------------------- |
| access_token | Einzigartiges Zugriffstoken |

##### Anwort

Gibt den Benutzer mit seinen verschiedenen Informationen und dem einzigartigen Token zurück
die verwendet werden kann, um die Verbindung zu überprüfen oder zu trennen.

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

Meldet den Benutzer ab und macht das Zugriffstoken ungültig.

##### Anfrage
|     Field    |     Description     |
| ------------ | ------------------- |
| access_token | Einzigartiges Zugriffstoken |

##### Anwort

Leere Antwort mit `2xx` Statuscode.