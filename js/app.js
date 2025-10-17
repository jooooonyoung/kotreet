// ==================== 데이터 관리 ====================
let shopsData = [];

// 초기 샘플 데이터
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
        name: "감성 카페 홍대",
        category: "goods",
        location: "홍대",
        price: 8000,
        images: ["https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "quiet",
        communication: "easy",
        payment: "both",
        hours: "월~일 10:00 AM - 10:00 PM",
        description: "홍대의 숨겨진 감성 카페입니다.",
        latitude: 37.5519,
        longitude: 126.9255,
        views: 980
    },
    {
        id: 3,
        name: "프리미엄 네일 강남",
        category: "nail",
        location: "강남",
        price: 50000,
        images: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop"],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        mood: "busy",
        communication: "easy",
        payment: "both",
        hours: "월~일 10:00 AM - 8:00 PM",
        description: "강남의 최고 트렌드 네일 샵입니다.",
        latitude: 37.4979,
        longitude: 127.0276,
        views: 750
    }
];

// 페이지 로드 시 샘플 데이터 초기화
window.addEventListener('load', () => {
    if (localStorage.getItem('shopsData')) {
        shopsData = JSON.parse(localStorage.getItem('shopsData'));
    } else {
        shopsData = JSON.parse(JSON.stringify(sampleData));
        saveToStorage();
    }
    renderPopularShops();
});

function saveToStorage() {
    localStorage.setItem('shopsData', JSON.stringify(shopsData));
}

// ==================== 네비게이션 ====================
function goToAdmin() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    document.getElementById('adminPage').classList.remove('hidden');
    refreshShopList();
}

function goToHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    closeSearchModal();
}

function goToDetail(shopId) {
    const shop = shopsData.find(s => s.id === shopId);
    if (!shop) return;

    // 조회수 증가
    shop.views = (shop.views || 0) + 1;
    saveToStorage();

    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('detailPage').classList.remove('hidden');
    document.getElementById('adminPage').classList.add('hidden');
    renderDetailPage(shop);
}

// ==================== HOME 페이지 ====================
function renderPopularShops() {
    const sorted = [...shopsData].sort((a, b) => (b.views || 0) - (a.views || 0));
    const container = document.getElementById('popularScroll');
    container.innerHTML = sorted.map(shop => `
        <div class="popular-card" onclick="goToDetail(${shop.id})">
            <img src="${shop.images[0]}" alt="${shop.name}">
            <div class="popular-card-info">
                <div class="popular-card-name">${shop.name}</div>
                <div class="popular-card-location">${shop.location}</div>
            </div>
        </div>
    `).join('');
}

// ==================== 검색 기능 ====================
function openSearchModal() {
    document.getElementById('searchModal').classList.remove('hidden');
    document.getElementById('searchModalInput').focus();
}

function closeSearchModal() {
    document.getElementById('searchModal').classList.add('hidden');
}

document.getElementById('searchModalInput')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
        document.getElementById('searchResults').innerHTML = '';
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

    document.getElementById('searchResults').innerHTML = html || '<div style="padding: 20px; text-align: center; color: #999;">결과가 없습니다</div>';
});

document.getElementById('searchModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'searchModal') closeSearchModal();
});

// ==================== 필터링 ====================
function filterByCategory(category) {
    openSearchModal();
    const categoryLabel = getCategoryLabel(category);
    document.getElementById('searchModalInput').value = categoryLabel;
    document.getElementById('searchModalInput').dispatchEvent(new Event('input'));
}

function filterByLocation(location) {
    openSearchModal();
    document.getElementById('searchModalInput').value = location;
    document.getElementById('searchModalInput').dispatchEvent(new Event('input'));
}

