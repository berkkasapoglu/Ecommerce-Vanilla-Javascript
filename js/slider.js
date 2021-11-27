const prevBtn = document.querySelector(".prev")
const nextBtn = document.querySelector(".next")
const slides = document.querySelectorAll(".slide");

let slideIndex = 0;
slides[slideIndex].style.display = 'flex';
const showSlides = (n) => {
    
    if(n>0) {
        slides[slideIndex].style.display = 'none';
        slideIndex++;
        if(slideIndex + 1 > slides.length) slideIndex = 0;
        slides[slideIndex].style.display = 'flex';
    }
    else {
        slides[slideIndex].style.display = 'none';
        slideIndex--;
        if(slideIndex < 0) slideIndex = slides.length - 1;
        slides[slideIndex].style.display = 'flex';
    }

}

nextBtn.addEventListener('click', () => showSlides(1));
prevBtn.addEventListener('click', () => showSlides(-1));

[a,b,c]