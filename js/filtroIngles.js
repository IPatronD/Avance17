document.addEventListener('DOMContentLoaded', function () {
    const DOM = {
        filtersSection: document.querySelector('.filtros'),
        clearButton: document.getElementById('limpiar-filtros'),
        selects: document.querySelectorAll('.filtros select'),
        cards: document.querySelectorAll('.card-container'),
        counter: document.createElement('div'),
        resultsTitle: document.createElement('h3')
    };

    DOM.counter.className = 'contador-resultados';
    DOM.resultsTitle.textContent = 'Search Results';
    DOM.resultsTitle.className = 'resultados-title';

    const filtersContainer = document.querySelector('.filtros-container');
    filtersContainer.parentNode.insertBefore(DOM.resultsTitle, filtersContainer.nextSibling);
    filtersContainer.parentNode.insertBefore(DOM.counter, DOM.resultsTitle.nextSibling);

    const filters = {
        tipo: 'todos',
        tamano: 'todos',
        edad: 'todos',
        sexo: 'todos',
        ninos: 'todos',
        'otros-animales': 'todos'
    };

    init();

    function init() {
        setupEventListeners();
        showInitialTotal();
    }

    function setupEventListeners() {
        DOM.selects.forEach(select => {
            select.addEventListener('change', function () {
                filters[this.id] = this.value;
                applyFilters();
            });
        });

        DOM.clearButton.addEventListener('click', clearFilters);
    }

    function applyFilters() {
        let visibleCount = 0;
        let filteredTypes = new Set();
        let filteredSizes = new Set();

        DOM.cards.forEach(card => {
            const data = card.dataset;

            const matches =
                (filters.tipo === 'todos' || data.tipo === filters.tipo) &&
                (filters.tamano === 'todos' || data.tamano === filters.tamano) &&
                (filters.edad === 'todos' || data.edad === filters.edad) &&
                (filters.sexo === 'todos' || data.sexo === filters.sexo) &&
                (filters.ninos === 'todos' || data.ninos === filters.ninos) &&
                (filters['otros-animales'] === 'todos' || data['otrosAnimales'] === filters['otros-animales']);

            card.style.display = matches ? 'block' : 'none';

            if (matches) {
                visibleCount++;
                filteredTypes.add(data.tipo);
                filteredSizes.add(data.tamano);
            }
        });

        updateCounter(visibleCount, filteredTypes, filteredSizes);
    }

    function clearFilters() {
        Object.keys(filters).forEach(key => {
            filters[key] = 'todos';
            const select = document.getElementById(key);
            if (select) select.value = 'todos';
        });

        DOM.cards.forEach(card => card.style.display = 'block');
        showInitialTotal();
    }

    function showInitialTotal() {
        const total = DOM.cards.length;
        DOM.counter.innerHTML = `
            <div class="contador-header">
                <span class="contador-icon">🐾</span>
                <span class="contador-total">${total} pets waiting for a home</span>
            </div>
            <div class="contador-subtext">
                Use the filters to find your ideal companion
            </div>
        `;
    }

    function updateCounter(visible, types, sizes) {
        const total = DOM.cards.length;
        const typeStr = [...types].map(t => t === 'dog' ? 'dogs' : 'cats').join(' and ');
        const sizeStr = [...sizes].map(s => {
            switch (s) {
                case 'small': return 'small';
                case 'medium': return 'medium';
                case 'large': return 'large';
                default: return s;
            }
        }).join(' and ');

        DOM.counter.innerHTML = `
            <div class="contador-header">
                <span class="contador-icon">${visible === 0 ? '😿' : '🐶'}</span>
                <span class="contador-total">${visible} ${visible === 1 ? 'pet found' : 'pets found'}</span>
            </div>
            ${visible > 0 ? `
                <div class="counter-details">
                    <p>Showing ${typeStr}${sizes.size > 0 ? ` of ${sizeStr} size` : ''}</p>
                    <p class="counter-subtext">(from ${total} total pets)</p>
                </div>
            ` : `
                <div class="counter-empty">
                    <p>No pets match your criteria</p>
                    <p class="counter-suggestion">Try adjusting the filters</p>
                </div>
            `}
        `;
    }
});