// ==================== 상세 페이지 ====================
function renderDetailPage(shop) {
    const categoryMap = {
        nail: '💅 네일샵',
        hair: '✂️ 헤어샵',
        glasses: '👓 안경점',
        vintage: '👔 빈티지샵',
        hanbok: '👗 한복대여',
        goods: '🎁 굿즈샵'
    };

    const moodMap = {
        busy: '분주한 분위기',
        quiet: '조용한 분위기'
    };

    const commMap = {
        easy: '의사소통 원활',
        limited: '의사소통 제한'
    };

    const paymentMap = {
        both: '카드/현금 모두 가능',
        cash: '현금만'
    };

    const carouselHtml = shop.images.map((img, idx) => `
        <div class="carousel-slide">
            <img src="${img}" alt="이미지 ${idx + 1}">
        </div>
    `).join('');

    let html = `
        <div class="detail-carousel">
            <div class="carousel-container" id="carousel" style="transform: translateX(0)">
                ${carouselHtml}
            </div>
            <div class="carousel-counter"><span id="currentSlide">1</span>/<span id="totalSlides">${shop.images.length}</span></div>
        </div>

        <div class="detail-content">
            <div class="breadcrumb">${shop.location} > ${categoryMap[shop.category]}</div>
            <div class="detail-title">${shop.name}</div>
            <div class="detail-price">평균가격 ${shop.price.toLocaleString()}won~</div>

            ${shop.video ? `<div class="detail-video"><iframe src="${shop.video}?autoplay=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` : ''}

            <div class="detail-features">
                <div class="feature-item">
                    <span class="feature-icon">🏪</span>
                    <span>${moodMap[shop.mood]}</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">💬</span>
                    <span>${commMap[shop.communication]}</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">💳</span>
                    <span>${paymentMap[shop.payment]}</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🕐</span>
                    <span>${shop.hours}</span>
                </div>
            </div>

            <div class="detail-section-title">점주 소개</div>
            <div class="detail-description">${shop.description}</div>

            <div class="detail-section-title">위치</div>
            <div id="map" class="detail-map"></div>
            <button class="map-button" onclick="openGoogleMap(${shop.latitude}, ${shop.longitude})">
                ▶ VIEW MORE
            </button>
        </div>
    `;

    document.getElementById('detailContent').innerHTML = html;

    // 지도 렌더링
    renderMap(shop.latitude, shop.longitude);

    // 캐러셀
    setupCarousel(shop.images.length);
}

function renderMap(lat, lng) {
    const mapDiv = document.getElementById('map');
    if (typeof google !== 'undefined') {
        const map = new google.maps.Map(mapDiv, {
            zoom: 15,
            center: { lat, lng }
        });
        new google.maps.Marker({
            position: { lat, lng },
            map: map
        });
    } else {
        mapDiv.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f0f0f0; color:#999;">지도를 불러올 수 없습니다</div>`;
    }
}

function openGoogleMap(lat, lng) {
    window.open(`https://www.google.com/maps/?q=${lat},${lng}`, '_blank');
}

function setupCarousel(totalSlides) {
    let currentSlide = 0;
    const carousel = document.getElementById('carousel');

    document.getElementById('totalSlides').textContent = totalSlides;

    // 좌우 스와이프
    let startX = 0;
    carousel.parentElement.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carousel.parentElement.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50 && currentSlide < totalSlides - 1) {
            currentSlide++;
        } else if (endX - startX > 50 && currentSlide > 0) {
            currentSlide--;
        }
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.getElementById('currentSlide').textContent = currentSlide + 1;
    });
}

// ==================== 관리자 ====================
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('[id$="Tab"]').forEach(t => t.classList.add('hidden'));

    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.remove('hidden');

    if (tab === 'list') refreshShopList();
}

function addShop() {
    const name = document.getElementById('adminShopName').value;
    const category = document.getElementById('adminCategory').value;
    const location = document.getElementById('adminLocation').value;
    const price = parseInt(document.getElementById('adminPrice').value);
    const images = document.getElementById('adminImages').value.split(',').map(s => s.trim());
    const video = document.getElementById('adminVideo').value;
    const mood = document.getElementById('adminMood').value;
    const communication = document.getElementById('adminComm').value;
    const payment = document.getElementById('adminPayment').value;
    const hours = document.getElementById('adminHours').value;
    const description = document.getElementById('adminDescription').value;
    const latitude = parseFloat(document.getElementById('adminLat').value);
    const longitude = parseFloat(document.getElementById('adminLng').value);

    if (!name || !category || !location || !price || !images[0] || !mood || !communication || !payment) {
        alert('모든 필수 항목을 입력하세요');
        return;
    }

    const newShop = {
        id: Math.max(...shopsData.map(s => s.id), 0) + 1,
        name, category, location, price, images, video, mood,
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
    document.getElementById('adminShopName').value = '';
    document.getElementById('adminCategory').value = '';
    document.getElementById('adminLocation').value = '';
    document.getElementById('adminPrice').value = '';
    document.getElementById('adminImages').value = '';
    document.getElementById('adminVideo').value = '';
    document.getElementById('adminMood').value = '';
    document.getElementById('adminComm').value = '';
    document.getElementById('adminPayment').value = '';
    document.getElementById('adminHours').value = '';
    document.getElementById('adminDescription').value = '';
    document.getElementById('adminLat').value = '';
    document.getElementById('adminLng').value = '';
}

function refreshShopList() {
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
    document.getElementById('shopList').innerHTML = html;
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
    document.getElementById('adminImages').value = shop.images.join(',');
    document.getElementById('adminVideo').value = shop.video;
    document.getElementById('adminMood').value = shop.mood;
    document.getElementById('adminComm').value = shop.communication;
    document.getElementById('adminPayment').value = shop.payment;
    document.getElementById('adminHours').value = shop.hours;
    document.getElementById('adminDescription').value = shop.description;
    document.getElementById('adminLat').value = shop.latitude;
    document.getElementById('adminLng').value = shop.longitude;

    document.querySelectorAll('.admin-tab')[0].click();
    window.scrollTo(0, 0);
    alert('수정 후 다시 추가 버튼을 누르면 업데이트됩니다');
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