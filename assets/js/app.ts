import Cookies from 'js-cookie'
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
        domain: window.location.host,
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

const storedTheme = Cookies.get('theme')

function getPreferredTheme() {
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function setCurrentTheme(theme: string) {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}

function showActiveTheme(theme: string) {
  document.querySelectorAll('[data-theme-value]')
    .forEach(el => el.classList.remove('active'))

  document.querySelectorAll(`[data-theme-value="${theme}"]`)
    .forEach(el => el.classList.add('active'))
}

window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => setCurrentTheme(getPreferredTheme()))

window.addEventListener('DOMContentLoaded', () => {
  showActiveTheme(getPreferredTheme())
})

setCurrentTheme(getPreferredTheme())

document.querySelectorAll('a[data-theme-value]')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const theme = element.getAttribute('data-theme-value')

      if (theme) {
        Cookies.set('theme', theme, {
          expires: 30,
          domain: window.location.host,
          sameSite: 'Lax',
          secure: true,
        })
        setCurrentTheme(theme)
        showActiveTheme(theme)
      }
    })
  })
