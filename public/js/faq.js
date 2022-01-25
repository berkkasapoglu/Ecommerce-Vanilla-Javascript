const faqBtnEls = document.querySelectorAll('.faq-btn');
const faqSubEl = document.querySelector('.faq-wrapper');
//Faq Section
faqBtnEls.forEach(faqBtnEl => {
    faqBtnEl.addEventListener('click', (ev) => {
        ev.target.closest('.faq-wrapper').classList.toggle('is-show')
    })
})

// Contact Section
const contactBtnEl = document.querySelector('.contact-buttons')
contactBtnEl.addEventListener('click', (ev) => {
    if(ev.target.nodeName === "BUTTON") {
        const unvisibleBtnEl = document.querySelector('.contact-buttons .is-show');
        unvisibleBtnEl.classList.remove('is-show');
        ev.target.classList.add('is-show');

        const unvisibleEl = document.querySelector('.contact-content-wrapper .is-show')
        unvisibleEl.classList.remove('is-show')
        console.log(unvisibleEl)
        const showDataName = ev.target.dataset.name;
        const showEl = document.querySelector(`.contact-wrapper .${showDataName}`)
        showEl.classList.add('is-show');
    }
})