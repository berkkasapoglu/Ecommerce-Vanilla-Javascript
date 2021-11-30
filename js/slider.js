const prevBtn = document.querySelector(".prev"),
    nextBtn = document.querySelector(".next"),
    slider = document.querySelector(".slider"),
    slides = Array.from(document.querySelectorAll(".slide"));

let isDragging = false,
    startPos = 0,
    prevTranslate = 0,
    currentTranslate = 0,
    animationID = 0,
    currentIndex = 0;

const touchStart = (index) => {
    return function (ev) {
        isDragging = true;
        currentIndex = index;
        startPos = getPositionX(ev);
    }
}

const touchEnd = () => {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++;
    else if (movedBy > 100 && currentIndex > 0) currentIndex--;
    setPositionByIndex();
}

const setPositionByIndex = () => {
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
}
const touchMove = (ev) => {
    if (isDragging) {
        const currentPosition = getPositionX(ev);
        currentTranslate = prevTranslate + currentPosition - startPos;
        setSliderPosition();
    }
}

const setSliderPosition = () => {
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

const animation = () => {
    setSliderPosition();
    if (isDragging) animationID = requestAnimationFrame(animation);
}

const getPositionX = (ev) => {
    if (ev.type.includes('touch')) return ev.touches[0].clientX;
    return ev.clientX;
}

slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img');
    slideImage.addEventListener('dragstart', (ev) => ev.preventDefault());

    if (navigator.maxTouchPoints) {
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);
    } else {
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        setPositionByIndex();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        setPositionByIndex();
    }
});

const sliderTimeout = () => {
    setInterval(() => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            setPositionByIndex();
        } else {
            currentIndex = 0;
            setPositionByIndex();
        }
    }, 4000);
}

sliderTimeout();
