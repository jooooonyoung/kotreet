// ==================== 보안 함수 ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== 전역 변수 ====================
let shopsData = [];
let currentLocation = null;
let currentCategory = null;
let previousPage = 'home';

// 지도 관련 변수
let map = null;
let markers = [];
let selectedShopId = null;
let currentMapCategory = 'all';
let userLocation = null;
let userMarker = null;

// 샘플 데이터
const sampleData = [
    {
        id: 1,
        name: "다비치 안경 명동점",
        category: "glasses",
        location: "명동",
        price: 150000,
        thumbnail: "/img/main_myeongdong.jpg",
        mainImage: "/img/main_myeongdong.jpg",
        images: ["/img/main_myeongdong.jpg", "/img/main_myeongdong.jpg"],
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
        images: ["/img/main_hongdae.jpg", "/img/main_hongdae.jpg"],
        video: "",
        mood: "busy",
        communication: "easy",
        payment: "both",
        hours: "월~일 10:00 AM - 8:00 PM",
        description: "홍대의 최고 트렌드 네일샵입니다.",
        latitude: 37.5519,
        longitude: 126.9255,
        views: 980
    }
];

// ==================== 초기화 ====================
window.addEventListener('load', () => {
    const storedData = localStorage.getItem('shopsData');
    if (storedData) {
        try {
            shopsData = JSON.parse(storedData);
            console.log('localStorageに서 로드:', shopsData.length + '개');
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
    enableDragScroll();
    
    // 지도에서 뒤로가기로 돌아온 경우 자동으로 지도 열기
    const returnToMap = sessionStorage.getItem('returnToMap');
    if (returnToMap === 'true') {
        setTimeout(() => {
            openMapModal();
        }, 500);
    }
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
                <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(shop.name)}" onerror="this.src='https://via.placeholder.com/160x160?text=No+Image'">
                <div class="popular-card-info">
                    <div class="popular-card-name">${escapeHtml(shop.name)}</div>
                    <div class="popular-card-location">${escapeHtml(shop.location)}</div>
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
        <div class="search-result-name">${escapeHtml(shop.name)}</div>
        <div class="search-result-meta">${escapeHtml(getCategoryLabel(shop.category))} • ${escapeHtml(shop.location)}</div>
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

// ==================== 지도 모달 ====================
function openMapModal() {
    const modal = document.getElementById('mapModal');
    const floatingBtn = document.querySelector('.floating-btn');
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        if (floatingBtn) {
            floatingBtn.classList.remove('visible');
        }
        
        setTimeout(() => {
            if (!map) {
                initMap();
            }
            
            const returnToMap = sessionStorage.getItem('returnToMap');
            const mapState = sessionStorage.getItem('mapState');
            
            if (returnToMap === 'true' && mapState) {
                const state = JSON.parse(mapState);
                renderAllShopsOnMap();
                
                setTimeout(() => {
                    map.setCenter(state.center);
                    map.setZoom(state.zoom);
                    
                    if (state.selectedShopId) {
                        const shop = shopsData.find(s => s.id === state.selectedShopId);
                        if (shop) {
                            showShopInfoCard(shop);
                        }
                    }
                }, 300);
                
                sessionStorage.removeItem('returnToMap');
                sessionStorage.removeItem('mapState');
            } else {
                renderAllShopsOnMap();
            }
        }, 300);
    }
}

function closeMapModal() {
    const modal = document.getElementById('mapModal');
    const floatingBtn = document.querySelector('.floating-btn');
    
    if (modal) {
        modal.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        hideShopInfoCard();
        
        if (floatingBtn && window.scrollY > 200) {
            setTimeout(() => {
                floatingBtn.classList.add('visible');
            }, 400);
        }
    }
}

function initMap() {
    const seoulCenter = { lat: 37.5665, lng: 126.9780 };
    
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;
    
    map = new google.maps.Map(mapContainer, {
        zoom: 13,
        center: seoulCenter,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });
    
    initModalDrag();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    icon: {
                        url: '/img/map_me.png',
                        scaledSize: new google.maps.Size(24, 32),
                        anchor: new google.maps.Point(12, 32)
                    },
                    zIndex: 1000
                });
            },
            () => {
                console.log('위치 정보를 가져올 수 없습니다.');
            }
        );
    }
    map.addListener('click', function() {
    const card = document.getElementById('shopInfoCard');
    if (card && !card.classList.contains('hidden')) {
        hideShopInfoCard();
    }
});
}

