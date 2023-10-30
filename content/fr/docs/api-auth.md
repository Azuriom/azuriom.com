---
title: API Auth
---

# AzAuth

AzAuth est une api qui permet d'authentifier les utilisateurs d'un site sous Azuriom sur n'importe quelle plateforme
(par exemple un launcher Minecraft personnalisé).

{{< warn >}}
Quelle que soit la façon dont vous utilisez l'auth API coté client, vous
devez impérativement vérifier coté serveur que le token d'accès renvoyé par le client
est bien valide en utilisant la méthode `verify`.
{{< /warn >}}

## Téléchargement

Les sources d'AzAuth sont disponibles sur [GitHub](https://github.com/Azuriom/AzAuth)
et le fichier "jar" peut être téléchargé [ici](https://repo.maven.apache.org/maven2/com/azuriom/azauth/1.0.0/azauth-1.0.0.jar).

Si vous utilisez un gestionnaire de dépendances, vous pouvez ajouter AzAuth comme
dépendance de la façon suivante :

### Gradle

Dans le `build.gradle`:
```groovy
repositories {
    mavenCentral()
} 

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

Dans le `pom.xml`:
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

## Utilisation de AzAuth (Java)

Avant d'utiliser AzAuth, veuillez vérifier que l'API est bien activée en allant
dans les réglages de votre site, sur votre panel admin.


### Utilisation sans OpenLauncherLib

AzAuth a été conçu avec comme seule dépendance [Gson](https://github.com/google/gson), vous pouvez donc parfaitement l'utiliser si vous n'utilisez pas
OpenLauncherLib, vous pouvez simplement utiliser `AuthClient#authenticate(String username, String password, Supplier<String> codeSupplier)` et cela va
vous donner directement un `User` contenant le pseudo, l'UUID, le grade, le token d'accès et d'autres données utiles. Le paramètre `codeSupplier`
est appelé lorsque l'utilisateur a l'authentification à deux facteurs activée, et dans ce cas
le code temporaire doit être retournée dans le `Supplier`.

### Utilisation avec [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(pour launcher minecraft)_

Pour commencer, ajoutez AzAuth en dépendance à votre projet.
Également si vous utilisez [OpenAuth](https://github.com/Litarvan/OpenAuth/), il est recommandé de le retirer,
bien que ne causant pas de réels problèmes, il ne sera simplement plus utilisé si vous utilisez AzAuth.

Vous devriez avoir dans le code de votre launcher une méthode `auth` ressemblant au code ci-dessous :
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```

Il vous suffit de la remplacer par le code ci-dessous, en remplaçant `<url>` par l'URL de la racine de votre site sous Azuriom.
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

## Utilisation de AzAuth JavaScript

### Installation

Les sources d'AzAuth JS sont disponibles sur [GitHub](https://github.com/Azuriom/AzAuthJS)
et le package peut être installé via [npm](https://www.npmjs.com/) dans votre projet : 
```
npm install azuriom-auth
```

### Utilisation

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


## Utilisation hors Java

L'auth API peut être utilisée dans n'importe quel langage sans utiliser de librairie
spécifique, il suffit juste de faire des requêtes HTTP aux différents points de terminaison (endpoints).

L'ensemble de l'API utilise du JSON et l'URL de base de l'API est `/api/auth`.

Les dates sont retournées au format ISO 8601.

L'API retourne un code 200 en cas de succès, un code 422 en cas de paramètres manquants
ou invalides. En cas d'une autre erreur, le code associé pourra être retourné. 

### Endpoints

#### Authentification

**POST** `/authenticate`

Permet d'authentifier un utilisateur grâce à ses identifiants du site.

##### Requête
| Champ    | Description                                                                                      |
|----------|--------------------------------------------------------------------------------------------------|
| email    | E-Mail (ou pseudo) de l'utilisateur                                                              |
| password | Mot de passe de l'utilisateur                                                                    |
| code     | Code de l'A2F, doit être inclus si le `status` de la réponse est `pending` et `reason` est `2fa` |

##### Réponse

Retourne l'utilisateur avec ses différentes informations ainsi que le jeton (token) unique
qui pourra être utilisé pour vérifier la connexion ou pour la déconnexion.

Exemple de réponse de succès (HTTP `2xx`) :
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

Exemple de réponse d'erreur (HTTP `4xx`) :
```json
{
    "status": "error",
    "reason": "invalid_credentials",
    "message": "Invalid credentials"
}
```

#### Vérification

**POST** `/verify`

##### Requête
| Champ        | Description                           |
|--------------|---------------------------------------|
| access_token | Token d'accès unique de l'utilisateur |

##### Réponse

Retourne l'utilisateur avec ses différentes informations ainsi que le jeton (token) unique
qui pourra être utilisé pour la déconnexion.

Exemple de réponse de succès (HTTP `2xx`) :
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

#### Déconnexion

**POST** `/logout`

Déconnecte l'utilisateur et rend invalide le jeton (token) fourni.

##### Requête
| Champ        | Description                           |
|--------------|---------------------------------------|
| access_token | Token d'accès unique de l'utilisateur |

##### Réponse

En cas de succès, une réponse vide avec un code de statut `2xx` est apportée.
