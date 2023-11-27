document.addEventListener('DOMContentLoaded', function () {
    const map = document.getElementById('map');

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0, prevX, prevY, scale = 1;

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Ignoruj inne przyciski niż lewy
        isDragging = true;
        startX = e.clientX - map.offsetLeft;
        startY = e.clientY - map.offsetTop;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const offsetX = (e.clientX - prevX) / scale;
        const offsetY = (e.clientY - prevY) / scale;

        translateX += offsetX;
        translateY += offsetY;

        map.style.transition = 'none'; // Wyłącz efekt przejścia podczas płynnego poruszania
        map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;

        prevX = e.clientX;
        prevY = e.clientY;
    });

    map.addEventListener('wheel', (e) => {
        const scaleFactor = 1.1;
        const deltaY = e.deltaY;

        if (deltaY < 0) {
            scale *= scaleFactor;
        } else {
            scale /= scaleFactor;
        }

        // Ogranicz przybliżenie i oddalenie
        if (scale > 20) {
            scale = 20;
        } else if (scale < 0.2) {
            scale = 0.2;
        }

        map.style.transition = 'transform 0.2s ease-out'; // Włącz efekt przejścia podczas płynnego scrollowania
        map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;

        e.preventDefault(); // Zapobiega domyślnemu zachowaniu zooma przeglądarki
    });

    document.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.transition = 'transform 0.2s ease-out'; // Dodaj efekt przejścia po odkliknięciu przycisku myszy
            map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    });
});
