---
title: Auth-API
---

# AzAuth

AzAuth is een API waarmee u gebruikers van een website onder Azuriom op elk platform kunt authenticeren.

## Download

AzAuth-bronnen zijn beschikbaar op [GitHub](https://github.com/Azuriom/AzAuth)
en het jar-bestand kan worden gedownload [hier](https://azuriom.s3.fr-par.scw.cloud/azauth-1.0-SNAPSHOT.jar).

Als u een afhankelijkheidsmanager gebruikt, kunt u AzAuth toevoegen als
afhankelijkheid op de volgende manier:

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
Ongeacht hoe u de client-side auth-api gebruikt, u moet zich verifiëren op
de server waarop het toegangstoken door de client is geretourneerd
en geldig is door gebruik te maken van de `verificatie`-methode.
{{< /warn >}}

## Gebruik van AzAuth (Java)

Voordat u AzAuth gebruikt, moet u ervoor zorgen dat de API is geactiveerd door naar:
de instellingen van uw site te gaan, in uw beheerders paneel.

### Gebruiken met [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(voor minecraft launcher)_

Voeg om te beginnen AzAuth toe als afhankelijkheid aan uw project.
Als u [OpenAuth](https://github.com/Litarvan/OpenAuth/) gebruikt, is
het ook aan te raden deze te verwijderen, hoewel het geen echte problemen veroorzaakt,
wordt het niet meer gebruikt als je AzAuth gebruikt.

U zou in de code van uw opstartprogramma een `auth`-methode moeten hebben die lijkt op de onderstaande code:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```
Je hoeft het alleen maar te vervangen door de onderstaande code, om `<url>` te wijzigen, moet je de URL van de hoofdmap van je Azuriom website gebruiken.
```java
public static void auth(String username, String password) throws AuthenticationException, IOException {
    AzAuthenticator authenticator = new AzAuthenticator("<url>");
    authInfos = authenticator.authenticate(username, password, AuthInfos.class);
}
```
Zodra dit is gebeurd, hoeft u alleen maar de klasse `AzAuthenticator` & `AuthenticationException`
uit het `com.azuriom.auth`-pakket en AzAuth wordt geïntegreerd in uw opstartprogramma.

### Gebruik zonder OpenLauncherLib

AzAuth is ontworpen met [Gson](https://github.com/google/gson) als enige afhankelijkheid,
dus je kunt het perfect gebruiken als je het niet gebruikt met OpenLauncherLib,
u kunt eenvoudig `AzAuthenticator#authenticate(String gebruikersnaam, String wachtwoord)` gebruiken
en dat geeft je direct een `Gebruiker` met daarin een gebruikersnaam, UUID, rang, toegangstoken en
tal van andere nuttige gegevens.

## Gebruik met NodeJS

### Installatie

De broncode is beschikbaar op [GitHub](https://github.com/Azuriom/AzAuthJs)
en het pakket kan worden geïnstalleerd met `npm install azuriom-auth`.

### Gebruik

```js
const AzuriomAuth = require('azuriom-auth');

async function login(email, password) {
  const authenticator = new Authenticator('<url van uw website>');

  try {
    const user = await authenticator.auth(email, password);

    console.log(`ingelogd met ${user.email}`);
  } catch (e) {
    console.log(e);
  }
}
```


### Eindpunten

#### Authenticatie

**POST** `/authenticate`

Verifieer een gebruiker met hun website-inloggegevens

##### Verzoek
|    Veld    |          Beschrijving         |
| ---------- | ----------------------------- |
|   e-mail   | Gebruikersnaam of e-mailadres |
| wachtwoord |           wachtwoord          |

##### Antwoord

Retourneert de gebruiker met verschillende informatie en het unieke token
die kan worden gebruikt om de verbinding te verifiëren of om de verbinding te verbreken.

```json
{
    "id": 1,
    "username": "Gebruikersnaam",
    "uuid": "00000000-0000-0000-0000-000000000000",
    "email_verified": true,
    "money": 100.0,
    "role": {
        "name": "Lid",
        "color": "#e10d11"
    },
    "banned": false,
    "created_at": "2020-06-29T17:39:12+00:00",
    "access_token": "xxxxxxxx"
}
```

#### Verificatie

**POST** `/verify`

##### Verzoek
|      Veld     |     Beschrijving    |
| ------------- | ------------------- |
| toegangstoken | Uniek toegangstoken |

##### Antwoord

Retourneert de gebruiker met verschillende informatie en het unieke token
die kan worden gebruikt om de verbinding te verifiëren of om de verbinding te verbreken.

```json
{
    "id": 1,
    "username": "Gebruikersnaam",
    "uuid": "00000000-0000-0000-0000-000000000000",
    "email_verified": true,
    "money": 100.0,
    "role": {
        "name": "Lid",
        "color": "#e10d11"
    },
    "banned": false,
    "created_at": "2020-06-29T17:39:12+00:00",
    "access_token": "xxxxxxxx"
}
```

#### Uitloggen

**POST** `/logout`

Meld de gebruiker af en maakt het toegangstoken ongeldig.

##### Verzoek
|      Veld     |     Beschrijving    |
| ------------- | ------------------- |
| toegangstoken | Uniek toegangstoken |

##### Antwoord

Leeg antwoord, met statuscode `2xx`.
