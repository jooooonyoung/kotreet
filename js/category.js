(function() {
    const path = window.location.pathname;
    const search = window.location.search;
    
    if (path.endsWith('.html')) {
        const newPath = path.replace('.html', '');
        window.history.replaceState(null, '', newPath + search);
    }
})();

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCategoryLabel(category) {
    const categoryMap = {
        beauty: '뷰티',
        dessert: '디저트 카페',
        glasses: '안경점',
        vintage: '음식점',
        cloth: '의류',
        goods: '굿즈샵'
    };
    return categoryMap[category] || category;
}

let shopsData = [];
let currentLocation = '';
let currentCategory = '';

const urlParams = new URLSearchParams(window.location.search);
currentLocation = urlParams.get('location') || '홍대';
currentCategory = urlParams.get('category') || 'all';

window.addEventListener('load', () => {
    const storedData = localStorage.getItem('shopsData');
    if (storedData) {
        try {
            shopsData = JSON.parse(storedData);
        } catch (e) {
            console.error('데이터 로드 실패:', e);
            shopsData = [];
        }
    }
    
    document.getElementById('locationTitle').textContent = currentLocation;
    
    const scrollContainer = document.querySelector('.category-tabs-scroll');
    const initialScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    
    if (currentCategory === 'all') {
        renderAllCategories();
        highlightActiveTab(null);
    } else {
        renderSingleCategory(currentCategory);
        highlightActiveTab(currentCategory);
        
        if (scrollContainer) {
            scrollContainer.scrollLeft = initialScrollLeft;
        }
        
        setTimeout(() => {
            const activeButton = document.querySelector('.category-tab.active');
            if (activeButton && scrollContainer) {
                const buttonLeft = activeButton.offsetLeft;
                const buttonWidth = activeButton.offsetWidth;
                const containerWidth = scrollContainer.offsetWidth;
                
                scrollContainer.scrollTo({
                    left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
});

function renderAllCategories() {
    const categories = ['beauty', 'glasses', 'dessert', 'cloth', 'vintage', 'goods'];
    const categoryLabels = {
        beauty: '뷰티',
        glasses: '안경점',
        dessert: '디저트 카페',
        cloth: '의류',
        vintage: '음식점',
        goods: '굿즈샵'
    };

    categories.forEach(category => {
        const shops = shopsData
            .filter(s => s.location === currentLocation && s.category === category)
            .sort((a, b) => a.id - b.id); // ID순 정렬
        
        const sectionIdMap = {
            beauty: 'beautySection',
            glasses: 'glassesSection',
            dessert: 'hairSection',
            cloth: 'clothSection',
            vintage: 'vintageSection',
            goods: 'goodsSection'
        };
        
        const containerId = category === 'dessert' ? 'hairShops' : category + 'Shops';
        const descId = category === 'dessert' ? 'hairDesc' : category + 'Desc';
        const sectionId = sectionIdMap[category];
        
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
        
        if (document.getElementById(descId)) {
            document.getElementById(descId).textContent = `${currentLocation}의 ${categoryLabels[category]}`;
        }
        
        const sectionTitle = section?.querySelector('.category-section-title');
        if (sectionTitle) {
            sectionTitle.textContent = categoryLabels[category];
        }
        
        const container = document.getElementById(containerId);
        if (container) {
            if (shops.length > 0) {
                container.innerHTML = shops.map(shop => {
                    const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
                    const priceText = shop.priceMax ? 
                        `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
                        `₩${shop.price.toLocaleString()}~`;
                    const categoryLabel = getCategoryLabel(shop.category);
                    return `
                        <div class="category-shop-card" onclick="goToDetail(${shop.id})">
                            <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(shop.name)}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                            <div class="category-shop-info">
                                <div class="category-shop-name">${escapeHtml(shop.name)}</div>
                                <div class="category-shop-price">${priceText}</div>
                                <div class="category-shop-location">${escapeHtml(shop.location)} · ${categoryLabel}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                container.innerHTML = '<p style="color: #6c757d; font-size: 13px;">등록된 가게가 없습니다.</p>';
            }
        }
    });
}

function renderSingleCategory(category) {
    const categoryLabels = {
        beauty: '뷰티',
        glasses: '안경점',
        dessert: '디저트 카페',
        cloth: '의류',
        vintage: '음식점',
        goods: '굿즈샵'
    };

    const sectionIdMap = {
        beauty: 'beautySection',
        glasses: 'glassesSection',
        dessert: 'hairSection',
        cloth: 'clothSection',
        vintage: 'vintageSection',
        goods: 'goodsSection'
    };

    const allCategories = ['beauty', 'glasses', 'dessert', 'cloth', 'vintage', 'goods'];
    allCategories.forEach(cat => {
        const section = document.getElementById(sectionIdMap[cat]);
        if (section) {
            if (cat === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });

    const shops = shopsData
        .filter(s => s.location === currentLocation && s.category === category)
        .sort((a, b) => a.id - b.id); // ID순 정렬
    const containerId = category === 'dessert' ? 'hairShops' : category + 'Shops';
    const descId = category === 'dessert' ? 'hairDesc' : category + 'Desc';
    
    if (document.getElementById(descId)) {
        document.getElementById(descId).textContent = `${currentLocation}의 ${categoryLabels[category]}`;
    }
    
    const section = document.getElementById(sectionIdMap[category]);
    const sectionTitle = section?.querySelector('.category-section-title');
    if (sectionTitle) {
        sectionTitle.textContent = categoryLabels[category];
    }
    
    const container = document.getElementById(containerId);
    if (container) {
        if (shops.length > 0) {
            container.innerHTML = shops.map(shop => {
                const shopNo = String(shop.id).padStart(4, '0');
                const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
                const priceText = shop.priceMax ? 
                    `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
                    `₩${shop.price.toLocaleString()}~`;
                const categoryLabel = getCategoryLabel(shop.category);
                return `
                    <div class="category-shop-card" onclick="goToDetail('${shopNo}')">
                        <img src="${imgUrl}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                        <div class="category-shop-info">
                            <div class="category-shop-name">${shop.name}</div>
                            <div class="category-shop-price">${priceText}</div>
                            <div class="category-shop-location">${shop.location} · ${categoryLabel}</div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = '<p style="color: #6c757d; font-size: 13px;">등록된 가게가 없습니다.</p>';
        }
    }
}

function highlightActiveTab(activeCategory) {
    document.querySelectorAll('.category-tab').forEach(tab => {
        const tabCategory = tab.getAttribute('data-category');
        if (tabCategory === activeCategory) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function filterCategory(category) {
    if (currentCategory === category) {
        window.location.href = `category.html?location=${currentLocation}`;
    } else {
        window.location.href = `category.html?location=${currentLocation}&category=${category}`;
    }
}

function goToDetail(shopNo) {
    window.location.href = `detail.html?no=${shopNo}`;
}

function goBack() {
    window.location.href = 'index.html';
}

function openCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        }, () => {
            window.open('https://www.google.com/maps', '_blank');
        });
    } else {
        window.open('https://www.google.com/maps', '_blank');
    }
}

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = data;
        }
    });

window.addEventListener('scroll', () => {
    const floatingBtn = document.querySelector('.floating-btn');
    if (floatingBtn) {
        if (window.scrollY > 1) {
            floatingBtn.classList.add('visible');
        } else {
            floatingBtn.classList.remove('visible');
        }
    }
});