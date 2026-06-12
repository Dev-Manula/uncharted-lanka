// 1. දත්ත (Data)
const destinations = [
    {
        id: 1,
        name: "Sigiriya Rock Fortress",
        district: "matale",
        category: "ancient",
        image: "images/sigiriya.jpg", 
        description: "Sigiriya or Sinhagiri is an ancient rock fortress located in the northern Matale District near the town of Dambulla in the Central Province, Sri Lanka. It is a site of historical and archaeological significance.",
        map: "https://www.google.com/maps/search/Sigiriya"
    },
    {
        id: 2,
        name: "Nine Arch Bridge",
        district: "badulla",
        category: "hiking",
        image: "images/ninearch.jpg",
        description: "The Nine Arch Bridge in Ella is one of the best examples of colonial-era railway construction in the country. It is a paradise for hikers and photographers.",
        map: "https://www.google.com/maps/search/Nine+Arch+Bridge"
    },
    {
        id: 3,
        name: "Mirissa Beach",
        district: "matara",
        category: "beaches",
        image: "images/mirissabeach.jpg",
        description: "Mirissa is one of the main beach destinations in southern Sri Lanka. The area is famous for its beautiful sunsets and whale watching tours.",
        map: "https://www.google.com/maps/search/Mirissa+Beach"
    },
    {
        id: 4,
        name: "Diyaluma Falls",
        district: "badulla",
        category: "waterfalls",
        image: "images/diyalumafalls.jpg",
        description: "Diyaluma Falls is 220 m high and the second highest waterfall in Sri Lanka. It offers several natural pools at the top with an incredible view.",
        map: "https://www.google.com/maps/search/Diyaluma+Falls"
    }
];

// 2. Elements හඳුනා ගැනීම
const container = document.getElementById('destinationsContainer');
const modal = document.getElementById('destinationModal');
const closeModal = document.querySelector('.close-modal');

// 3. Cards පෙන්වන Function
function displayDestinations(items) {
    container.innerHTML = ""; 
    if (items.length === 0) {
        container.innerHTML = `<div class="no-results"><p>Oops! No destinations found.</p></div>`;
        return;
    }

    items.forEach(item => {
        const card = `
            <div class="destination-card fade-in">
                <div class="card-img">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="category-tag">${item.category}</span>
                </div>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p class="district">📍 ${item.district}</p>
                    <p class="desc">${item.description}</p>
                    <button class="btn-explore" onclick="openDetails(${item.id})">Explore More</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 4. Modal විවෘත කිරීම
function openDetails(id) {
    const selected = destinations.find(dest => dest.id === id);
    if (selected) {
        document.getElementById('modalImg').src = selected.image;
        document.getElementById('modalTitle').innerText = selected.name;
        document.getElementById('modalDistrict').innerText = `📍 ${selected.district}`;
        document.getElementById('modalDesc').innerText = selected.description;
        document.getElementById('mapLink').href = selected.map;

        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

// 5. Modal වැසීම (Safe check එකක් සමඟ)
if (closeModal) {
    closeModal.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// 6. Filtering Logic
const searchInput = document.getElementById('searchInput');
const districtFilter = document.getElementById('districtFilter');
const categoryButtons = document.querySelectorAll('.cat-btn');

let activeCategory = 'all';

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        filterDestinations(e.target.value.toLowerCase(), districtFilter.value, activeCategory);
    });
}

if (districtFilter) {
    districtFilter.addEventListener('change', (e) => {
        filterDestinations(searchInput.value.toLowerCase(), e.target.value, activeCategory);
    });
}

categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        filterDestinations(searchInput.value.toLowerCase(), districtFilter.value, activeCategory);
    });
});

function filterDestinations(search, district, category) {
    const filtered = destinations.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search);
        const matchesDistrict = (district === 'all' || item.district === district);
        const matchesCategory = (category === 'all' || item.category === category);
        return matchesSearch && matchesDistrict && matchesCategory;
    });
    displayDestinations(filtered);
}

// මුලින්ම cards පෙන්වීම
window.addEventListener('DOMContentLoaded', () => {
    displayDestinations(destinations);
});