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

const categoryLabels = {
    beauty: '뷰티',
    glasses: '안경점',
    dessert: '디저트 카페',
    cloth: '의류',
    vintage: '음식점',
    goods: '굿즈샵'
};

const categoryDescriptions = {
    beauty: '한국의 뷰티을 소개합니다.',
    glasses: '한국의 안경점을 소개합니다.',
    dessert: '한국의 디저트 카페를 소개합니다.',
    cloth: '한국의 의류샵을 소개합니다.',
    vintage: '한국의 음식점을 소개합니다.',
    goods: '한국의 굿즈샵을 소개합니다.'
};

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
    
    document.getElementById('categoryMainTitle').textContent = categoryLabels[currentCategory] || currentCategory;
    document.getElementById('categoryMainDesc').textContent = categoryDescriptions[currentCategory] || '';
    
    renderPopularShops();
    renderAllCategoryShops();
});

function renderPopularShops() {
    const container = document.getElementById('categoryTypePopularScroll');
    if (!container) return;
    
    // 현재 카테고리의 가게만 필터링 후 조회수 높은 순으로 정렬, 상위 10개만 표시
    const sorted = [...shopsData]
        .filter(shop => shop.category === currentCategory) // 현재 카테고리만 필터링
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
        const categoryLabel = categoryLabels[shop.category] || shop.category;
        const priceText = shop.priceMax ? 
            `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
            `₩${shop.price.toLocaleString()}~`;
        return `
            <div class="popular-card" onclick="goToDetail(${shop.id})">
                <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(shop.name)}" onerror="this.src='https://via.placeholder.com/160x160?text=No+Image'">
                <div class="popular-card-info">
                    <div class="popular-card-name">${escapeHtml(shop.name)}</div>
                    <div class="popular-card-price">${priceText}</div>
                    <div class="popular-card-location">${escapeHtml(shop.location)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAllCategoryShops() {
    const shops = shopsData
        .filter(s => s.category === currentCategory)
        .sort((a, b) => a.id - b.id); // ID순 정렬
    const container = document.getElementById('allCategoryShops');
    
    if (shops.length > 0) {
        container.innerHTML = shops.map(shop => {
            const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
            const priceText = shop.priceMax ? 
                `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
                `₩${shop.price.toLocaleString()}~`;
            return `
                <div class="category-shop-card" onclick="goToDetail(${shop.id})">
                    <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(shop.name)}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                    <div class="category-shop-info">
                        <div class="category-shop-name">${escapeHtml(shop.name)}</div>
                        <div class="category-shop-price">${priceText}</div>
                        <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">${escapeHtml(shop.location)}</div>
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