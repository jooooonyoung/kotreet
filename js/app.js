let shopsData = [];
let currentLocation = null;
let currentCategory = null;
let previousPage = 'home';

const categoryOrder = ['nail', 'glasses', 'hair', 'hanbok', 'vintage', 'goods'];

const sampleData = [
    {
        id: 1,
        name: "다비치 안경 명동점",
        category: "glasses",
        location: "명동",
        price: 150000,
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "busy",
        communication: "easy",
        payment: "both",
        hours: "화~일 11:00 AM - 9:00 PM / 월요일 휴무",
        description: "명동에서 가장 트렌디한 안경을 찾을 수 있습니다.",
        latitude: 37.5621,
        longitude: 126.9840,
        views: 1250
    },
    {
        id: 2,
        name: "프리미엄 네일 홍대",
        category: "nail",
        location: "홍대",
        price: 50000,
        images: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "busy",
        communication: "easy",
        payment: "both",
        hours: "월~일 10:00 AM - 8:00 PM",
        description: "홍대의 최고 트렌드 네일 샵입니다.",
        latitude: 37.5519,
        longitude: 126.9255,
        views: 980
    },
    {
        id: 3,
        name: "감성 헤어 강남",
        category: "hair",
        location: "강남",
        price: 45000,
        images: ["https://images.unsplash.com/photo-1580487944550-e323be2ae537?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "quiet",
        communication: "easy",
        payment: "both",
        hours: "화~일 10:00 AM - 9:00 PM / 월요일 휴무",
        description: "강남의 감성 헤어샵입니다.",
        latitude: 37.4979,
        longitude: 127.0276,
        views: 750
    },
    {
        id: 4,
        name: "빈티지 마켓 성수",
        category: "vintage",
        location: "성수",
        price: 30000,
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "busy",
        communication: "easy",
        payment: "both",
        hours: "월~일 10:00 AM - 10:00 PM",
        description: "성수의 인기 빈티지 마켓입니다.",
        latitude: 37.5349,
        longitude: 127.0566,
        views: 620
    },
    {
        id: 5,
        name: "한복 스튜디오 명동",
        category: "hanbok",
        location: "명동",
        price: 80000,
        images: ["https://images.unsplash.com/photo-1585349810294-1e1e0ba3f02d?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "quiet",
        communication: "easy",
        payment: "both",
        hours: "화~일 10:00 AM - 7:00 PM / 월요일 휴무",
        description: "명동의 한복 스튜디오입니다.",
        latitude: 37.5628,
        longitude: 126.9845,
        views: 550
    }
];

// ==================== 초기화 ====================
window.addEventListener('load', () => {
    // 데이터 로드
    if (localStorage.getItem('shopsData')) {
        shopsData = JSON.parse(localStorage.getItem('shopsData'));
    } else {
        shopsData = JSON.parse(JSON.stringify(sampleData));
        saveToStorage();
    }
    
    // 페이지 렌더링
    renderPopularShops();
    
    // 스크롤 가속 적용
    applyScrollAcceleration();
    
    // Footer 로드
    loadFooter();
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

// ==================== 데이터 관리 ====================
function saveToStorage() {
    localStorage.setItem('shopsData', JSON.stringify(shopsData));
}

function getCurrentLocation() {
    return currentLocation;
}

// ==================== 네비게이션 ====================
function goToHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    closeSearchModal();
    renderPopularShops();
}

function goToAdmin() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('adminPage').classList.remove('hidden');
    refreshShopList();
}

function goToDetail(shopId) {
    const shop = shopsData.find(s => s.id === shopId);
    if (!shop) return;

    shop.views = (shop.views || 0) + 1;
    saveToStorage();

    const shopNo = String(shopId).padStart(4, '0');
    window.location.href = `detail.html?no=${shopNo}`;
}

function goBack() {
    if (previousPage === 'category') {
        goToLocationPage(currentLocation);
    } else if (previousPage === 'location') {
        goToHome();
    } else {
        goToHome();
    }
}

// ==================== HOME 페이지 ====================
function renderPopularShops() {
    const sorted = [...shopsData].sort((a, b) => (b.views || 0) - (a.views || 0));
    const container = document.getElementById('popularScroll');
    if (!container) return;
    
    container.innerHTML = sorted.map(shop => {
        const shopNo = String(shop.id).padStart(4, '0');
        return `
            <div class="popular-card" onclick="window.location.href='detail.html?no=${shopNo}'">
                <img src="${shop.images[0]}" alt="${shop.name}">
                <div class="popular-card-info">
                    <div class="popular-card-name">${shop.name}</div>
                    <div class="popular-card-location">${shop.location}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== 검색 기능 ====================
function openSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('searchModalInput')?.focus();
    }
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

document.getElementById('searchModalInput')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }

    const results = shopsData.filter(shop => 
        shop.name.toLowerCase().includes(query) ||
        getCategoryLabel(shop.category).toLowerCase().includes(query) ||
        shop.location.includes(query)
    );

    const html = results.map(shop => `
        <div class="search-result-item" onclick="goToDetail(${shop.id}); closeSearchModal();">
            <div class="search-result-name">${shop.name}</div>
            <div class="search-result-meta">${getCategoryLabel(shop.category)} • ${shop.location}</div>
        </div>
    `).join('');

    resultsContainer.innerHTML = html || '<div style="padding: 20px; text-align: center; color: #6c757d;">결과가 없습니다</div>';
});

document.getElementById('searchModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'searchModal') closeSearchModal();
});

// ==================== 사이드 메뉴 ====================
function openSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
        sideMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSideMenu() {
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
        sideMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== 관리자 ====================
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.add('hidden'));

    event.target.classList.add('active');
    document.getElementById(tab + 'Tab')?.classList.remove('hidden');

    if (tab === 'list') refreshShopList();
}

function addShop() {
    const name = document.getElementById('adminShopName').value;
    const category = document.getElementById('adminCategory').value;
    const location = document.getElementById('adminLocation').value;
    const price = parseInt(document.getElementById('adminPrice').value);
    const thumbnail = document.getElementById('adminThumbnail').value.trim();
    const mainImage = document.getElementById('adminMainImage').value.trim();
    const additionalImages = document.getElementById('adminImages').value.split(',').map(s => s.trim()).filter(s => s);
    const images = [thumbnail, mainImage, ...additionalImages].filter(s => s);
    const video = document.getElementById('adminVideo').value;
    const mood = document.getElementById('adminMood').value;
    const communication = document.getElementById('adminComm').value;
    const payment = document.getElementById('adminPayment').value;
    const hours = document.getElementById('adminHours').value;
    const description = document.getElementById('adminDescription').value;
    const latitude = parseFloat(document.getElementById('adminLat').value);
    const longitude = parseFloat(document.getElementById('adminLng').value);

    if (!name || !category || !location || !price || !thumbnail || !mainImage || !mood || !communication || !payment) {
        alert('모든 필수 항목을 입력하세요');
        return;
    }

    const newShop = {
        id: Math.max(...shopsData.map(s => s.id), 0) + 1,
        name, category, location, price, 
        thumbnail, mainImage,
        images, video, mood,
        communication, payment, hours, description, latitude, longitude,
        views: 0
    };

    shopsData.push(newShop);
    saveToStorage();
    resetForm();
    renderPopularShops();
    alert('가게가 추가되었습니다!');
}

function resetForm() {
    const fields = ['adminShopName', 'adminCategory', 'adminLocation', 'adminPrice', 'adminThumbnail', 'adminMainImage', 'adminImages', 'adminVideo', 'adminMood', 'adminComm', 'adminPayment', 'adminHours', 'adminDescription', 'adminLat', 'adminLng'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) element.value = '';
    });
}

function refreshShopList() {
    const container = document.getElementById('shopList');
    if (!container) return;
    
    const html = shopsData.map(shop => `
        <div class="shop-item">
            <div class="shop-item-info">
                <div class="shop-item-name">${shop.name}</div>
                <div class="shop-item-meta">${getCategoryLabel(shop.category)} • ${shop.location} • 조회수: ${shop.views}</div>
            </div>
            <div class="shop-item-actions">
                <button class="shop-item-btn shop-item-edit" onclick="editShop(${shop.id})">수정</button>
                <button class="shop-item-btn shop-item-delete" onclick="deleteShop(${shop.id})">삭제</button>
            </div>
        </div>
    `).join('');
    container.innerHTML = html;
}

function deleteShop(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        shopsData = shopsData.filter(s => s.id !== id);
        saveToStorage();
        refreshShopList();
        renderPopularShops();
    }
}

function editShop(id) {
    const shop = shopsData.find(s => s.id === id);
    if (!shop) return;

    document.getElementById('adminShopName').value = shop.name;
    document.getElementById('adminCategory').value = shop.category;
    document.getElementById('adminLocation').value = shop.location;
    document.getElementById('adminPrice').value = shop.price;
    document.getElementById('adminThumbnail').value = shop.thumbnail || '';
    document.getElementById('adminMainImage').value = shop.mainImage || '';
    document.getElementById('adminImages').value = shop.images.slice(2).join(',');
    document.getElementById('adminVideo').value = shop.video || '';
    document.getElementById('adminMood').value = shop.mood;
    document.getElementById('adminComm').value = shop.communication;
    document.getElementById('adminPayment').value = shop.payment;
    document.getElementById('adminHours').value = shop.hours;
    document.getElementById('adminDescription').value = shop.description;
    document.getElementById('adminLat').value = shop.latitude;
    document.getElementById('adminLng').value = shop.longitude;

    shopsData = shopsData.filter(s => s.id !== id);
    saveToStorage();

    document.querySelectorAll('.admin-tab')[0]?.click();
    window.scrollTo(0, 0);
    alert('수정 후 "가게 추가" 버튼을 눌러주세요');
}

// ==================== JSON 관리 ====================
function exportJSON() {
    const dataStr = JSON.stringify(shopsData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shops-data.json';
    a.click();
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                shopsData = imported;
                saveToStorage();
                alert('데이터가 성공적으로 업로드되었습니다!');
                refreshShopList();
                renderPopularShops();
            } else {
                alert('올바른 JSON 형식이 아닙니다');
            }
        } catch (err) {
            alert('JSON 파일을 읽을 수 없습니다');
        }
    };
    reader.readAsText(file);
}

// ==================== 유틸 함수 ====================
function getCategoryLabel(category) {
    const map = {
        nail: '네일샵',
        hair: '헤어샵',
        glasses: '안경점',
        vintage: '빈티지샵',
        hanbok: '한복대여',
        goods: '굿즈샵'
    };
    return map[category] || category;
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

function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(err => console.error('Footer load failed:', err));
}

function applyScrollAcceleration() {
    const scrollContainers = document.querySelectorAll('.scroll-container, .popular-scroll');
    scrollContainers.forEach(container => {
        let isScrolling = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 1.2;  // 2.5 → 1.2로 변경 (더 부드럽게)
            container.scrollLeft = scrollLeft - walk;
        });
        
        container.addEventListener('touchend', () => {
            isScrolling = false;
        });
    });
}