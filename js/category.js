let shopsData = [];
let currentLocation = '';
let currentCategory = '';

// URL에서 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
currentLocation = urlParams.get('location') || '홍대';
currentCategory = urlParams.get('category') || 'all';

window.addEventListener('load', () => {
    if (localStorage.getItem('shopsData')) {
        shopsData = JSON.parse(localStorage.getItem('shopsData'));
    }
    
    document.getElementById('locationTitle').textContent = currentLocation;
    
    // 카테고리 필터링에 따라 렌더링
    if (currentCategory === 'all') {
        renderAllCategories();
        highlightActiveTab(null);
    } else {
        renderSingleCategory(currentCategory);
        highlightActiveTab(currentCategory);
    }
});

function renderAllCategories() {
    const categories = ['nail', 'glasses', 'hair', 'hanbok', 'vintage', 'goods'];
    const categoryLabels = {
        nail: '네일샵',
        glasses: '안경점',
        hair: '헤어샵',
        hanbok: '한복대여',
        vintage: '빈티지샵',
        goods: '굿즈샵'
    };

    categories.forEach(category => {
        const shops = shopsData.filter(s => s.location === currentLocation && s.category === category);
        const containerId = category + 'Shops';
        const descId = category + 'Desc';
        
        // 설명 업데이트
        if (document.getElementById(descId)) {
            document.getElementById(descId).textContent = `${currentLocation}의 ${categoryLabels[category]}은 매우지합니다.`;
        }
        
        // 가게 카드 렌더링
        const container = document.getElementById(containerId);
        if (container) {
            if (shops.length > 0) {
                container.innerHTML = shops.map(shop => {
                    const shopNo = String(shop.id).padStart(4, '0');
                    return `
                        <div class="category-shop-card" onclick="goToDetail('${shopNo}')">
                            <img src="${shop.images[0]}" alt="${shop.name}">
                            <div class="category-shop-info">
                                <div class="category-shop-name">${shop.name}</div>
                                <div class="category-shop-price">₩${shop.price.toLocaleString()}~</div>
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
        nail: '네일샵',
        glasses: '안경점',
        hair: '헤어샵',
        hanbok: '한복대여',
        vintage: '빈티지샵',
        goods: '굿즈샵'
    };

    // 다른 카테고리 섹션 숨기기
    const allCategories = ['nail', 'glasses', 'hair', 'hanbok', 'vintage', 'goods'];
    allCategories.forEach(cat => {
        const section = document.getElementById(cat + 'Section');
        if (section) {
            if (cat === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    });

    // 선택된 카테고리만 렌더링
    const shops = shopsData.filter(s => s.location === currentLocation && s.category === category);
    const containerId = category + 'Shops';
    const descId = category + 'Desc';
    
    if (document.getElementById(descId)) {
        document.getElementById(descId).textContent = `${currentLocation}의 ${categoryLabels[category]}은 매우지합니다.`;
    }
    
    const container = document.getElementById(containerId);
    if (container) {
        if (shops.length > 0) {
            container.innerHTML = shops.map(shop => {
                const shopNo = String(shop.id).padStart(4, '0');
                return `
                    <div class="category-shop-card" onclick="goToDetail('${shopNo}')">
                        <img src="${shop.images[0]}" alt="${shop.name}">
                        <div class="category-shop-info">
                            <div class="category-shop-name">${shop.name}</div>
                            <div class="category-shop-price">₩${shop.price.toLocaleString()}~</div>
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
    // 이미 선택된 카테고리를 다시 클릭하면 전체 보기로 돌아감
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

// Footer 로드
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = data;
        }
    });

// 스크롤 이벤트 (Directions 버튼)
window.addEventListener('scroll', () => {
    const floatingBtn = document.querySelector('.floating-btn');
    if (floatingBtn) {
        if (window.scrollY > 200) {
            floatingBtn.classList.add('visible');
        } else {
            floatingBtn.classList.remove('visible');
        }
    }
});