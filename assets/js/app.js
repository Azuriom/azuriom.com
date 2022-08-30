import * as bootstrap from 'bootstrap'
import Cookies from 'js-cookie'
import Typed from 'typed.js';

window.bootstrap = bootstrap;

document.querySelectorAll('.locale-selector [data-locale]').forEach((el) => {
   el.addEventListener('click', () => {
       Cookies.set('nf_country', el.dataset['locale'], {
           expires: 30,
           domain: 'azuriom.com',
           sameSite: 'Lax',
           secure: true,
       });
   });
});

document.querySelectorAll('.azuriom-last-version').forEach((el) => {
    fetch('https://api.github.com/repos/Azuriom/Azuriom/releases/latest')
        .then(response => response.json())
        .then(json => {
            el.innerHTML = `Azuriom v${json['tag_name'].replace('v', '')}`;
        });
});

document.querySelectorAll('[data-typed]').forEach((el) => {
    el.innerText = '';

    new Typed(el, {
        strings: el.dataset['typed'].split('|'),
        typeSpeed: 100,
        backSpeed: 25,
        loop: true,
        autoInsertCss: false,
    });
});
