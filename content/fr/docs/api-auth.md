---
title: API Auth
---

# AzAuth

AzAuth est une API permettant d'authentifier les utilisateurs avec Azuriom.
Elle peut être utilisée en Java, en JavaScript, ou tout autre langage capable d'effectuer des requêtes HTTP.

Avant d'utiliser AzAuth, assurez-vous qu'elle est activée dans le panel administrateur (dans **Paramètres → Authentification**).

{{< warn >}}
Quel que soit le mode d'utilisation de l'API côté client, vous devez vérifier le token d'accès côté serveur.
Cela peut être fait en appelant le point d'accès `/verify` ou en utilisant la méthode `verify`.
{{< /warn >}}

## Java

Les sources d'AzAuth Java sont disponibles sur [GitHub](https://github.com/Azuriom/AzAuth),
et le fichier `jar` peut être téléchargé depuis les [releases GitHub](https://github.com/Azuriom/AzAuth/releases).

La méthode recommandée pour utiliser AzAuth dans un projet est d'utiliser un gestionnaire de dépendances comme Maven ou Gradle.

### Installation

Avec Gradle, ajoutez ces lignes dans votre fichier `build.gradle` :

```gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

Avec Maven, ajoutez ces lignes dans votre fichier `pom.xml` :

```xml
<dependencies>
    <dependency>
        <groupId>com.azuriom</groupId>
        <artifactId>azauth</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

### Utilisation

AzAuth est léger et utilise comme seule dépendance [Google Gson](https://github.com/google/gson).

Le point d'entrée de la librairie est la classe `AuthClient`, dont vous pouvez créer une instance en passant l'URL de votre site Azuriom.

Ensuite, vous pouvez utiliser la méthode `login(String username, String password, Supplier<String> codeSupplier)`
Le `codeSupplier` est appelé lorsque l'utilisateur a activé la 2FA, et le code de l'utilisateur doit être renvoyé par ce fournisseur.

Un exemple d'utilisation d'AzAuth dans une application Java :

```java{hl_lines=["2-3", "9-10"]}
public static User auth(String username, String password) throws AuthException {
    // IMPORTANT : Remplacez <url> par l'URL de votre site Azuriom
    AuthClient authenticator = new AuthClient("<url>");

    return authenticator.login(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // IMPORTANT : Remplacez <code_2fa> par le code temporaire de l'utilisateur
            code = "<code_2fa>";
        }

        return code;
    });
}
```

### Utilisation avec OpenLauncherLib

Pour un launcher Minecraft utilisant [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib), la méthode `auth` ressemble généralement de base à ceci :

```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```

Cette méthode peut être remplacée par le code suivant pour utiliser AzAuth à la place du système d'authentification de Mojang :

```java{hl_lines=["2-3", "9-12"]}
public static void auth(String username, String password) throws AuthException {
    // IMPORTANT : Remplacez <url> par l'URL de votre site Azuriom
    AuthClient authenticator = new AuthClient("<url>");

    authInfos = authenticator.login(username, password, () -> {
        String code = null;

        while (code == null || code.isEmpty()) {
            // IMPORTANT : Le composant parent pour la boîte de dialogue.
            // Remplacez le code ci-dessous par une instance de votre frame/panel/etc. de launcher.
            Container parentComponent = LauncherFrame.getInstance().getLauncherPanel();
            parentComponent.setVisible(true);

            code = JOptionPane.showInputDialog(parentComponent, "Entrez votre code 2FA", "2FA", JOptionPane.PLAIN_MESSAGE);
        }

        return code;
    }, AuthInfos.class);
}
```

## JavaScript

### Installation

Le code source est disponible sur [GitHub](https://github.com/Azuriom/AzAuthJS),
et peut être installé via [npm](https://www.npmjs.com/) :

```sh
npm install azuriom-auth
```

### Utilisation

Le point d'entrée est la classe `AuthClient`, dont vous pouvez créer une instance en passant l'URL de votre site Azuriom.
Ensuite, vous pouvez utiliser la méthode `login` pour authentifier un utilisateur.

```js{hl_lines=["4-5", "10-11"]}
import { AuthClient } from 'azuriom-auth'

async function login(email, password) {
    // IMPORTANT : Remplacez <url> par l'URL de votre site Azuriom
    const client = new AuthClient('<url>')
    
    let result = await client.login(email, password)
    
    if (result.status === 'pending' && result.requires2fa) {
        // IMPORTANT : Remplacez <code_2fa> par le code temporaire de l'utilisateur
        const twoFactorCode = '<code_2fa>'
        
        result = await client.login(email, password, twoFactorCode)
    }
    
    if (result.status !== 'success') {
        throw 'Unexpected result: ' + JSON.stringify(result)
    }
    
    return result
}
```

## API HTTP

AzAuth peut être utilisé dans n'importe quel langage, sans utiliser de bibliothèque spécifique,
en effectuant directement des requêtes HTTP vers les points d'accès de l'API.

L'API utilise le format JSON, et le chemin de base est `/api/auth`.

Un code de statut HTTP 200 est renvoyé en cas de succès, et 422 en cas de paramètres manquants ou invalides.
Les dates sont renvoyées au format ISO 8601.

### Points d'accès

#### Authentification

**POST** `/authenticate`

Authentifier un utilisateur avec ses identifiants du site.

##### Requête

| Champ    | Description                                                                                          |
|----------|------------------------------------------------------------------------------------------------------|
| email    | Nom d'utilisateur ou adresse email                                                                   |
| password | Mot de passe                                                                                         |
| code     | Code 2FA, doit être inclus uniquement si la réponse a `status` à `pending` et que `reason` est `2fa` |

##### Réponse

Retourne l'utilisateur avec ses différentes informations ainsi que le jeton (token) unique
pour vérifier la connexion ou pour la déconnexion.

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

| Champ        | Description          |
|--------------|----------------------|
| access_token | Jeton d'accès unique |

##### Réponse

Retourne l'utilisateur avec ses différentes informations ainsi que le jeton (token) unique pour la déconnexion.

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

Exemple de réponse en cas d'erreur (HTTP `4xx`) :

```json
{
"status": "error",
"reason": "invalid_credentials",
"message": "Invalid credentials"
}
```

#### Déconnexion

**POST** `/logout`

Déconnecte l'utilisateur et invalide le jeton d'accès.

##### Requête
| Champ        | Description                           |
|--------------|---------------------------------------|
| access_token | Token d'accès unique de l'utilisateur |

##### Réponse

Réponse vide, avec un code de statut `2xx` en cas de succès.
