import * as Cookies from 'js-cookie'
import Typed from 'typed.js'

import 'bootstrap'

document.querySelectorAll<HTMLElement>('.locale-selector [data-locale]')
    .forEach((element) => {
        element.addEventListener('click', () => {
            const locale = element.dataset.locale;
            if (!locale) {
                return
            }

            Cookies.set('nf_country', locale, {
                expires: 30,
                domain: 'azuriom.com',
                sameSite: 'Lax',
                secure: true,
            })
        })
    })

document.querySelectorAll<HTMLElement>('[data-typed]')
    .forEach((element) => {
        const data = element.dataset.typed
        if (!data) {
            return
        }

        element.innerText = ''

        new Typed(element, {
            strings: data.split('|'),
            typeSpeed: 100,
            backSpeed: 25,
            loop: true,
            autoInsertCss: false,
        })
    })

document.querySelectorAll('.azuriom-last-version')
    .forEach((element) => {
        fetch('https://api.github.com/repos/Azuriom/Azuriom/releases/latest')
            .then((response) => response.json())
            .then((json) => {
                const version = json['tag_name'].replace('v', '')

                element.innerHTML = `Azuriom v${version}`
            })
    })
