document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('map-container');
    const map = document.getElementById('map');

    let isDragging = false;
    let startDrag = { x: 0, y: 0 };
    let startTransform = { x: 0, y: 0 };
    let scale = 1;

    mapContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        map.style.cursor = 'grabbing';
        startDrag = { x: e.clientX, y: e.clientY };
        startTransform = { x: currentTranslate.x, y: currentTranslate.y };
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startDrag.x;
            const deltaY = e.clientY - startDrag.y;

            currentTranslate.x = startTransform.x + deltaX / scale;
            currentTranslate.y = startTransform.y + deltaY / scale;

            updateMapTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.cursor = 'grab';
        }
    });

    mapContainer.addEventListener('wheel', (e) => {
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const offsetX = e.clientX - mapContainer.getBoundingClientRect().left;
        const offsetY = e.clientY - mapContainer.getBoundingClientRect().top;

        scale *= scaleFactor;

        currentTranslate.x = offsetX - (offsetX - currentTranslate.x) * scaleFactor;
        currentTranslate.y = offsetY - (offsetY - currentTranslate.y) * scaleFactor;

        updateMapTransform();
    });

    function updateMapTransform() {
        map.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }

    mapContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) {
            const rect = map.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            const scaleRatio = scale - 1; // Ustalamy stosunek przybliżenia

            const scaledOffsetX = offsetX * scaleRatio;
            const scaledOffsetY = offsetY * scaleRatio;

            currentTranslate.x -= scaledOffsetX / scale;
            currentTranslate.y -= scaledOffsetY / scale;

            updateMapTransform();
        }
    });
});
