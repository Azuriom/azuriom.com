---
title: Auth-API
---

# AzAuth

AzAuth is een API waarmee u gebruikers van een website onder Azuriom op elk platform kunt authenticeren.

{{< warn >}}
Ongeacht hoe u de client-side auth-api gebruikt, u moet zich verifiëren op
de server waarop het toegangstoken door de client is geretourneerd
en geldig is door gebruik te maken van de `verificatie`-methode.
{{< /warn>}}

## Download

AzAuth-bronnen zijn beschikbaar op [GitHub](https://github.com/Azuriom/AzAuth)
en het jar-bestand kan worden gedownload [hier](https://oss.sonatype.org/content/repositories/snapshots/com/azuriom/azauth/0.1.0-SNAPSHOT/azauth-0.1.0-20220420.160910-3.jar).

Als u een afhankelijkheidsmanager gebruikt, kunt u AzAuth toevoegen als
afhankelijkheid op de volgende manier:

### Gradle

in de `build.gradle`:

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

In de `pom.xml`:
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

## AzAuth gebruik (Java)

Voordat u AzAuth gebruikt, moet u ervoor zorgen dat de API is geactiveerd door naar:
de instellingen van uw site te gaan, in uw beheerders paneel.

### Gebruik zonder OpenLauncherLib

AzAuth is ontworpen met [Gson](https://github.com/google/gson) als enige afhankelijkheid, dus je kunt het perfect gebruiken als je OpenLauncherLib niet gebruikt,
Je kunt gewoon `AuthClient#authenticate(String gebruikersnaam, String wachtwoord, Supplier<String> codeSupplier)` gebruiken en dat geeft
je direct een `Gebruiker` met daaring een gebruikersnaam, uuid, rang, toegangstoken en tal van andere nuttige gegevens. De `codeSupplier`
wordt aangeroepen als de gebruiker 2FA heeft ingeschakeld en de gebruikerscode moet worden teruggestuurd naar de leverancier.

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
public static void auth(String username, String password) throws AuthException {
    AuthClient authenticator = new AuthClient("<url>");

    AuthInfos = authenticator.login(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // De bovenliggende component voor het dialoogvenster. U moet de code vervangen
            // hieronder met een exemplaar van je launcher frame/panel/etc
            Container parentComponent = LauncherFrame.getInstance().getLauncherPanel();
            parentComponent.setVisible(true);

            code = JOptionPane.showInputDialog(parentComponent, "Enter your 2FA code", "2FA", JOptionPane.PLAIN_MESSAGE);
        }

        return code;
    }, AuthInfos.class);
}
```

## Gebruik met JavaScript

### Installatie

De broncode is beschikbaar op [GitHub](https://github.com/Azuriom/AzAuthJs)
en het pakket kan worden geïnstalleerd met [npm](https://www.npmjs.com/):
```
npm install azuriom-auth
```

### Voorbeeld

```js
import { AuthClient } from 'azuriom-auth'

async function login(email, password) {
    const client = new AuthClient('<url van je website>')

    let result = await client.login(email, password)

    if (result.status === 'pending' && result.requires2fa) {
        const twoFactorCode = '' // BELANGRIJK: Vervang door de tijdelijke gebruikerscode van 2FA

        result = await client.login(email, password, twoFactorCode)
    }

    if (result.status !== 'success') {
        throw 'Unexpected result: ' + JSON.stringify(result)
    }

    return result
}
```


### Eindpunten

#### Authenticatie

**POST** `/authenticate`

Verifieer een gebruiker met hun website-inloggegevens

##### Verzoek
| Veld       | Beschrijving                                                                                               |
|------------|------------------------------------------------------------------------------------------------------------|
| E-mail     | Gebruikersnaam of e-mailadres                                                                              |
| wachtwoord | wachtwoord                                                                                                 |
| code       | 2FA-code, mag alleen worden opgenomen als het antwoord `status` `in behandeling` is en de `reden` `2fa` is |

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
| Veld          | Beschrijving        |
|---------------|---------------------|
| toegangstoken | Uniek toegangstoken |

##### Antwoord

Retourneert de gebruiker met verschillende informatie en het unieke token
die kan worden gebruikt om de verbinding te verifiëren of om de verbinding te verbreken.

Voorbeeld van successreactie (HTTP `2xx`):
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

Voorbeeld van foutreactie (HTTP `4xx`):
```json
{
    "status": "fout",
    "reason": "ongeldige-inloggegevens",
    "message": "Ongeldige inloggegevens"
}
```

#### Uitloggen

**POST** `/logout`

Meld de gebruiker af en maakt het toegangstoken ongeldig.

##### Verzoek
| Veld          | Beschrijving        |
|---------------|---------------------|
| toegangstoken | Uniek toegangstoken |

##### Antwoord

Leeg antwoord, met statuscode `2xx`.