let dragStartY = 0;
let dragCurrentY = 0;
let isDragging = false;

function initModalDrag() {
    const dragHandle = document.querySelector('.map-modal-drag-handle');
    const modal = document.getElementById('mapModal');
    const mapContainer = document.getElementById('mapContainer');
    
    if (!dragHandle || !modal) return;
    
    const setupDragEvents = (element) => {
        element.addEventListener('touchstart', (e) => {
            isDragging = true;
            dragStartY = e.touches[0].clientY;
            modal.style.transition = 'none';
            e.stopPropagation();
        }, { passive: false });
        
        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            dragCurrentY = e.touches[0].clientY;
            const deltaY = dragCurrentY - dragStartY;
            
            if (deltaY > 0 && deltaY > 20) {
                modal.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                closeMapModal();
                isDragging = false;
            }
        }, { passive: false });
        
        element.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            e.stopPropagation();
            isDragging = false;
        });
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartY = e.clientY;
            modal.style.transition = 'none';
            e.stopPropagation();
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            dragCurrentY = e.clientY;
            const deltaY = dragCurrentY - dragStartY;
            
            if (deltaY > 0 && deltaY > 20) {
                modal.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                closeMapModal();
                isDragging = false;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
        });
    };
    
    setupDragEvents(dragHandle);
    
    mapContainer.addEventListener('touchstart', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        if (e.touches[0].clientY - rect.top < 50) {
            isDragging = true;
            dragStartY = e.touches[0].clientY;
            modal.style.transition = 'none';
            e.stopPropagation();
        }
    }, { passive: false });
    
    mapContainer.addEventListener('mousedown', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        if (e.clientY - rect.top < 50) {
            isDragging = true;
            dragStartY = e.clientY;
            modal.style.transition = 'none';
            e.stopPropagation();
            e.preventDefault();
        }
    });
}

window.addEventListener('load', () => {
    const header = document.querySelector('header');
    if (header) {
        header.addEventListener('click', (e) => {
            const modal = document.getElementById('mapModal');
            if (modal && modal.classList.contains('active')) {
                if (!e.target.closest('.hamburger-btn') && !e.target.closest('.logo')) {
                    closeMapModal();
                }
            }
        });
    }
});

function filterMapCategory(category) {
    currentMapCategory = category;
    
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    const filteredShops = category === 'all' 
        ? shopsData 
        : shopsData.filter(s => s.category === category);
    
    const categoryIcons = {
        nail: '/img/map_nail.png',
        glasses: '/img/map_glasses.png',
        dessert: '/img/map_dessert.png',
        hanbok: '/img/map_hanbok.png',
        vintage: '/img/map_vintage.png',
        goods: '/img/map_goods.png'
    };
    
    filteredShops.forEach(shop => {
        if (!shop.latitude || !shop.longitude) return;
        
        const iconUrl = categoryIcons[shop.category] || '/img/map_goods.png';
        
        const marker = new google.maps.Marker({
            position: { lat: shop.latitude, lng: shop.longitude },
            map: map,
            title: shop.name,
            icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(24, 32),
                anchor: new google.maps.Point(12, 32)
            }
        });
        
        marker.addListener('click', () => {
            showShopInfoCard(shop);
            map.panTo(marker.getPosition());
        });
        
        markers.push(marker);
    });
    
    console.log(`${category} 카테고리: ${markers.length}개 마커 표시됨`);
}

function renderAllShopsOnMap() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    const categoryIcons = {
        nail: '/img/map_nail.png',
        glasses: '/img/map_glasses.png',
        dessert: '/img/map_dessert.png',
        hanbok: '/img/map_hanbok.png',
        vintage: '/img/map_vintage.png',
        goods: '/img/map_goods.png'
    };
    
    shopsData.forEach(shop => {
        if (!shop.latitude || !shop.longitude) return;
        
        const iconUrl = categoryIcons[shop.category] || '/img/map_goods.png';
        
        const marker = new google.maps.Marker({
            position: { lat: shop.latitude, lng: shop.longitude },
            map: map,
            title: shop.name,
            icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(24, 32),
                anchor: new google.maps.Point(12, 32)
            }
        });
        
        marker.addListener('click', () => {
            showShopInfoCard(shop);
            map.panTo(marker.getPosition());
        });
        
        markers.push(marker);
    });
}

