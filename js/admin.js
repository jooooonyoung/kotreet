function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let shopsData = [];
let editingShopId = null;
let editingShopViews = 0;

window.addEventListener('load', () => {
    if (localStorage.getItem('shopsData')) {
        shopsData = JSON.parse(localStorage.getItem('shopsData'));
    }
    refreshShopList();
});

function saveToStorage() {
    localStorage.setItem('shopsData', JSON.stringify(shopsData));
}

function goToHome() {
    window.location.href = 'index.html';
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.add('hidden'));

    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.remove('hidden');

    if (tab === 'list') refreshShopList();
}

function addShop() {
    const name = document.getElementById('adminShopName').value;
    const category = document.getElementById('adminCategory').value;
    const location = document.getElementById('adminLocation').value;
    const price = parseInt(document.getElementById('adminPrice').value);
    const priceMax = parseInt(document.getElementById('adminPriceMax').value);
    
    if (!name || name.length > 100) {
        alert('❌ 가게명은 1~100자 이내여야 합니다.');
        return;
    }
    
    if (!price || price < 0 || price > 10000000) {
        alert('❌ 최소 가격은 0~10,000,000원 이내여야 합니다.');
        return;
    }
    
    if (!priceMax || priceMax < 0 || priceMax > 10000000) {
        alert('❌ 최대 가격은 0~10,000,000원 이내여야 합니다.');
        return;
    }
    
    if (priceMax < price) {
        alert('❌ 최대 가격은 최소 가격보다 커야 합니다.');
        return;
    }
    
    const latitude = parseFloat(document.getElementById('adminLat').value);
    const longitude = parseFloat(document.getElementById('adminLng').value);
    
    if (latitude && (latitude < 33 || latitude > 43)) {
        alert('❌ 위도는 33~43 범위여야 합니다 (대한민국 영역).');
        return;
    }
    
    if (longitude && (longitude < 124 || longitude > 132)) {
        alert('❌ 경도는 124~132 범위여야 합니다 (대한민국 영역).');
        return;
    }
    
    const thumbnail = document.getElementById('adminThumbnail').value.trim();
    const additionalImagesText = document.getElementById('adminImages').value;
    
    const thumbnails = thumbnail.split('\n').map(s => s.trim()).filter(s => s);
    const carouselImages = additionalImagesText.split('\n').map(s => s.trim()).filter(s => s);
    const images = [...carouselImages]; // 캐러셀 이미지만 images 배열에
    const video = document.getElementById('adminVideo').value;
    const mood = document.getElementById('adminMood').value;
    
    // 언어 체크박스에서 선택된 값들을 배열로 가져오기
    const communicationCheckboxes = document.querySelectorAll('input[name="adminComm"]:checked');
    const communication = Array.from(communicationCheckboxes).map(cb => cb.value);
    
    const payment = document.getElementById('adminPayment').value;
    const locationDetail = document.getElementById('adminLocationDetail').value;
    const hours = document.getElementById('adminHours').value;
    const description = document.getElementById('adminDescription').value;
    
    // 지역별 인기 순서
    const regionOrder = parseInt(document.getElementById('adminRegionOrder') ? document.getElementById('adminRegionOrder').value : 0) || 0;
    
    // 코트릿 추천 가게 순서
    const recommendedOrder = parseInt(document.getElementById('adminRecommendedOrder') ? document.getElementById('adminRecommendedOrder').value : 0) || 0;
    
    // 숨겨진 명소 순서
    const hiddenOrder = parseInt(document.getElementById('adminHiddenOrder') ? document.getElementById('adminHiddenOrder').value : 0) || 0;

    if (!name || !category || !location || !price || !priceMax || thumbnails.length === 0 || !mood || communication.length === 0 || !payment) {
        alert('모든 필수 항목을 입력하세요 (언어는 최소 1개 이상 선택)');
        return;
    }

    if (editingShopId) {
        const index = shopsData.findIndex(s => s.id === editingShopId);
        if (index !== -1) {
            shopsData[index] = {
                id: editingShopId,
                name, category, location, price, priceMax,
                thumbnail: thumbnails[0] || '', // 첫 번째 썸네일을 기본으로
                thumbnails, // 모든 썸네일 저장
                images, video, mood,
                communication, payment, locationDetail, hours, description, latitude, longitude,
                views: editingShopViews,
                regionOrder,
                recommendedOrder,
                hiddenOrder,
                createdAt: shopsData[index].createdAt
            };
            alert('가게 정보가 수정되었습니다!');
        }
    } else {
        const newShop = {
            id: Math.max(...shopsData.map(s => s.id), 0) + 1,
            name, category, location, price, priceMax,
            thumbnail: thumbnails[0] || '', // 첫 번째 썸네일을 기본으로
            thumbnails, // 모든 썸네일 저장
            images, video, mood,
            communication, payment, locationDetail, hours, description, latitude, longitude,
            views: 0,
            regionOrder,
            recommendedOrder,
            hiddenOrder,
            createdAt: new Date().toISOString()
        };
        shopsData.push(newShop);
        alert('가게가 추가되었습니다!');
    }

    saveToStorage();
    resetForm();
    refreshShopList();
    editingShopId = null;
    editingShopViews = 0;
}

