function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let shopsData = [];
let editingShopId = null; // 수정 중인 가게 ID 저장
let editingShopViews = 0; // 수정 중인 가게의 조회수 저장

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
    
    const mainImageText = document.getElementById('adminMainImage').value.trim();
    const thumbnailText = document.getElementById('adminThumbnail').value.trim();
    
    // 메인 이미지 배열 생성 (index, 카테고리 페이지용)
    const mainImages = mainImageText.split('\n').map(s => s.trim()).filter(s => s);
    
    // 썸뷰티 이미지 배열 생성 (상세 페이지용)
    const thumbnailImages = thumbnailText.split('\n').map(s => s.trim()).filter(s => s);
    
    // 첫 번째 메인 이미지를 thumbnail로, 모든 썸뷰티 이미지를 images로 저장
    const thumbnail = mainImages[0] || '';
    const images = thumbnailImages.length > 0 ? thumbnailImages : mainImages;
    const mainImage = mainImages[0] || '';
    
    const video = document.getElementById('adminVideo').value;
    const mood = document.getElementById('adminMood').value;
    
    // 언어 체크박스에서 선택된 값들 가져오기
    const commCheckboxes = document.querySelectorAll('#adminComm input[type="checkbox"]:checked');
    const communication = Array.from(commCheckboxes).map(cb => cb.value);
    
    const payment = document.getElementById('adminPayment').value;
    const locationDetail = document.getElementById('adminLocationDetail').value;
    const hours = document.getElementById('adminHours').value;
    const description = document.getElementById('adminDescription').value;

    if (!name || !category || !location || !price || !priceMax || !thumbnail || !mainImage || !mood || communication.length === 0 || !payment) {
        alert('모든 필수 항목을 입력하세요 (언어는 최소 1개 이상 선택)');
        return;
    }

    if (editingShopId) {
        // 수정 모드: 기존 가게 업데이트
        const index = shopsData.findIndex(s => s.id === editingShopId);
        if (index !== -1) {
            shopsData[index] = {
                id: editingShopId,
                name, category, location, price, priceMax,
                thumbnail, mainImage,
                images, video, mood,
                communication, payment, locationDetail, hours, description, latitude, longitude,
                views: editingShopViews,
                createdAt: shopsData[index].createdAt // 생성일 유지
            };
            alert('가게 정보가 수정되었습니다!');
        }
    } else {
        // 신규 추가 모드
        const newShop = {
            id: Math.max(...shopsData.map(s => s.id), 0) + 1,
            name, category, location, price, priceMax,
            thumbnail, mainImage,
            images, video, mood,
            communication, payment, locationDetail, hours, description, latitude, longitude,
            views: 0,
            createdAt: new Date().toISOString() // 생성일 기록
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
    document.getElementById('adminMainImage').value = '';
    document.getElementById('adminThumbnail').value = '';
    document.getElementById('adminVideo').value = '';
    document.getElementById('adminMood').value = '';
    
    // 언어 체크박스 모두 해제
    document.querySelectorAll('#adminComm input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    document.getElementById('adminPayment').value = '';
    document.getElementById('adminLocationDetail').value = '';
    document.getElementById('adminHours').value = '';
    document.getElementById('adminDescription').value = '';
    document.getElementById('adminLat').value = '';
    document.getElementById('adminLng').value = '';
    editingShopId = null; // 수정 모드 해제
    editingShopViews = 0; // 조회수 초기화
}

function refreshShopList() {
    const container = document.getElementById('shopList');
    if (!container) return;
    
    // ID 순서로 정렬 (생성 순서 유지)
    const sortedShops = [...shopsData].sort((a, b) => a.id - b.id);
    
    const html = sortedShops.map(shop => `
        <div class="shop-item">
            <div class="shop-item-info">
                <div class="shop-item-name">#${shop.id} ${escapeHtml(shop.name)}</div>
                <div class="shop-item-meta">${escapeHtml(getCategoryLabel(shop.category))} • ${escapeHtml(shop.location)} • 조회수: ${shop.views || 0}</div>
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
    }
}

function editShop(id) {
    const shop = shopsData.find(s => s.id === id);
    if (!shop) return;

    editingShopId = id; // 수정 중인 ID 저장
    editingShopViews = shop.views || 0; // 조회수 저장

    document.getElementById('adminShopName').value = shop.name;
    document.getElementById('adminCategory').value = shop.category;
    document.getElementById('adminLocation').value = shop.location;
    document.getElementById('adminPrice').value = shop.price;
    document.getElementById('adminPriceMax').value = shop.priceMax || shop.price;
    
    // 메인 이미지 필드에 mainImage 또는 thumbnail 설정
    document.getElementById('adminMainImage').value = shop.mainImage || shop.thumbnail || '';
    
    // 썸뷰티 필드에 images 배열 설정 (또는 mainImage를 대체로 사용)
    const thumbnailImages = shop.images && shop.images.length > 0 
        ? shop.images.join('\n') 
        : (shop.mainImage || shop.thumbnail || '');
    document.getElementById('adminThumbnail').value = thumbnailImages;
    
    document.getElementById('adminVideo').value = shop.video || '';
    document.getElementById('adminMood').value = shop.mood;
    
    // 언어 체크박스 설정
    document.querySelectorAll('#adminComm input[type="checkbox"]').forEach(cb => cb.checked = false);
    const commArray = Array.isArray(shop.communication) ? shop.communication : [shop.communication];
    commArray.forEach(lang => {
        const checkbox = document.querySelector(`#adminComm input[value="${lang}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    document.getElementById('adminPayment').value = shop.payment;
    document.getElementById('adminLocationDetail').value = shop.locationDetail || '';
    document.getElementById('adminHours').value = shop.hours;
    document.getElementById('adminDescription').value = shop.description;
    document.getElementById('adminLat').value = shop.latitude || '';
    document.getElementById('adminLng').value = shop.longitude || '';

    // 배열에서 삭제하지 않음! (순서 유지)
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
        hair: '헤어샵',
        dessert: '디저트 카페',
        glasses: '안경점',
        food: '음식점',
        cloth: '의류',
        goods: '굿즈샵'
    };
    return map[category] || category;
}

function shareShop() {
    if (currentShop) {
        const url = window.location.href;
        const title = currentShop.name;
        const text = `${currentShop.name} - ${currentShop.location}의 ${getCategoryLabel(currentShop.category)}`;

        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: url
            }).catch(err => console.log('공유 취소'));
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 복사되었습니다!');
            }).catch(() => {
                alert('링크 복사에 실패했습니다.');
            });
        }
    }
}