document.addEventListener('DOMContentLoaded', function () {
    // Miarka punktowa
    const marker = document.getElementById('marker');
    
    // Skala
    const scaleValue = document.getElementById('scale-value');
    
    // Warstwy
    const layer1 = document.getElementById('layer1');
    const layer2 = document.getElementById('layer2');
    // Dodaj więcej warstw według potrzeb

    // Długość w pikselach, którą reprezentuje 1 km na mapie
    const pixelsPerKm = 10;

    // Ustawienia początkowe miarki punktowej
    let markerPosition = { x: 100, y: 100 }; // W pikselach

    // Ustawienia początkowe skali
    let scale = 0;

    // Funkcja do aktualizacji miarki punktowej i skali
    function updateMap() {
        marker.style.left = markerPosition.x + 'px';
        marker.style.top = markerPosition.y + 'px';
        scaleValue.textContent = scale.toFixed(2);
    }

    // Funkcja do obsługi zmiany warstw
    function updateLayers() {
        // Dodaj kod do obsługi warstw
    }

    // Nasłuchuj zmian w warstwach
    layer1.addEventListener('change', updateLayers);
    layer2.addEventListener('change', updateLayers);
    // Dodaj więcej nasłuchiwaczy warstw według potrzeb

    // Wywołaj funkcję aktualizacji przy załadowaniu strony
    updateMap();
    updateLayers();
});
