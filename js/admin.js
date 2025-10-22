(function() {
    const path = window.location.pathname;
    const search = window.location.search;
    
    if (path.endsWith('.html')) {
        const newPath = path.replace('.html', '');
        window.history.replaceState(null, '', newPath + search);
    }
})();

let shopsData = [];

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
    alert('가게가 추가되었습니다!');
}

function resetForm() {
    document.getElementById('adminShopName').value = '';
    document.getElementById('adminCategory').value = '';
    document.getElementById('adminLocation').value = '';
    document.getElementById('adminPrice').value = '';
    document.getElementById('adminThumbnail').value = '';
    document.getElementById('adminMainImage').value = '';
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
        nail: '네일샵',
        hair: '헤어샵',
        glasses: '안경점',
        vintage: '빈티지샵',
        hanbok: '한복대여',
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
            // 공유 API 미지원시 URL 복사
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 복사되었습니다!');
            }).catch(() => {
                alert('링크 복사에 실패했습니다.');
            });
        }
    }
}

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