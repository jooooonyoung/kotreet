let shopsData = [];
let currentCategory = '';

// URL에서 카테고리 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
currentCategory = urlParams.get('category') || 'nail';

const categoryLabels = {
    nail: '네일샵',
    glasses: '안경점',
    hair: '헤어샵',
    hanbok: '한복대여',
    vintage: '빈티지샵',
    goods: '굿즈샵'
};

window.addEventListener('load', () => {
    if (localStorage.getItem('shopsData')) {
        shopsData = JSON.parse(localStorage.getItem('shopsData'));
    }
    
    const categoryLabel = categoryLabels[currentCategory] || '카테고리';
    document.getElementById('categoryAllTitle').textContent = categoryLabel;
    document.getElementById('categoryMainTitle').textContent = categoryLabel;
    document.getElementById('categoryMainDesc').textContent = `한국의 ${categoryLabel}을 매우지합니다.`;
    
    renderAllCategoryShops();
});

function renderAllCategoryShops() {
    // 해당 카테고리의 모든 가게 (전국)
    const shops = shopsData.filter(s => s.category === currentCategory);
    const container = document.getElementById('allCategoryShops');
    
    if (shops.length > 0) {
        container.innerHTML = shops.map(shop => {
            const shopNo = String(shop.id).padStart(4, '0');
            return `
                <div class="category-shop-card" onclick="goToDetail('${shopNo}')">
                    <img src="${shop.images[0]}" alt="${shop.name}">
                    <div class="category-shop-info">
                        <div class="category-shop-name">${shop.name}</div>
                        <div class="category-shop-price">₩${shop.price.toLocaleString()}~</div>
                        <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">${shop.location}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = '<p style="color: #6c757d; font-size: 13px; text-align: center; padding: 40px 20px;">등록된 가게가 없습니다.</p>';
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