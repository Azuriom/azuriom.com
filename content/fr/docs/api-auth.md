---
title: API Auth
---

# AzAuth

AzAuth est une api qui permet d'authentifier les utilisateurs d'un site sous Azuriom sur n'importe quelle plateforme
(par exemple un launcher Minecraft personnalisé).

## Téléchargement

Les sources d'AzAuth sont disponibles sur [GitHub](https://github.com/Azuriom/AzAuth)
et le jar peut être téléchargé [ici](https://azuriom.s3.fr-par.scw.cloud/azauth-1.0-SNAPSHOT.jar).

Si vous utilisez un gestionnaire de dépendances, vous pouvez ajouter AzAuth comme
dépendance de la façon suivante :

### Gradle

Dans le `build.gradle`:
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

Dans le `pom.xml`:
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
Quelle que soit la façon dont vous utilisez l'auth api coté client, vous
devez impérativement vérifier coté serveur que le token d'accès renvoyé par le client
est bien valide en utilisant la méthode `verify`.
{{< /warn >}}

## Utilisation de AzAuth (Java)

Avant d'utiliser AzAuth, veuillez vérifier que l'api est bien activée en allant
dans les réglages de votre site, sur votre panel admin.

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
public static void auth(String username, String password) throws AuthenticationException, IOException {
    AzAuthenticator authenticator = new AzAuthenticator("<url>");
    authInfos = authenticator.authenticate(username, password, AuthInfos.class);
}
```
Une fois ceci fait, il suffit d'importer les classes `AzAuthenticator` et
`AuthenticationException` qui sont dans le package `com.azuriom.auth` et AzAuth sera
intégré à votre launcher.

Les catch d'une `AuthenticationException` doivent également être adaptés,
et les usages de `e.getErrorModel().getErrorMessage()` peuvent être simplement 
remplacés par `e.getMessage()`.

### Utilisation sans OpenLauncherLib

AzAuth a été conçu avec comme seule dépendance [Gson](https://github.com/google/gson), vous pouvez donc parfaitement l'utiliser si vous n'utilisez pas
OpenLauncherLib, vous pouvez simplement utiliser `AzAuthenticator#authenticate(String username, String password)` et cela va
vous donner directement un `User` contenant le pseudo, l'uuid, le grade, l'access token et pleins d'autres données utiles.

## Utilisation de AzAuth (NodeJs)

### Installation

Les sources d'AzAuth JS sont disponibles sur [GitHub](https://github.com/Azuriom/AzAuthJs)
et le package peut être installé via npm dans votre projet : `npm install azuriom-auth`.

### Utilisation

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


## Utilisation hors Java

L'auth API peut être utilisée dans n'importe quel language sans utiliser de librairie
spécifique, il suffit juste de faire des requêtes HTTP aux différents endpoints.

L'ensemble de l'API utilise du JSON et l'URL de base de l'API est `/api/auth`.

Les dates sont retournées au format ISO 8601.

L'API retourne un code 200 en cas de succès, un code 422 en cas de paramètres manquants
ou invalides. En cas d'une autre erreur, le code associé pourra être retourné. 

### Endpoints

#### Authentification

**POST** `/authenticate`

Permet d'authentifier un utilisateur grâce à ses identifiants du site.

##### Requête
|   Field   |            Description            |
| --------- | --------------------------------- |
|   email   | E-Mail ou Pseudo de l'utilisateur |
| password  |   Mot de passe de l'utilisateur   |

##### Réponse

Retourne l'utilisateur avec ses différentes informations ainsi que le token unique
qui pourra être utilisé pour vérifier la connexion ou pour la déconnexion.

Exemple de réponse :
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

#### Vérification

**POST** `/verify`

##### Requête
|     Field    |               Description              |
| ------------ | -------------------------------------- |
| access_token | Token d'accès unique de l'utilisateur |

##### Réponse

Retourne l'utilisateur avec ses différentes informations ainsi que le token unique
qui pourra être utilisé pour la déconnexion.

Exemple de réponse :
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

Déconnecte l'utilisateur et rend invalide le token donné.

##### Requête
|     Field    |               Description              |
| ------------ | -------------------------------------- |
| access_token | Token d'acccès unique de l'utilisateur |

##### Réponse

En cas de succès réponse vide, avec un code `2xx`.
