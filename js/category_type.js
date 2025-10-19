let shopsData = [];
let currentCategory = '';

// URL에서 카테고리 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
currentCategory = urlParams.get('category') || 'nail';

const categoryLabels = {
    nail: '네일샵',
    glasses: '안경점',
    hair: '디저트 카페',
    hanbok: '한복 대여',
    vintage: '빈티지샵',
    goods: '굿즈샵'
};

const categoryDescriptions = {
    nail: '한국의 네일샵을 소개합니다.',
    glasses: '한국의 안경점을 소개합니다.',
    hair: '한국의 디저트 카페를 소개합니다.',
    hanbok: '한국의 한복 대여샵을 소개합니다.',
    vintage: '한국의 빈티지샵을 소개합니다.',
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
    
    // 나머지 렌더링 로직...
});

function renderAllCategoryShops() {
    // 해당 카테고리의 모든 가게만 필터링
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