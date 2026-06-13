import properties from './data.js';

class RealEstateApp {
    constructor() {
        this.properties = properties;
        this.filteredProperties = properties;
        this.map = null;
        this.markers = [];

        this.gridContainer = document.getElementById('property-grid');
        this.typeFilter = document.getElementById('type');
        this.priceFilter = document.getElementById('price');
        this.bedroomsFilter = document.getElementById('bedrooms');

        this.init();
    }

    init() {
        this.initMap();
        this.renderProperties();
        this.addEventListeners();
    }

    initMap() {
        // Initialize map centered on a general luxury location (e.g., Beverly Hills area)
        this.map = L.map('map').setView([34.0736, -118.4004], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.updateMapMarkers();
    }

    renderProperties() {
        this.gridContainer.innerHTML = '';

        if (this.filteredProperties.length === 0) {
            this.gridContainer.innerHTML = '<p class="no-results">No properties match your criteria.</p>';
            return;
        }

        this.filteredProperties.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.innerHTML = `
                <div class="property-image">
                    <img src="${prop.image}" alt="${prop.title}">
                </div>
                <div class="property-info">
                    <span class="property-type">${prop.type}</span>
                    <h3 class="property-title">${prop.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i> ${prop.location}
                    </div>
                    <div class="property-details">
                        <div class="detail"><i class="fas fa-bed"></i> ${prop.bedrooms} Beds</div>
                        <div class="detail"><i class="fas fa-bath"></i> ${prop.bathrooms} Baths</div>
                        <div class="detail"><i class="fas fa-expand"></i> ${prop.area} sqft</div>
                    </div>
                    <span class="property-price">$${prop.price.toLocaleString()}</span>
                </div>
            `;
            this.gridContainer.appendChild(card);
        });
    }

    updateMapMarkers() {
        // Clear existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        const goldIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#c5a059; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        this.filteredProperties.forEach(prop => {
            const marker = L.marker(prop.coords, { icon: goldIcon })
                .bindPopup(`<b>${prop.title}</b><br>$${prop.price.toLocaleString()}`)
                .addTo(this.map);
            this.markers.push(marker);
        });

        // Fit map bounds to markers if any exist
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    addEventListeners() {
        const handleFilter = () => {
            const typeValue = this.typeFilter.value;
            const priceValue = this.priceFilter.value;
            const bedsValue = this.bedroomsFilter.value;

            this.filteredProperties = this.properties.filter(prop => {
                const matchesType = typeValue === 'all' || prop.type === typeValue;
                const matchesPrice = priceValue === 'all' || prop.price <= parseInt(priceValue);
                const matchesBeds = bedsValue === 'all' || prop.bedrooms >= parseInt(bedsValue);

                return matchesType && matchesPrice && matchesBeds;
            });

            this.renderProperties();
            this.updateMapMarkers();
        };

        this.typeFilter.addEventListener('change', handleFilter);
        this.priceFilter.addEventListener('change', handleFilter);
        this.bedroomsFilter.addEventListener('change', handleFilter);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RealEstateApp();
});
