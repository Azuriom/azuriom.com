---
title: Auth API
---

# AzAuth

AzAuth é uma API que permite autenticar usuários de um site da Azuriom em qualquer plataforma.

{{< warn >}}
Independentemente de como você usa a API de autenticação do lado do cliente, você deve verificar no servidor se o token de acesso retornado pelo cliente é válido usando o método `verify`.
{{< /warn >}}

## Download

O código fonte do AzAuth estão disponíveis no [GitHub](https://github.com/Azuriom/AzAuth) e o arquivo jar pode ser baixado [aqui](https://repo.maven.apache.org/maven2/com/azuriom/azauth/1.0.0/azauth-1.0.0.jar).

Se você estiver usando um gerenciador de dependências, poderá adicionar o AzAuth como uma dependência da seguinte maneira:

### Gradle

No `build.gradle`:

```groovy
repositories {
    mavenCentral()
} 

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

No `pom.xml`:
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

## AzAuth usage (Java)

Antes de usar o AzAuth, verifique se a API está ativada acessando as configurações do seu site, no painel de administração.

### Uso sem OpenLauncherLib

AzAuth foi projetado com [Gson](https://github.com/google/gson) como sua única dependência, então você pode usá-lo perfeitamente bem se você não usar OpenLauncherLib, você pode simplesmente usar `AuthClient#authenticate(String username, String password, Supplier<String> codeSupplier)` e isso lhe dará diretamente um `User` contendo um username, uuid, rank, access token e muitos outros dados úteis. O `codeSupplier` é chamado quando o usuário possui 2FA habilitado, e o código do usuário deve ser devolvido ao fornecedor.

### Usando com [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(para minecraft launcher)_

Para começar, adicione o AzAuth como uma dependência ao seu projeto. Além disso, se você estiver usando [OpenAuth](https://github.com/Litarvan/OpenAuth/), é recomendável removê-lo, embora não cause nenhum problema real, não é mais usado se você usar o AzAuth.

Você deve ter no código do seu launcher um método `auth` similar ao código abaixo:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```

Basta substituí-lo pelo código abaixo, para modificar `<url>` pela URL do root do seu site Azuriom.
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

## Uso com JavaScript

### Instalação

O código fonte está disponível no [GitHub](https://github.com/Azuriom/AzAuthJS) e o pacote pode ser instalado com [npm](https://www.npmjs.com/):
```
npm install azuriom-auth
```

### Exemplo

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


### Endpoints

#### Authentification

**POST** `/authenticate`

Autenticar um usuário com as credenciais do site

##### Request
| Field    | Description                                                                                       |
|----------|---------------------------------------------------------------------------------------------------|
| email    | Username or e-mail address                                                                        |
| password | Password                                                                                          |
| code     | 2FA code, should be included only if the response `status` is `pending` and the `reason` is `2fa` |

##### Response

Retorna o usuário com suas diversas informações, e o token único que pode ser usado para verificar a conexão ou desconectar.

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
| Field        | Description         |
|--------------|---------------------|
| access_token | Unique access token |

##### Response

Retorna o usuário com suas diversas informações, e o token único que pode ser usado para verificar a conexão ou desconectar.

Exemplo de response de sucesso (HTTP `2xx`):
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

Exemplo de response de erro (HTTP `4xx`):
```json
{
    "status": "error",
    "reason": "invalid_credentials",
    "message": "Invalid credentials"
}
```

#### Logout

**POST** `/logout`

Faça logout do usuário e invalide o token de acesso.

##### Request
| Field        | Description         |
|--------------|---------------------|
| access_token | Unique access token |

##### Response

Response vazia, com código de status `2xx`.
