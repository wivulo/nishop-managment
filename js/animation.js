export function moveElementToRight(element, distance, duration) {
    const start = performance.now();
    const elementStartPosition = element.offsetLeft;

    function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPosition = elementStartPosition + (distance * progress);

        element.style.left = newPosition + 'px';

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Usage example
// const element = document.getElementById('myElement');
// moveElementToRight(element, 200, 1000); // Move the element 200 pixels to the right in 1 second