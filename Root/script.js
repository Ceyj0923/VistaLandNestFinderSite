// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// FAB Popup Toggle
const fabBtn = document.getElementById('fabBtn');
const fabPopup = document.getElementById('fabPopup');

if (fabBtn && fabPopup) {
    fabBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fabPopup.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        fabPopup.classList.remove('active');
    });

    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            fabPopup.classList.remove('active');
        });
    });
}

// carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

let autoSlide = setInterval(nextSlideAuto, 3000);

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function changeSlide(direction) {
    resetAutoSlide(); //reset the time if click prev or next

    currentSlide += direction;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    showSlide(currentSlide);
}

// auto slide function
function nextSlideAuto() {
    currentSlide++;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

// reset timer when user clicks
function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlideAuto, 3000);
}


// updatedss
function changeImage(card, fromDrag = false) {
    const img = card.querySelector('.unit-img');
    const dots = card.querySelectorAll('.dot');
    const images = JSON.parse(card.querySelector('.unit-images').textContent.trim());

    let currentIndex = parseInt(card.dataset.index);
    currentIndex = (currentIndex + 1) % images.length;
    card.dataset.index = currentIndex;

    img.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
    img.style.transform = 'translateX(-110%) rotate(-6deg)';
    img.style.opacity = '0';

    setTimeout(() => {
        img.src = images[currentIndex];
        img.style.transition = 'none';
        img.style.transform = 'translateX(110%)';
        img.style.opacity = '0';

        img.getBoundingClientRect();

        img.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
        img.style.transform = 'translateX(0)';
        img.style.opacity = '1';
    }, 350);

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

//Update------
let isDragging = false;  // global so onclick can read it

// Auto-build dots based on image count
function initCards() {
    document.querySelectorAll('.unit-card, .map-container').forEach(card => {
        const imagesEl = card.querySelector('.unit-images');
        if (!imagesEl) return;

        const images = JSON.parse(imagesEl.textContent.trim());
        const dotsContainer = card.querySelector('.img-dots');

        if (dotsContainer) {
            dotsContainer.innerHTML = ''; // clear any hardcoded dots
            images.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            });
        }
    });
}

document.querySelectorAll('.unit-card, .map-container').forEach(card => {
    let startX = 0;

    // --- Mouse (desktop) ---
    card.addEventListener('mousedown', e => {
        startX = e.clientX;
        isDragging = false;
    });

    card.addEventListener('mousemove', e => {
        if (e.buttons === 1 && Math.abs(e.clientX - startX) > 8) {
            isDragging = true;
        }
    });

    card.addEventListener('mouseup', e => {
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 40) {
            changeImage(card);
        }
        // Reset isDragging after a short delay so onclick check sees it first
        setTimeout(() => { isDragging = false; }, 10);
    });

    // --- Touch (mobile) ---
    card.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        isDragging = false;
    });

    card.addEventListener('touchmove', e => {
        if (Math.abs(e.touches[0].clientX - startX) > 8) {
            isDragging = true;
        }
    });

    card.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            changeImage(card);
        }
        setTimeout(() => { isDragging = false; }, 10);
    });
});

function changeImage(card) {
    const img = card.querySelector('.unit-img');
    const dots = card.querySelectorAll('.dot');
    const images = JSON.parse(card.querySelector('.unit-images').textContent.trim());

    let currentIndex = parseInt(card.dataset.index);
    currentIndex = (currentIndex + 1) % images.length;
    card.dataset.index = currentIndex;

    // Throw current image out to the left
    img.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
    img.style.transform = 'translateX(-110%) rotate(-6deg)';
    img.style.opacity = '0';

    setTimeout(() => {
        img.src = images[currentIndex];
        img.style.transition = 'none';
        img.style.transform = 'translateX(110%)';
        img.style.opacity = '0';

        img.getBoundingClientRect(); // force reflow

        img.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
        img.style.transform = 'translateX(0)';
        img.style.opacity = '1';
    }, 350);

    // Update dots
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

initCards();