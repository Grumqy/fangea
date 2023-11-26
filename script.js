document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('map-container');
    const map = document.getElementById('map');

    let isDragging = false;
    let startPosition = { x: 0, y: 0 };
    let currentTranslate = { x: 0, y: 0 };
    let scale = 1;

    mapContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startPosition.x;
            const deltaY = e.clientY - startPosition.y;

            currentTranslate.x += deltaX;
            currentTranslate.y += deltaY;

            updateMapTransform();

            startPosition = { x: e.clientX, y: e.clientY };
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    mapContainer.addEventListener('wheel', (e) => {
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;

        scale *= scaleFactor;

        updateMapTransform();
    });

    function updateMapTransform() {
        map.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }
});
