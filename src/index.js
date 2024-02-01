document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const sizeColorMap = {};
    const coefficientContainer = createCoefficientContainer(); // Function to create a container for displaying the coefficient

    function updateLayout() {
        fetch('arrayCordinat.json')
            .then(response => response.json())
            .then(arrayCordinats => {
                clearContainer(); // Clear the container before updating

                let totalArea = 0; // Total area of the container
                let blocksArea = 0; // Sum of block areas
                const placedBlocks = []; // Array to keep track of placed blocks

                for (let i = 0; i < arrayCordinats.length; i++) {
                    const block = arrayCordinats[i];
                    const position = findPosition(block, placedBlocks); // Find a suitable position for the block

                    const containerOne = createBlockContainer(block, position, i + 1); // Create a container for each block
                    container.appendChild(containerOne);
                    placedBlocks.push(getBlockDimensions(position, block)); // Update the array with the new block dimensions

                    const blockArea = getBlockArea(block);
                    blocksArea += blockArea;
                }

                totalArea = getContainerArea();

                const kvp = blocksArea / totalArea;
                displayCoefficient(kvp);
            })
            .catch(error => console.error('Error loading file:', error));
    }

    updateLayout();

    window.addEventListener('resize', updateLayout);

    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function createCoefficientContainer() {
        const container = document.createElement('div');
        document.body.insertBefore(container, document.body.firstChild);
        return container;
    }

    function clearContainer() {
        container.innerHTML = '';
    }

    function createBlockContainer(block, position, index) {
        const containerOne = document.createElement('div');
        containerOne.style.width = block.width;
        containerOne.style.height = block.height;
        containerOne.style.position = 'absolute';
        containerOne.style.top = position.top;
        containerOne.style.left = position.left;
        containerOne.style.border = block.border || 'none'; // Set border or default value 'none'
        containerOne.style.background = getBlockBackground(block); // Get background color for the block

        const numberElement = document.createElement('span');
        numberElement.textContent = index;
        setNumberElementStyles(numberElement);

        containerOne.appendChild(numberElement);
        return containerOne;
    }

    function getBlockBackground(block) {
        const key = block.width + block.height;
        return sizeColorMap[key] || (sizeColorMap[key] = getRandomColor());
    }

    function setNumberElementStyles(numberElement) {
        Object.assign(numberElement.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black',
            backgroundColor: 'white',
        });
    }

    function findPosition(block, placedBlocks) {
        const padding = 5;
        let top = block.top ? parseFloat(block.top) : 0;
        let left = block.left ? parseFloat(block.left) : 0;

        while (isOverlapping(top, left, block, placedBlocks)) {
            left += parseFloat(block.width) + padding;
            if (left + parseFloat(block.width) > container.clientWidth) {
                left = 0;
                top += parseFloat(block.height) + padding;
            }
        }

        return { top: top + 'px', left: left + 'px' };
    }

    function isOverlapping(top, left, block, placedBlocks) {
        for (const placedBlock of placedBlocks) {
            if (
                top + parseFloat(block.height) > placedBlock.top &&
                top < placedBlock.top + placedBlock.height &&
                left + parseFloat(block.width) > placedBlock.left &&
                left < placedBlock.left + placedBlock.width
            ) {
                return true;
            }
        }

        return false;
    }

    function getBlockArea(block) {
        return parseFloat(block.width) * parseFloat(block.height);
    }

    function getBlockDimensions(position, block) {
        return {
            top: parseFloat(position.top),
            left: parseFloat(position.left),
            width: parseFloat(block.width),
            height: parseFloat(block.height),
        };
    }

    function getContainerArea() {
        return parseFloat(container.clientWidth) * parseFloat(container.clientHeight);
    }

    function displayCoefficient(kvp) {
        coefficientContainer.textContent = 'Coefficient of space utilization: ' + kvp.toFixed(2);
    }
});
