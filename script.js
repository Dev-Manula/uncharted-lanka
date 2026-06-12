// 1. අපේ දත්ත (Data) - මෙතන තමයි හැම තැනකම විස්තර තියෙන්නේ
const destinations = [
    {
        id: 1,
        name: "Sigiriya Rock Fortress",
        district: "matale",
        category: "ancient",
        image: "images/test1.png", // Forward slash (/) පාවිච්චි කර ඇත
        description: "The ancient rock fortress and palace ruins in the central Matale District."
    },
    {
        id: 2,
        name: "Nine Arch Bridge",
        district: "badulla",
        category: "hiking",
        image: "images/test2.png",
        description: "A massive bridge in Ella, famous for its architectural beauty and lush surroundings."
    },
    {
        id: 3,
        name: "Mirissa Beach",
        district: "matara",
        category: "beaches",
        image: "images/test3.jpg",
        description: "A popular beach destination known for whale watching and surfing."
    },
    {
        id: 4,
        name: "Diyaluma Falls",
        district: "badulla",
        category: "waterfalls",
        image: "images/test4.jpg",
        description: "The second highest waterfall in Sri Lanka, perfect for adventure seekers."
    }
];

// 2. HTML එකේ cards පෙන්වන තැන (Container) හඳුනා ගැනීම
const container = document.getElementById('destinationsContainer');

// 3. Cards screen එකට පෙන්වන Function එක
function displayDestinations(items) {
    container.innerHTML = ""; // මුලින්ම තියෙන දේවල් අයින් කරනවා

    // කිසිම තැනක් හමු වුණේ නැත්නම් "No Results" message එක පෙන්වනවා
    if (items.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>Oops! No destinations found. Try a different search.</p>
            </div>
        `;
        return;
    }

    // හැම item එකකටම card එකක් සාදා container එකට එකතු කරනවා
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
                    <button class="btn-explore">Explore More</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// 4. Filtering Logic (Search, District සහ Category වැඩ කරන විදිහ)
const searchInput = document.getElementById('searchInput');
const districtFilter = document.getElementById('districtFilter');
const categoryButtons = document.querySelectorAll('.cat-btn');

let activeCategory = 'all';

// Search bar එකේ type කරන විට
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterDestinations(searchTerm, districtFilter.value, activeCategory);
});

// District dropdown එක මාරු කරන විට
districtFilter.addEventListener('change', (e) => {
    filterDestinations(searchInput.value.toLowerCase(), e.target.value, activeCategory);
});

// Category buttons click කරන විට
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        filterDestinations(searchInput.value.toLowerCase(), districtFilter.value, activeCategory);
    });
});

// දත්ත filter කරන ප්‍රධාන function එක
function filterDestinations(search, district, category) {
    const filtered = destinations.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search);
        const matchesDistrict = (district === 'all' || item.district === district);
        const matchesCategory = (category === 'all' || item.category === category);
        return matchesSearch && matchesDistrict && matchesCategory;
    });
    displayDestinations(filtered);
}

// 5. Site එක load වූ විගස මුලින්ම cards පෙන්වීම
window.addEventListener('DOMContentLoaded', () => {
    displayDestinations(destinations);
});