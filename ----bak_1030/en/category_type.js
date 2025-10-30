function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let shopsData = [];
let currentCategory = '';

const urlParams = new URLSearchParams(window.location.search);
currentCategory = urlParams.get('category') || 'nail';

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
    
    // 언어 적용
    const categoryLabel = getCategoryLabel(currentCategory);
    const categoryDesc = getCategoryDescription(currentCategory);
    
    document.getElementById('categoryMainTitle').textContent = categoryLabel;
    document.getElementById('categoryMainDesc').textContent = categoryDesc;
    
    // Popular section 번역
    document.querySelector('.popular-section h3').textContent = t('popularShopsTitle');
    document.querySelector('.popular-section p').textContent = t('popularShopsDesc');
    document.querySelector('.floating-btn span').textContent = t('directions');
    
    renderPopularShops();
    renderAllCategoryShops();
});

function getCategoryDescription(category) {
    const lang = getCurrentLanguage();
    if (lang === 'en') {
        const descriptions = {
            beauty: 'Introducing Korean beauty shops.',
            glasses: 'Introducing Korean optical shops.',
            dessert: 'Introducing Korean dessert cafes.',
            cloth: 'Introducing Korean clothing shops.',
            vintage: 'Introducing Korean restaurants.',
            food: 'Introducing Korean restaurants.',
            goods: 'Introducing Korean goods shops.'
        };
        return descriptions[category] || '';
    } else {
        const descriptions = {
            beauty: '한국의 뷰티샵을 소개합니다.',
            glasses: '한국의 안경점을 소개합니다.',
            dessert: '한국의 디저트 카페를 소개합니다.',
            cloth: '한국의 의류샵을 소개합니다.',
            vintage: '한국의 음식점을 소개합니다.',
            food: '한국의 음식점을 소개합니다.',
            goods: '한국의 굿즈샵을 소개합니다.'
        };
        return descriptions[category] || '';
    }
}

function renderPopularShops() {
    const container = document.getElementById('categoryTypePopularScroll');
    if (!container) return;
    
    const sorted = [...shopsData]
        .filter(shop => shop.category === currentCategory)
        .sort((a, b) => {
            const viewsA = a.views || 0;
            const viewsB = b.views || 0;
            
            if (viewsB !== viewsA) {
                return viewsB - viewsA;
            }
            
            return b.id - a.id;
        })
        .slice(0, 10);
    
    container.innerHTML = sorted.map(shop => {
        const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
        const categoryLabel = getCategoryLabel(shop.category);
        const locationLabel = getLocationLabel(shop.location);
        return `
            <div class="popular-card" onclick="goToDetail(${shop.id})">
                <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(shop.name)}" onerror="this.src='https://via.placeholder.com/160x160?text=No+Image'">
                <div class="popular-card-info">
                    <div class="popular-card-name">${escapeHtml(shop.name)}</div>
                    <div class="popular-card-location">${locationLabel} · ${categoryLabel}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAllCategoryShops() {
    const shops = shopsData
        .filter(s => s.category === currentCategory)
        .sort((a, b) => a.id - b.id);
    const container = document.getElementById('allCategoryShops');
    
    if (shops.length > 0) {
        container.innerHTML = shops.map(shop => {
            const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
            const priceText = shop.priceMax ? 
                `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
                `₩${shop.price.toLocaleString()}~`;
            const locationLabel = getLocationLabel(shop.location);
            return `
                <div class="category-shop-card" onclick="goToDetail(${shop.id})">
                    <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(shop.name)}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                    <div class="category-shop-info">
                        <div class="category-shop-name">${escapeHtml(shop.name)}</div>
                        <div class="category-shop-price">${priceText}</div>
                        <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">${locationLabel}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function goToDetail(shopId) {
    const shopNo = String(shopId).padStart(4, '0');
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
