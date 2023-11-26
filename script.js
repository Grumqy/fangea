document.addEventListener('DOMContentLoaded', function () {
    const canvasContainer = document.getElementById('canvas-container');
    const vectorGraphic = document.getElementById('vector-graphic');

    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let scale = 1;

    canvasContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        canvasContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        canvasContainer.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransform();
    });

    canvasContainer.addEventListener('wheel', (e) => {
        // Obsługa przybliżania i oddalania za pomocą kółka myszy
        const wheelDelta = e.deltaY > 0 ? 1.1 : 0.9; // Domyślna wartość

        scale *= wheelDelta;
        applyTransform();
    });

    function applyTransform() {
        // Zastosowanie przekształceń CSS do grafiki wektorowej
        vectorGraphic.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
});