function showShopInfoCard(shop) {
    selectedShopId = shop.id;
    const card = document.getElementById('shopInfoCard');
    const imagesContainer = document.getElementById('shopInfoImages');
    
    if (!card || !imagesContainer) return;
    
    const images = shop.images && shop.images.length > 0 ? shop.images : [shop.thumbnail || shop.mainImage];
    
    // 이미지 생성
    imagesContainer.innerHTML = images.map(img => `
        <div class="shop-info-image-item">
            <img src="${img}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
        </div>
    `).join('');
    
    // 기존 인디케이터 제거
    const oldIndicators = card.querySelector('.shop-info-image-indicators');
    if (oldIndicators) {
        oldIndicators.remove();
    }
    
    // 인디케이터 추가 (카드에 직접 추가, 이미지 컨테이너가 아님!)
    if (images.length > 1) {
        const indicators = document.createElement('div');
        indicators.className = 'shop-info-image-indicators';
        indicators.innerHTML = images.map((_, index) => 
            `<div class="shop-info-image-indicator ${index === 0 ? 'active' : ''}"></div>`
        ).join('');
        
        const imagesWrapper = document.getElementById('shopInfoImagesWrapper');
imagesWrapper.appendChild(indicators);
        
        // 스크롤 이벤트
        const handleScroll = () => {
            const scrollLeft = imagesContainer.scrollLeft;
            const itemWidth = imagesContainer.offsetWidth;
            const currentIndex = Math.round(scrollLeft / itemWidth);
            
            indicators.querySelectorAll('.shop-info-image-indicator').forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        imagesContainer.removeEventListener('scroll', handleScroll);
        imagesContainer.addEventListener('scroll', handleScroll);
    }
    
    document.getElementById('shopInfoName').textContent = shop.name;
    document.getElementById('shopInfoLocation').textContent = shop.location;
    
    const priceText = shop.priceMax ? 
        `<span>평균 </span>₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
        `<span>평균 </span>₩${shop.price.toLocaleString()}~`;
    document.getElementById('shopInfoPrice').innerHTML = priceText;
    
    card.classList.remove('hidden');
    
    // body에 modal-open 클래스 추가
    document.body.classList.add('modal-open');
    
    // 초기 위치 설정 (화면 밖)
    card.style.transform = 'translateY(100%)';
    card.style.opacity = '0';
    
    // 다음 프레임에서 슬라이드 업 애니메이션
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        });
    });
    
    // 지도 중심 이동 (카드 높이 고려)
    const shopPosition = new google.maps.LatLng(shop.latitude, shop.longitude);

    
    // 카드가 나타난 후 위치 조정
    setTimeout(() => {
        // 카드 높이 (280px) + 여백 (16px) = 296px
        // 화면 높이의 약 40% 정도를 차지하므로
        // 마커가 보이는 영역의 중심(상단 60% 영역의 중간)에 오도록 조정

    const cardHeight = 20; 
    map.panBy(0, cardHeight); // 아래로 이동할 픽셀
    map.panTo(new google.maps.LatLng(shop.latitude, shop.longitude));
        
        map.panBy(0, offset);
    }, 100);
}

function hideShopInfoCard() {
    const card = document.getElementById('shopInfoCard');
    if (card) {
        // 슬라이드 다운 애니메이션
        card.style.transform = 'translateY(100%)';
        card.style.opacity = '0';
        
        // 300ms 후 hidden 클래스 추가
function hideShopInfoCard() {
    const card = document.getElementById('shopInfoCard');
    if (card) {
        // body에서 modal-open 클래스 제거
        document.body.classList.remove('modal-open');
        
        // 슬라이드 다운 애니메이션
        card.style.transform = 'translateY(100%)';
        card.style.opacity = '0';
        
        // 300ms 후 hidden 클래스 추가
        setTimeout(() => {
            card.classList.add('hidden');
        }, 300);
    }
    selectedShopId = null;
}
                lng: map.getCenter().lng()
            },
            zoom: map.getZoom(),
            selectedShopId: selectedShopId
        }));
        window.location.href = `detail.html?no=${shopNo}`;
    }
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function goToMyLocation() {
    if (userLocation && map) {
        map.setCenter(userLocation);
        map.setZoom(15);
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                if (userMarker) {
                    userMarker.setPosition(userLocation);
                } else {
                    userMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        icon: {
                            url: '/img/map_me.png',
                            scaledSize: new google.maps.Size(24, 32),
                            anchor: new google.maps.Point(12, 32)
                        },
                        zIndex: 1000,
                        animation: null
                    });
                }
                
                map.setCenter(userLocation);
                map.setZoom(15);
            },
            () => {
                alert('위치 정보를 가져올 수 없습니다.');
            }
        );
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

    const editingShopId = sessionStorage.getItem('editingShopId');
    
    let newShop;
    
    if (editingShopId) {
        const existingShop = shopsData.find(s => s.id === parseInt(editingShopId));
        const shopViews = existingShop ? existingShop.views : 0;
        
        shopsData = shopsData.filter(s => s.id !== parseInt(editingShopId));
        
        newShop = {
            id: parseInt(editingShopId),
            name, category, location, price,
            thumbnail, mainImage, images, video,
            mood, communication, payment, hours,
            description, latitude, longitude,
            views: shopViews
        };
        
        sessionStorage.removeItem('editingShopId');
        
    } else {
        newShop = {
            id: Math.max(...shopsData.map(s => s.id), 0) + 1,
            name, category, location, price,
            thumbnail, mainImage, images, video,
            mood, communication, payment, hours,
            description, latitude, longitude,
            views: 0
        };
    }

    shopsData.push(newShop);
    saveToStorage();
    resetForm();
    renderPopularShops();
    refreshShopList();
    
    const actionText = editingShopId ? '수정' : '추가';
    alert(`가게가 ${actionText}되었습니다!\n\n가게명: ${newShop.name}\n카테고리: ${getCategoryLabel(newShop.category)}\n지역: ${newShop.location}\nID: ${newShop.id}`);
}

function resetForm() {
    const fields = ['adminShopName', 'adminCategory', 'adminLocation', 'adminPrice', 'adminThumbnail', 'adminMainImage', 'adminImages', 'adminVideo', 'adminMood', 'adminComm', 'adminPayment', 'adminHours', 'adminDescription', 'adminLat', 'adminLng'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) element.value = '';
    });
    
    sessionStorage.removeItem('editingShopId');
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

    const editingShopId = id;
    sessionStorage.setItem('editingShopId', editingShopId);

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

    document.querySelectorAll('.admin-tab')[0]?.click();
    window.scrollTo(0, 0);
    alert('수정 후 "가게 추가" 버튼을 눌러주세요\n(기존 ID: ' + id + ' 유지됨)');
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

// ==================== 드래그 스크롤 기능 ====================
function enableDragScroll() {
    const scrollContainers = document.querySelectorAll('.scroll-container, .popular-scroll');
    
    scrollContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5;
            container.scrollLeft = scrollLeft - walk;
        });
        
        container.style.cursor = 'grab';
    });
}

// ==================== Google Maps API 초기화 콜백 ====================
window.initializeApp = function() {
    console.log('Google Maps API loaded');
};


function openDirections(event) {
    event.stopPropagation(); // 부모 클릭 이벤트 방지
    
    if (!selectedShopId) return;
    
    const shop = shopsData.find(s => s.id === selectedShopId);
    if (!shop || !shop.latitude || !shop.longitude) {
        alert('위치 정보를 찾을 수 없습니다.');
        return;
    }
    
    // 사용자 위치가 있으면 출발지로 사용
    if (userLocation) {
        // Google Maps 길찾기 (출발지 → 목적지)
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${shop.latitude},${shop.longitude}&travelmode=transit`;
        window.open(url, '_blank');
    } else {
        // 사용자 위치 없으면 목적지만 표시
        const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}&travelmode=transit`;
        window.open(url, '_blank');
    }
}