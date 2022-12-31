---
title: API Аутентифікації
---

# AzAuth

AzAuth — це API, який дозволяє автентифікувати користувачів веб-сайту під Azuriom на будь-якій платформі.

{{< warn >}}
Незалежно від того, як ви використовуєте client-side auth api, ви повинні перевірити на
сервері, що маркер доступу, повернутий клієнтом, є дійсним, використовуючи
метод `verify`.
{{< /warn >}}

## Download

Джерела AzAuth доступні на [GitHub](https://github.com/Azuriom/AzAuth)
і можна завантажити jar-файл [тут](https://repo.maven.apache.org/maven2/com/azuriom/azauth/1.0.0/azauth-1.0.0.jar).

Якщо ви використовуєте менеджер залежностей, ви можете додати AzAuth як
залежність наступним чином:

### Gradle

У `build.gradle`:

```groovy
repositories {
    mavenCentral()
} 

dependencies {
    implementation 'com.azuriom:azauth:1.0.0'
}
```

### Maven

У `pom.xml`:
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

## Використання AzAuth (Java)

Перед використанням AzAuth, будь ласка, переконайтеся, що API активовано, перейшовши за посиланням
в налаштуваннях вашого сайту, в адмін-панелі.

### Використання без OpenLauncherLib

AzAuth був розроблений з [Gson](https://github.com/google/gson) в якості єдиної залежності, так що ви можете використовувати його абсолютно нормально, якщо ви не використовуєте
OpenLauncherLib, ви можете просто використовувати `AuthClient#authenticate(String username, String password, Supplier<String> codeSupplier)` і це дасть вам
дасть вам безпосередньо `User`, що містить ім'я користувача, uuid, ранг, токен доступу та багато інших корисних даних. `СodeSupplier`
викликається, коли користувач увімкнув 2FA, і код користувача повинен бути повернутий постачальнику.

### Використання з [OpenLauncherLib](https://github.com/Litarvan/OpenLauncherLib/) _(для лаунчера minecraft)_.

Для початку додайте AzAuth як залежність до вашого проекту.
Також, якщо ви використовуєте [OpenAuth] (https://github.com/Litarvan/OpenAuth/), рекомендується видалити його,
хоча він і не викликає ніяких реальних проблем, але більше не використовується, якщо ви використовуєте AzAuth.

У коді вашого лаунчера повинен бути метод `auth`, подібний до наведеного нижче коду:
```java
public static void auth(String username, String password) throws AuthenticationException {
    Authenticator authenticator = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS);
    AuthResponse response = authenticator.authenticate(AuthAgent.MINECRAFT, username, password, "");
    authInfos = new AuthInfos(response.getSelectedProfile().getName(), response.getAccessToken(), response.getSelectedProfile().getId());
}
```

Вам просто потрібно замінити його кодом нижче, щоб змінити `<url>` на URL-адресу кореня вашого веб-сайту Azuriom.
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

## Використання з JavaScript

### Встановлення

Вихідний код доступний на [GitHub](https://github.com/Azuriom/AzAuthJS)
а встановити пакет можна за допомогою [npm](https://www.npmjs.com/):
```
npm install azuriom-auth
```

### Приклад

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


### Кінцеві точки

#### Аутентифікація

**POST** `/authenticate`

Аутентифікація користувача за допомогою його облікових даних на сайті

##### Запит
| Поле     | Опис                                                                                                         |
|----------|--------------------------------------------------------------------------------------------------------------|
| email    | Ім'я користувача або адреса електронної пошти                                                                |
| password | Пароль                                                                                                       |
| code     | код 2FA, повинен бути включений тільки в тому випадку, якщо `статус` відповіді `очікує` і `причина` - `2fa`. |

##### Відповідь

Повертає користувачеві його різноманітну інформацію, а також унікальний токен
який може бути використаний для підтвердження з'єднання або для роз'єднання.

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

#### Верифікація

**POST** `/verify`

##### Request
| Поле         | Опис                     |
|--------------|--------------------------|
| access_token | Унікальний токен доступу |

##### Відповідь

Повертає користувачеві його різноманітну інформацію, а також унікальний токен
який може бути використаний для підтвердження з'єднання або для роз'єднання.

Приклад успішного реагування (HTTP `2xx`):
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

Приклад реагування на помилку (HTTP `4xx`):
```json
{
    "status": "error",
    "reason": "invalid_credentials",
    "message": "Invalid credentials"
}
```

#### Вихід з системи

**POST** `/logout`

Вихід користувача з системи та анулювання токена доступу.

##### Request
| Поле         | Опис                     |
|--------------|--------------------------|
| access_token | Унікальний токен доступу |

##### Відповідь

Порожня відповідь, з кодом статусу `2xx`.