function resetForm() {
    document.getElementById('adminShopName').value = '';
    document.getElementById('adminCategory').value = '';
    document.getElementById('adminLocation').value = '';
    document.getElementById('adminPrice').value = '';
    document.getElementById('adminPriceMax').value = '';
    document.getElementById('adminThumbnail').value = '';
    document.getElementById('adminImages').value = '';
    document.getElementById('adminVideo').value = '';
    document.getElementById('adminMood').value = '';
    
    // 모든 언어 체크박스 해제
    document.querySelectorAll('input[name="adminComm"]').forEach(cb => cb.checked = false);
    
    document.getElementById('adminPayment').value = '';
    document.getElementById('adminLocationDetail').value = '';
    document.getElementById('adminHours').value = '';
    document.getElementById('adminDescription').value = '';
    document.getElementById('adminLat').value = '';
    document.getElementById('adminLng').value = '';
    
    if (document.getElementById('adminRegionOrder')) {
        document.getElementById('adminRegionOrder').value = '0';
    }
    
    if (document.getElementById('adminRecommendedOrder')) {
        document.getElementById('adminRecommendedOrder').value = '0';
    }
    
    if (document.getElementById('adminHiddenOrder')) {
        document.getElementById('adminHiddenOrder').value = '0';
    }
    
    editingShopId = null;
    editingShopViews = 0;
}

function refreshShopList() {
    const container = document.getElementById('shopList');
    if (!container) return;
    
    const sortedShops = [...shopsData].sort((a, b) => a.id - b.id);
    
    const html = sortedShops.map(shop => {
        const regionBadge = shop.regionOrder > 0 ? `<span style="background:#4CAF50;color:white;padding:2px 6px;border-radius:4px;font-size:11px;margin-left:4px;">⭐${shop.regionOrder}</span>` : '';
        return `
        <div class="shop-item">
            <div class="shop-item-info">
                <div class="shop-item-name">#${shop.id} ${escapeHtml(shop.name)}${regionBadge}</div>
                <div class="shop-item-meta">${escapeHtml(getCategoryLabel(shop.category))} • ${escapeHtml(shop.location)} • 조회수: ${shop.views || 0}</div>
            </div>
            <div class="shop-item-actions">
                <button class="shop-item-btn shop-item-edit" onclick="editShop(${shop.id})">수정</button>
                <button class="shop-item-btn shop-item-delete" onclick="deleteShop(${shop.id})">삭제</button>
            </div>
        </div>
    `;
    }).join('');
    container.innerHTML = html;
}

function deleteShop(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        shopsData = shopsData.filter(s => s.id !== id);
        saveToStorage();
        refreshShopList();
    }
}

function editShop(id) {
    const shop = shopsData.find(s => s.id === id);
    if (!shop) return;

    editingShopId = id;
    editingShopViews = shop.views || 0;

    document.getElementById('adminShopName').value = shop.name;
    document.getElementById('adminCategory').value = shop.category;
    document.getElementById('adminLocation').value = shop.location;
    document.getElementById('adminPrice').value = shop.price;
    document.getElementById('adminPriceMax').value = shop.priceMax || shop.price;
    
    // thumbnails 배열이 있으면 그걸 사용, 없으면 기존 thumbnail 사용
    const thumbnailValue = shop.thumbnails ? shop.thumbnails.join('\n') : (shop.thumbnail || '');
    document.getElementById('adminThumbnail').value = thumbnailValue;
    
    document.getElementById('adminImages').value = (shop.images || []).join('\n');
    document.getElementById('adminVideo').value = shop.video || '';
    document.getElementById('adminMood').value = shop.mood;
    
    // 언어 체크박스 설정
    document.querySelectorAll('input[name="adminComm"]').forEach(cb => cb.checked = false);
    const communications = Array.isArray(shop.communication) ? shop.communication : [shop.communication];
    communications.forEach(lang => {
        const checkbox = document.querySelector(`input[name="adminComm"][value="${lang}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    document.getElementById('adminPayment').value = shop.payment;
    document.getElementById('adminLocationDetail').value = shop.locationDetail || '';
    document.getElementById('adminHours').value = shop.hours;
    document.getElementById('adminDescription').value = shop.description;
    document.getElementById('adminLat').value = shop.latitude || '';
    document.getElementById('adminLng').value = shop.longitude || '';

    if (document.getElementById('adminRegionOrder')) {
        document.getElementById('adminRegionOrder').value = shop.regionOrder || 0;
    }
    
    if (document.getElementById('adminRecommendedOrder')) {
        document.getElementById('adminRecommendedOrder').value = shop.recommendedOrder || 0;
    }
    
    if (document.getElementById('adminHiddenOrder')) {
        document.getElementById('adminHiddenOrder').value = shop.hiddenOrder || 0;
    }
    
    document.querySelectorAll('.admin-tab')[0].click();
    window.scrollTo(0, 0);
    alert('수정 후 "가게 추가" 버튼을 눌러주세요');
}

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
            } else {
                alert('올바른 JSON 형식이 아닙니다');
            }
        } catch (err) {
            alert('JSON 파일을 읽을 수 없습니다');
        }
    };
    reader.readAsText(file);
}

function getCategoryLabel(category) {
    const map = {
        beauty: '뷰티',
        dessert: '디저트 카페',
        glasses: '안경점',
        vintage: '음식점',
        cloth: '의류',
        goods: '굿즈샵'
    };
    return map[category] || category;
}
// 모든 조회수 초기화 함수
function resetAllViews() {
    if (!confirm('⚠️ 정말로 모든 가게의 조회수를 0으로 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')) {
        return;
    }
    
    shopsData = shopsData.map(shop => ({
        ...shop,
        views: 0
    }));
    
    saveToStorage();
    alert('✅ 모든 조회수가 0으로 초기화되었습니다.');
    refreshShopList();
}