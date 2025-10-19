let shopsData = [];
let currentLocation = '';
let currentCategory = '';

// URL에서 파라미터 가져오기
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
    
    // 초기 스크롤 위치 저장
    const scrollContainer = document.querySelector('.category-tabs-scroll');
    const initialScrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    
    // 카테고리 필터링에 따라 렌더링
    if (currentCategory === 'all') {
        renderAllCategories();
        highlightActiveTab(null);
    } else {
        renderSingleCategory(currentCategory);
        highlightActiveTab(currentCategory);
        
        // 스크롤 위치 복원 후 중앙 정렬
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
    const categories = ['nail', 'glasses', 'dessert', 'hanbok', 'vintage', 'goods'];
    const categoryLabels = {
        nail: '네일샵',
        glasses: '안경점',
        dessert: '디저트 카페',
        hanbok: '한복대여',
        vintage: '빈티지샵',
        goods: '굿즈샵'
    };

    categories.forEach(category => {
        const shops = shopsData.filter(s => s.location === currentLocation && s.category === category);
        
        // 섹션 ID 매핑 (기존 HTML 구조 유지)
        const sectionIdMap = {
            nail: 'nailSection',
            glasses: 'glassesSection',
            dessert: 'hairSection', // HTML에서 hairSection이 디저트 카페를 의미
            hanbok: 'hanbokSection',
            vintage: 'vintageSection',
            goods: 'goodsSection'
        };
        
        const containerId = category === 'dessert' ? 'hairShops' : category + 'Shops';
        const descId = category === 'dessert' ? 'hairDesc' : category + 'Desc';
        const sectionId = sectionIdMap[category];
        
        // 섹션 표시
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
        
        // 설명 업데이트
        if (document.getElementById(descId)) {
            document.getElementById(descId).textContent = `${currentLocation}의 ${categoryLabels[category]}`;
        }
        
        // 섹션 제목 업데이트
        const sectionTitle = section?.querySelector('.category-section-title');
        if (sectionTitle) {
            sectionTitle.textContent = categoryLabels[category];
        }
        
        // 가게 카드 렌더링
        const container = document.getElementById(containerId);
        if (container) {
            if (shops.length > 0) {
                container.innerHTML = shops.map(shop => {
                    const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
                    return `
                        <div class="category-shop-card" onclick="goToDetail(${shop.id})">
                            <img src="${imgUrl}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
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
        dessert: '디저트 카페',
        hanbok: '한복대여',
        vintage: '빈티지샵',
        goods: '굿즈샵'
    };

    // 섹션 ID 매핑
    const sectionIdMap = {
        nail: 'nailSection',
        glasses: 'glassesSection',
        dessert: 'hairSection',
        hanbok: 'hanbokSection',
        vintage: 'vintageSection',
        goods: 'goodsSection'
    };

    // 다른 카테고리 섹션 숨기기
    const allCategories = ['nail', 'glasses', 'dessert', 'hanbok', 'vintage', 'goods'];
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

    // 선택된 카테고리만 렌더링
    const shops = shopsData.filter(s => s.location === currentLocation && s.category === category);
    const containerId = category === 'dessert' ? 'hairShops' : category + 'Shops';
    const descId = category === 'dessert' ? 'hairDesc' : category + 'Desc';
    
    if (document.getElementById(descId)) {
        document.getElementById(descId).textContent = `${currentLocation}의 ${categoryLabels[category]}`;
    }
    
    // 섹션 제목 업데이트
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
                return `
                    <div class="category-shop-card" onclick="goToDetail('${shopNo}')">
                        <img src="${imgUrl}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
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
    // shopNo는 이미 "0001" 형식의 문자열
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