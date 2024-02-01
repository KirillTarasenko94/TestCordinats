document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const sizeColorMap = {};
    const coefficientContainer = document.createElement('div');

    function updateLayout() {
        fetch('arrayCordinat.json')
            .then(response => response.json())
            .then(arrayCordinats => {
                container.innerHTML = ''; // Clear the container before updating

                let totalArea = 0; // Total area of the container
                let blocksArea = 0; // Sum of block areas

                for (let i = 0; i < arrayCordinats.length; i++) {
                    const containerOne = document.createElement('div'); // Create a container for each block
                    containerOne.style.width = arrayCordinats[i].width;
                    containerOne.style.height = arrayCordinats[i].height;
                    containerOne.style.position = arrayCordinats[i].position;

                    // Add border radius
                    containerOne.style.border = arrayCordinats[i].border || 'none'; // Set border or default value 'none'

                    if (sizeColorMap[arrayCordinats[i].width + arrayCordinats[i].height]) {
                        containerOne.style.background = sizeColorMap[arrayCordinats[i].width + arrayCordinats[i].height];
                    } else {
                        const color = getRandomColor();
                        sizeColorMap[arrayCordinats[i].width + arrayCordinats[i].height] = color;
                        containerOne.style.background = color;
                    }

                    containerOne.style.top = arrayCordinats[i].top;
                    containerOne.style.left = arrayCordinats[i].left;

                    const numberElement = document.createElement('span');
                    numberElement.textContent = i + 1;
                    numberElement.style.backgroundColor = 'white'; // Set the background color to white

                    Object.assign(numberElement.style, {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black', // Number color
                    });

                    containerOne.appendChild(numberElement);
                    container.appendChild(containerOne);

                    // Calculate block area
                    const blockArea = parseFloat(arrayCordinats[i].width) * parseFloat(arrayCordinats[i].height);
                    blocksArea += blockArea;
                }

                // Calculate total container area
                const containerArea = parseFloat(container.clientWidth) * parseFloat(container.clientHeight);
                totalArea = containerArea;

                // Display the coefficient of space utilization at the top of the page
                const kvp = blocksArea / totalArea;
                coefficientContainer.textContent = 'Coefficient of space utilization: ' + kvp.toFixed(2);
            })
            .catch(error => console.error('Error loading file:', error));
    }

    // Initialize on page load
    updateLayout();

    // Update on window resize
    window.addEventListener('resize', updateLayout);

    function getRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    // Add an element with the coefficient to the top of the document
    document.body.insertBefore(coefficientContainer, document.body.firstChild);
});
