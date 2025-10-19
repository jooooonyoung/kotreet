let shopsData = [];
let currentLocation = null;
let currentCategory = null;
let previousPage = 'home';

const sampleData = [
    {
        id: 1,
        name: "다비치 안경 명동점",
        category: "glasses",
        location: "명동",
        price: 150000,
        thumbnail: "/img/main_myeongdong.jpg",
        mainImage: "/img/main_myeongdong.jpg",
        images: [
            "/img/main_myeongdong.jpg",
            "/img/main_myeongdong.jpg"
        ],
        video: "",
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
        thumbnail: "/img/main_hongdae.jpg",
        mainImage: "/img/main_hongdae.jpg",
        images: [
            "/img/main_hongdae.jpg",
            "/img/main_hongdae.jpg"
        ],
        video: "",
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
        name: "감성 디저트 강남",
        category: "dessert",
        location: "강남",
        price: 45000,
        thumbnail: "/img/main_gangnam.jpg",
        mainImage: "/img/main_gangnam.jpg",
        images: [
            "/img/main_gangnam.jpg",
            "/img/main_gangnam.jpg"
        ],
        video: "",
        mood: "quiet",
        communication: "easy",
        payment: "both",
        hours: "화~일 10:00 AM - 9:00 PM / 월요일 휴무",
        description: "강남의 감성 디저트 카페입니다.",
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
        thumbnail: "/img/main_seongsu.jpg",
        mainImage: "/img/main_seongsu.jpg",
        images: [
            "/img/main_seongsu.jpg",
            "/img/main_seongsu.jpg"
        ],
        video: "",
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
        thumbnail: "/img/main_myeongdong.jpg",
        mainImage: "/img/main_myeongdong.jpg",
        images: [
            "/img/main_myeongdong.jpg",
            "/img/main_myeongdong.jpg"
        ],
        video: "",
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
    const storedData = localStorage.getItem('shopsData');
    if (storedData) {
        try {
            shopsData = JSON.parse(storedData);
            console.log('localStorage에서 로드:', shopsData.length + '개');
        } catch (e) {
            console.error('데이터 로드 실패:', e);
            shopsData = JSON.parse(JSON.stringify(sampleData));
            saveToStorage();
        }
    } else {
        shopsData = JSON.parse(JSON.stringify(sampleData));
        saveToStorage();
        console.log('샘플 데이터 로드:', shopsData.length + '개');
    }
    
    renderPopularShops();
    loadFooter();
});

window.addEventListener('scroll', () => {
    const floatingBtn = document.querySelector('.floating-btn');
    if (floatingBtn) {
        floatingBtn.classList.toggle('visible', window.scrollY > 200);
    }
});

// ==================== 데이터 관리 ====================
function saveToStorage() {
    try {
        localStorage.setItem('shopsData', JSON.stringify(shopsData));
        console.log('데이터 저장 완료:', shopsData.length + '개');
    } catch (e) {
        console.error('데이터 저장 실패:', e);
        alert('데이터 저장에 실패했습니다.');
    }
}

// ==================== 네비게이션 ====================
function goToDetail(shopId) {
    console.log('goToDetail 호출됨, shopId:', shopId);
    
    const shop = shopsData.find(s => s.id === shopId);
    if (!shop) {
        console.error('가게를 찾을 수 없습니다:', shopId);
        console.log('현재 shopsData:', shopsData);
        alert('가게 정보를 찾을 수 없습니다.');
        return;
    }

    shop.views = (shop.views || 0) + 1;
    saveToStorage();

    const shopNo = String(shopId).padStart(4, '0');
    console.log('이동할 URL:', `detail.html?no=${shopNo}`);
    window.location.href = `detail.html?no=${shopNo}`;
}

function goBack() {
    window.history.back();
}

// ==================== HOME 페이지 ====================
function renderPopularShops() {
    const container = document.getElementById('popularScroll');
    if (!container) return;
    
    const sorted = [...shopsData].sort((a, b) => (b.views || 0) - (a.views || 0));
    
    container.innerHTML = sorted.map(shop => {
        const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
        return `
            <div class="popular-card" onclick="goToDetail(${shop.id})">
                <img src="${imgUrl}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/160x160?text=No+Image'">
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
    const video = document.getElementById('adminVideo').value.trim();
    const mood = document.getElementById('adminMood').value;
    const communication = document.getElementById('adminComm').value;
    const payment = document.getElementById('adminPayment').value;
    const hours = document.getElementById('adminHours').value.trim();
    const description = document.getElementById('adminDescription').value.trim();
    const latitude = parseFloat(document.getElementById('adminLat').value) || 0;
    const longitude = parseFloat(document.getElementById('adminLng').value) || 0;

    if (!name || !category || !location || !price || !thumbnail || !mainImage || !mood || !communication || !payment) {
        alert('모든 필수 항목을 입력하세요');
        return;
    }

    const newShop = {
        id: Math.max(...shopsData.map(s => s.id), 0) + 1,
        name,
        category,
        location,
        price,
        thumbnail,
        mainImage,
        images,
        video,
        mood,
        communication,
        payment,
        hours,
        description,
        latitude,
        longitude,
        views: 0
    };

    shopsData.push(newShop);
    saveToStorage();
    resetForm();
    renderPopularShops();
    refreshShopList();
    alert('가게가 추가되었습니다!\n\n가게명: ' + newShop.name + '\n카테고리: ' + getCategoryLabel(newShop.category) + '\n지역: ' + newShop.location);
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
                <div class="shop-item-meta">${getCategoryLabel(shop.category)} • ${shop.location} • 조회수: ${shop.views || 0}</div>
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
    document.getElementById('adminImages').value = (shop.images && shop.images.length > 2) ? shop.images.slice(2).join(',') : '';
    document.getElementById('adminVideo').value = shop.video || '';
    document.getElementById('adminMood').value = shop.mood;
    document.getElementById('adminComm').value = shop.communication;
    document.getElementById('adminPayment').value = shop.payment;
    document.getElementById('adminHours').value = shop.hours || '';
    document.getElementById('adminDescription').value = shop.description || '';
    document.getElementById('adminLat').value = shop.latitude || '';
    document.getElementById('adminLng').value = shop.longitude || '';

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
        dessert: '디저트 카페',
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