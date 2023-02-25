---
title: Azuriom 1.0
---

# Azuriom 1.0

## Introdução

Azuriom 1.0 é a nova versão principal do Azuriom, contém muitas mudanças e visa manter o Azuriom à prova de futuro.

Esta atualização contém muitas alterações internas, em particular a atualização para Laravel 9 ([Laravel](https://laravel.com/) sendo o PHP framework - a base - usado pela Azuriom) e Bootstrap 5 ([Bootstrap](https://getbootstrap.com/) sendo o CSS framework usado pela Azuriom).

### PHP 8

Em particular, o uso do Laravel 9 significa que **PHP 8 agora é necessário para usar o Azuriom**. Também gostaríamos de observar que **o PHP 7.4 não é mais suportado pelo PHP** desde novembro de 2021 e **não receberá mais atualizações de segurança** a partir de novembro de 2022 (consulte o [site do PHP](https://www.php.net/supported-versions.php)). Por este motivo, recomendamos que atualize os seus sites utilizando PHP (quer utilizem Azuriom ou não) o mais rapidamente possível.

### Extensões

Devido a várias mudanças internas, as extensões (temas e plugins) terão que ser atualizadas para suportar o Azuriom v1.0. Além disso, extensões compatíveis com Azuriom v1.0 não são compatíveis com versões anteriores de Azuriom.

O layout do design básico do CMS e plugins também foi completamente revisado, a fim de simplificar o desenvolvimento de temas, bem como a coerência geral entre os plugins.

### Redesenho do sistema de conexão

O sistema de login para Azuriom para Minecraft também foi redesenhado, para servidores Minecraft: Java Edition que não aceitam versões não oficiais/offline do jogo, bem como para servidores Minecraft: Bedrock Edition, agora é possível fazer login diretamente através de sua conta Microsoft.

Para servidores Minecraft: Java Edition que aceitam versões não oficiais, também é possível automatizar a criação de uma conta no site com AzLink e o plugin [AuthMe reloaded](https://www.spigotmc.org/resources/authmereloaded.6269/).

Esses diferentes novos sistemas simplificam o login no site, eliminando o risco de usuários usarem o nome de usuário errado.

Finalmente, para sites que utilizam a conexão Steam, é possível adicionar um endereço de e-mail para receber determinados alertas por e-mail (por exemplo, quando uma resposta é recebida no plugin de suporte ou quando uma compra é feita na loja). Esse recurso é totalmente opcional.

## Atualizar

A migração está disponível para sites executados em uma versão mais antiga do Azuriom. O site deve estar na versão 0.6.0, então na guia de atualização do painel de administração, você pode atualizar para o Azuriom v1.0!

Antes de atualizar, alguns pontos importantes:
* Faça um backup do seu site (arquivos e banco de dados)
* Certifique-se de que todas as extensões foram atualizadas para v1.0
* Certifique-se de ter o PHP 8.0 ou superior
* Verifique se o site tem as permissões necessárias nos arquivos

Antes de atualizar, é necessário desativar todas as extensões. Estes podem ser reativados assim que a atualização for concluída.

{{< warn >}}
A migração excluirá todos os dados do plugin vote. Os outros plugins não são afetados.
{{< /warn >}}

Quando a atualização estiver concluída, você poderá atualizar suas extensões.

## Adaptando um tema

Como a Azuriom está agora a utilizar o Bootstrap 5, os temas terão de ser adaptados. Recomendamos que você consulte o [guia de migração do Bootstrap 5](https://getbootstrap.com/docs/5.1/migration/).

Uma mudança notável no uso do Bootstrap 5 é que o jQuery não está mais incluído no Azuriom. Também não é recomendado usá-lo.

Além disso, para melhorar a compatibilidade futura, também aconselhamos os temas a modificar o HTML do CMS e os plugins o mínimo possível, mas usar CSS o máximo possível. Isso evita futuros problemas de compatibilidade no caso de uma atualização com modificação do HTML ou quando do HTML ou ao adicionar novos plugins.

{{< warn >}}
Devido a muitos problemas de compatibilidade e temas desatualizados, os temas no mercado serão forçados a respeitar esta regra. É claro que é permitido alterar a página inicial ou o layout, bem como algumas páginas adicionais, mas não será permitido alterar todas as páginas e/ou plugins.
{{< /warn >}}

Por fim, muitas traduções foram aprimoradas e precisarão ser alteradas nos temas.

{{< warn >}}
Para que um tema seja carregado com o Azuriom v1.0, é **obrigatório** adicionar `"azuriom_api": "1.0.0",` no `theme.json`:
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0"
}
```
{{< /warn >}}

### Ícones

FontAwesome 5 foi substituído por [Bootstrap Icons](https://icons.getbootstrap.com), então você precisaria substituir todos os ícones.

Também requer a substituição do FontAwesome CSS pelo do Boostrap:
```diff
- <link href="{{ asset('vendor/fontawesome/css/all.min.css') }}" rel="stylesheet">
+ <link href="{{ asset('vendor/bootstrap-icons/bootstrap-icons.css') }}" rel="stylesheet">
```

### Redes sociais

Azuriom agora tem uma configuração dedicada para adicionar links para redes sociais diretamente das configurações. Se você tiver uma configuração equivalente, é altamente recomendável usar o sistema fornecido pelo CMS. Você pode obter os diferentes links com a função `social_links()` assim:
```html
@foreach(social_links() as $link)
    <a href="{{ $link->value }}" title="{{ $link->title }}" target="_blank" rel="noopener noreferrer" class="btn">
        <i class="{{ $link->icon }} fs-2" style="color: {{ $link->color }}"></i>
    </a>
@endforeach
```

### Servidores na página inicial

Agora é possível exibir servidores na página inicial, o que é especialmente útil para jogos Steam. Os servidores estão disponíveis com a variável `$servers`, que dá por exemplo:
```html
@if(! $servers->isEmpty())
    <h2 class="text-center">
        {{ trans('messages.servers') }}
    </h2>

    <div class="row justify-content-center mb-4">
        @foreach($servers as $server)
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h5>{{ $server->name }}</h5>
    
                        <p>
                            @if($server->isOnline())
                                {{ trans_choice('messages.server.total', $server->getOnlinePlayers(), [
                                    'max' => $server->getMaxPlayers(),
                                ]) }}
                            @else
                                <span class="badge bg-danger text-white">
                                    {{ trans('messages.server.offline') }}
                                </span>
                            @endif
                        </p>
    
                        @if($server->joinUrl())
                            <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
                                {{ trans('messages.server.join') }}
                            </a>
                        @else
                            <p class="card-text">{{ $server->fullAddress() }}</p>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endif
```

### Conectar nos servidores por URL

Uma opção foi adicionada para exibir um link para o servidor em vez do endereço. Isso é especialmente útil para servidores de jogos com suporte para uma URL para conexão direta. Recomendamos substituir todos os usos do endereço do servidor por algo como isto:
```html
@if($server->joinUrl())
    <a href="{{ $server->joinUrl() }}" class="btn btn-primary">
        {{ trans('messages.server.join') }}
    </a>
@else
    {{ $server->fullAddress() }}
@endif
```

## Adaptando um plugin

Uma vez que a Azuriom está agora a utilizar o Bootstrap 5, os plugins terão de ser adaptados. Recomendamos que você consulte o [guia de migração do Bootstrap 5](https://getbootstrap.com/docs/5.1/migration/).

Além disso, Azuriom agora está usando Laravel 9 e PHP 8, aconselhamos que você dê uma olhada no [Guia de migração Laravel 9](https://laravel.com/docs/9.x/upgrade).

Você também pode aproveitar para usar os [novos recursos introduzidos no PHP 8.0](https://www.php.net/releases/8.0/en.php) (mas é 100% opcional).

{{< warn >}}
Para que um plugin seja carregado com o Azuriom v1.0, é **obrigatório** adicionar `"azuriom_api": "1.0.0",` no `plugin.json`:
```json
{
  "authors": [
    "..."
  ],
  "azuriom_api": "1.0.0",
  "providers": [
    "..."
  ]
}
```
{{< /warn >}}

### Ícones

FontAwesome 5 foi substituído por [Bootstrap Icons](https://icons.getbootstrap.com), então você precisaria substituir todos os ícones FontAwesome.

### Provedores de serviço

Agora é necessário especificar explicitamente chamadas para a função `trans` nos métodos `routeDescriptions()`, `userNavigation()` e `adminNavigation()`.

Isso resulta nas seguintes modificações:
```diff
    protected function routeDescriptions()
    {
        return [
-           'shop.home' => 'shop::messages.title',
+           'shop.home' => trans('shop::messages.title'),
        ];
    }

    // ...

    protected function adminNavigation()
    {
            return [
            'shop' => [
-               'name' => 'shop::admin.nav.title',
+               'name' => trans('shop::admin.nav.title'),
                // ...
                'items' => [
-                   'shop.admin.packages.index' => 'shop::admin.nav.packages',
+                   'shop.admin.packages.index' => trans('shop::admin.nav.packages'),
                    // ...
                ],
            ],
        ];
    }

    // ...

    protected function userNavigation()
    {
        return [
            'shop' => [
                'route' => 'shop.profile',
-               'name' => 'shop::messages.profile.payments',
+               'name' => trans('shop::messages.profile.payments'),
            ],
        ];
    }
```

As chamadas para esses métodos agora são preguiçosas, ou seja, o método só será chamado quando necessário.

Finalmente, os métodos obsoletos em versões mais antigas do Azuriom foram todos removidos.
