document.addEventListener('DOMContentLoaded', function () {
    const map = document.getElementById('map');

    map.draggable = false;

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0, prevX, prevY, scale = 1;
    const sensitivity = 1.5; // Zmniejszona czułość

    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || e.target !== map) return;

        isDragging = true;
        startX = e.clientX - map.offsetLeft;
        startY = e.clientY - map.offsetTop;
        prevX = e.clientX;
        prevY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.transition = 'transform 0.2s ease-out';
            map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        if (e.buttons !== 1 || e.target !== map) {
            isDragging = false;
            return;
        }

        const offsetX = (e.clientX - prevX) / scale * sensitivity;
        const offsetY = (e.clientY - prevY) / scale * sensitivity;

        translateX += offsetX;
        translateY += offsetY;

        map.style.transition = 'none';
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

        // Ogranicz maksymalne i minimalne przybliżenie
        if (scale > 120) {
            scale = 120;
        } else if (scale < 0.2) {
            scale = 0.2;
        }

        map.style.transition = 'transform 0.2s ease-out';
        map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;

        e.preventDefault();
    });

    document.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    map.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});
