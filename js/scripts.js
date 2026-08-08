const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    const closeMenu = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isOpen));
        navMenu.classList.toggle('is-open', !isOpen);
        document.body.classList.toggle('menu-open', !isOpen);
    });

    navMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

const carouselTrack = document.querySelector('.carousel-track');
const previousButton = document.querySelector('.carousel-previous');
const nextButton = document.querySelector('.carousel-next');

if (carouselTrack && previousButton && nextButton) {
    const originalCards = Array.from(carouselTrack.querySelectorAll('.experience-card'));

    originalCards.forEach((card) => carouselTrack.append(card.cloneNode(true)));
    [...originalCards].reverse().forEach((card) => carouselTrack.prepend(card.cloneNode(true)));

    const getCardStep = () => {
        const card = carouselTrack.querySelector('.experience-card');
        const gap = parseFloat(getComputedStyle(carouselTrack).columnGap) || 0;
        return card.offsetWidth + gap;
    };

    const jumpTo = (left) => {
        carouselTrack.classList.add('is-jumping');
        carouselTrack.scrollLeft = left;
        carouselTrack.classList.remove('is-jumping');
    };

    const normalizePosition = () => {
        const cardStep = getCardStep();
        const originalSetWidth = cardStep * originalCards.length;
        const originalStart = originalSetWidth;
        const originalEnd = originalStart + originalSetWidth;

        if (carouselTrack.scrollLeft < originalStart - 1) {
            jumpTo(carouselTrack.scrollLeft + originalSetWidth);
        } else if (carouselTrack.scrollLeft >= originalEnd - 1) {
            jumpTo(carouselTrack.scrollLeft - originalSetWidth);
        }
    };

    jumpTo(getCardStep() * originalCards.length);

    const moveCarousel = (direction) => {
        carouselTrack.scrollBy({ left: direction * getCardStep(), behavior: 'smooth' });
    };

    let scrollTimer;
    carouselTrack.addEventListener('scroll', () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(normalizePosition, 120);
    });

    previousButton.addEventListener('click', () => moveCarousel(-1));
    nextButton.addEventListener('click', () => moveCarousel(1));
}

const experienceDialog = document.querySelector('.experience-dialog');

if (experienceDialog) {
    const dialogTitle = experienceDialog.querySelector('#experience-dialog-title');
    const dialogDescription = experienceDialog.querySelector('.experience-dialog-description');
    const closeButton = experienceDialog.querySelector('.dialog-close');

    document.querySelectorAll('.experience-card').forEach((card) => {
        card.addEventListener('click', () => {
            dialogTitle.textContent = card.dataset.title;
            dialogDescription.textContent = card.dataset.details;
            experienceDialog.showModal();
        });
    });

    closeButton.addEventListener('click', () => experienceDialog.close());
    experienceDialog.addEventListener('click', (event) => {
        if (event.target === experienceDialog) experienceDialog.close();
    });
}
