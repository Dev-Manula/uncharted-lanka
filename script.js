// 1. Elements හඳුනා ගැනීම
const container = document.getElementById('destinationsContainer');
const detailView = document.getElementById('detailView');
const searchInput = document.getElementById('searchInput');
const districtFilter = document.getElementById('districtFilter');
const categoryButtons = document.querySelectorAll('.cat-btn');
const suggestionsBox = document.getElementById('suggestionsList');
const accordionContainer = document.getElementById('accordionContainer');
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

let activeCategory = 'all';
let fuse; // Fuse instance එක පසුව initialize කරමු

// 2. Fuse.js Setup (Data load වුණාම කරන්න)
function setupSearch() {
    if (typeof destinations !== 'undefined') {
        fuse = new Fuse(destinations, {
            keys: ['name', 'district', 'category'],
            threshold: 0.4
        });
    }
}

// 3. Cards පෙන්වන Function එක
function displayDestinations(items) {
    container.innerHTML = "";
    if (items.length === 0) {
        container.innerHTML = `<div class="coming-soon-box"><h3>No gems found.</h3><p>Try adjusting your filters.</p></div>`;
        return;
    }
    items.forEach(item => {
        container.innerHTML += `
            <div class="destination-card fade-in">
                <div class="card-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <span class="category-tag">${item.category}</span>
                </div>
                <div class="card-info">
                    <span class="district">📍 ${item.district}</span>
                    <h3>${item.name}</h3>
                    <p class="desc">${item.description}</p>
                    <button class="btn-explore" onclick="openDetails(${item.id})">Explore More</button>
                </div>
            </div>`;
    });
    // අලුතින් ආපු buttons වලට cursor hover එක ලබා දීම
    attachCursorListeners();
}

// 4. Smart Filtering & Search Logic
function updateUI() {
    const searchValue = searchInput.value.trim();
    const selectedDistrict = districtFilter.value;
    
    let results = [];

    if (searchValue.length > 0 && fuse) {
        const fuzzyResults = fuse.search(searchValue);
        results = fuzzyResults.map(r => r.item);
        showSuggestions(fuzzyResults);
    } else {
        results = [...destinations];
        suggestionsBox.style.display = "none";
    }

    // District සහ Category අනුව Filter කිරීම
    const finalFiltered = results.filter(item => {
        const matchesDistrict = (selectedDistrict === 'all' || item.district === selectedDistrict);
        const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
        return matchesDistrict && matchesCategory;
    });

    displayDestinations(finalFiltered);
}

// Suggestions පෙන්වීම
function showSuggestions(results) {
    suggestionsBox.innerHTML = "";
    if (results.length > 0) {
        suggestionsBox.style.display = "block";
        results.slice(0, 5).forEach(r => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `${r.item.name} <span>${r.item.district}</span>`;
            div.onclick = () => {
                searchInput.value = r.item.name;
                suggestionsBox.style.display = "none";
                updateUI();
            };
            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
}

// 5. Full Screen Detail View Logic
function openDetails(id) {
    const selected = destinations.find(dest => dest.id === id);
    if (!selected) return;

    document.getElementById('detailHeader').style.backgroundImage = `url(${selected.image})`;
    document.getElementById('detailTitle').innerText = selected.name;
    document.getElementById('detailCategory').innerText = selected.category;
    document.getElementById('detailLocation').innerText = `📍 ${selected.district}`;

    accordionContainer.innerHTML = "";

    const sections = [
        { title: "History & Story", content: selected.history, hideIfEmpty: true },
        { title: "Local Food & Dining", content: selected.food, hideIfEmpty: true },
        { title: "Tickets & Fees", content: selected.tickets, hideIfEmpty: true },
        { title: "Best Time to Visit", content: selected.bestTime, hideIfEmpty: true },
        { title: "Accommodation", content: selected.hostels, hideIfEmpty: true },
        { title: "Location Map", content: selected.map, isLink: true, hideIfEmpty: true }
    ];

    const hasAnyDetails = sections.some(sec => sec.content && sec.content.trim() !== "");

    if (!hasAnyDetails) {
        accordionContainer.innerHTML = `
            <div class="coming-soon-box fade-in">
                <h3>More Details Coming Soon</h3>
                <p>We are currently gathering more information about this hidden gem. Stay tuned!</p>
            </div>`;
    } else {
        sections.forEach(sec => {
            if (sec.hideIfEmpty && !sec.content) return;
            const contentHTML = sec.isLink ? `<a href="${sec.content}" target="_blank" class="btn-map-large">Open in Google Maps</a>` : `<p>${sec.content || "Information coming soon..."}</p>`;
            accordionContainer.innerHTML += `
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion(this)">${sec.title}</div>
                    <div class="accordion-content">${contentHTML}</div>
                </div>`;
        });
    }

    requestAnimationFrame(() => {
        detailView.style.display = "block";
        document.body.style.overflow = "hidden";
    });
}

function closeDetails() {
    detailView.style.display = "none";
    document.body.style.overflow = "auto";
}

function toggleAccordion(header) {
    header.parentElement.classList.toggle('active');
}

// 6. Premium Custom Cursor Logic
window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

function attachCursorListeners() {
    const interactiveElements = document.querySelectorAll("button, a, .cat-btn, .custom-select, .accordion-header");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => cursorOutline.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => cursorOutline.classList.remove("cursor-hover"));
    });
}

// 7. Smooth Scrolling for Nav Links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 8. Initialization
window.addEventListener('load', () => {
    // Preloader අයින් කිරීම
    setTimeout(() => {
        document.getElementById('preloader').classList.add('preloader-hidden');
    }, 1000);
});

window.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    updateUI(); // මුලින්ම cards පෙන්වීම
});

// Event Listeners for Filters
searchInput.addEventListener('input', updateUI);
districtFilter.addEventListener('change', updateUI);
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        updateUI();
    });
});

// පිටත click කළහොත් suggestions වසන්න
document.addEventListener('click', (e) => {
    if (e.target !== searchInput) suggestionsBox.style.display = "none";
});