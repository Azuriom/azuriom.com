import Cookies from 'js-cookie'
import Typed from 'typed.js';

window.bootstrap = require('bootstrap');

document.querySelectorAll('.locale-selector [data-locale]').forEach(function (el) {
   el.addEventListener('click', function () {
       Cookies.set('nf_country', el.dataset['locale'], {
           expires: 30,
           domain: 'azuriom.com',
           sameSite: 'Lax',
           secure: true,
       });
   });
});

document.querySelectorAll('.azuriom-last-version').forEach(function (el) {
    fetch('https://api.github.com/repos/Azuriom/Azuriom/releases/latest')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            const version = json['tag_name'].replace('v', '');
            el.innerHTML = `Azuriom v${version}`;
        });
});

document.querySelectorAll('[data-typed]').forEach(function (el) {
    el.innerText = '';

    new Typed(el, {
        strings: el.dataset['typed'].split('|'),
        typeSpeed: 100,
        backSpeed: 25,
        loop: true,
        autoInsertCss: false,
    });
});
