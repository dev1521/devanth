const iconToggle = document.querySelector('.toggle_icon');
const navbarMenu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menulink');
const iconClose = document.querySelector('.close_icon');

iconToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
});

iconClose.addEventListener('click', () => {
    navbarMenu.classList.remove('active');
});

menuLinks.forEach((menuLinks) => {
    menuLinks.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    })
})

// Change background header
function scrollHeader() {
    const header = document.getElementById('header');
    this.scrollY >= 20 ? header.classList.add('active') : header.classList.remove('active');
}

window.addEventListener('scroll', scrollHeader);

/* HERO TYPE EFFECT */

const typed = document.querySelector('.typed');

if(typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typespeed: 60,
        backspeed: 60,
        backdelay:1000
    } );
}

/*services*/
let modalBtns = document.querySelectorAll('.services_button'),
    modalViews = document.querySelectorAll(".services_modal"),
    modalClose = document.querySelectorAll('.modal_close-icon');

let modal = function(modalClick) {
    modalViews[modalClick].classList.add('active-modal');
}

modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener('click', () => {
         modal(i)
    })
})

modalClose.forEach(el => {
    el.addEventListener('click', () => {
        modalViews.forEach(modalview => {
            modalview.classList.remove('active-modal')
        })
    })
})
