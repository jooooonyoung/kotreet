function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let shopsData = [];
let currentShop = null;
let detailMap = null;
let modalMap = null;
let modalMarker = null;

// 페이지 로드
const urlParams = new URLSearchParams(window.location.search);
const shopNo = urlParams.get('no');

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
    
    if (shopNo) {
        const shopId = parseInt(shopNo, 10);
        currentShop = shopsData.find(s => s.id === shopId);
        
        if (currentShop) {
            currentShop.views = (currentShop.views || 0) + 1;
            localStorage.setItem('shopsData', JSON.stringify(shopsData));
            renderDetailPage(currentShop);
        } else {
            alert('가게 정보를 찾을 수 없습니다.');
            window.location.href = '/';
        }
    } else {
        alert('잘못된 접근입니다.');
        window.location.href = '/';
    }
});

function renderDetailPage(shop) {
    const categoryMap = {
        beauty: '뷰티',
        dessert: '디저트 카페',
        glasses: '안경점',
        food: '음식점',
        cloth: '의류',
        goods: '굿즈샵'
    };

    const moodMap = {
        busy: '분주한 분위기',
        quiet: '조용한 분위기'
    };

    const languageMap = {
        'KR': '<span class="lang-icon">KR</span>',
        'EN': '<span class="lang-icon">EN</span>',
        'JP': '<span class="lang-icon">JP</span>',
        'CH': '<span class="lang-icon">CH</span>',
        'CH-TW': '<span class="lang-icon">TW</span>',
        'TH': '<span class="lang-icon">TH</span>',
        'VN': '<span class="lang-icon">VN</span>',
        'PH': '<span class="lang-icon">PH</span>',
        'ID': '<span class="lang-icon">ID</span>',
        'FR': '<span class="lang-icon">FR</span>',
        'DE': '<span class="lang-icon">DE</span>',
        'ES': '<span class="lang-icon">ES</span>',
        'RU': '<span class="lang-icon">RU</span>',
        'MY': '<span class="lang-icon">MY</span>',
        'AR': '<span class="lang-icon">AR</span>'
    };

    const paymentMap = {
        both: '카드/현금 모두 가능',
        cash: '현금만'
    };

    document.getElementById('detailBreadcrumb').textContent = `${shop.location} > ${categoryMap[shop.category]}`;
    document.getElementById('detailTitle').textContent = shop.name;

    const priceText = shop.priceMax ? 
        `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
        `₩${shop.price.toLocaleString()}~`;
    document.getElementById('detailPrice').textContent = priceText;

    const carouselContainer = document.getElementById('carousel');
    const images = shop.images && shop.images.length > 0 ? shop.images : [shop.thumbnail || shop.mainImage];
    
    carouselContainer.innerHTML = images.map(img => `
        <div class="carousel-slide">
            <img src="${img}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/800x600?text=No+Image'">
        </div>
    `).join('');
    
    document.getElementById('totalSlides').textContent = images.length;
    setupCarousel(images.length);

    if (shop.video) {
        document.getElementById('detailVideo').style.display = 'block';
        document.getElementById('detailVideoFrame').src = shop.video + '?autoplay=0';
    }

    document.getElementById('detailMood').textContent = moodMap[shop.mood] || shop.mood;
    
    const commValue = Array.isArray(shop.communication) 
        ? shop.communication.map(lang => languageMap[lang] || lang).join(' ')
        : (languageMap[shop.communication] || shop.communication);
    document.getElementById('detailComm').innerHTML = commValue;
    
    document.getElementById('detailPayment').textContent = paymentMap[shop.payment] || shop.payment;
    
    if (shop.locationDetail) {
        document.getElementById('detailLocationDetail').textContent = shop.locationDetail;
        document.getElementById('detailLocationDetail').parentElement.style.display = '';
    } else {
        document.getElementById('detailLocationDetail').parentElement.style.display = 'none';
    }
    
    document.getElementById('detailHours').textContent = shop.hours || '영업시간 미정';
    document.getElementById('detailDescription').textContent = shop.description || '가게 설명이 없습니다.';
    
    if (shop.latitude && shop.longitude) {
        initDetailMap(shop.latitude, shop.longitude);
        document.getElementById('mapButton').onclick = function() {
            openDirections(shop.latitude, shop.longitude);
        };
    }
}

function setupCarousel(totalSlides) {
    let currentSlide = 0;
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    let startX = 0;
    const carouselParent = carousel.parentElement;

    carouselParent.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselParent.addEventListener('touchend', (e) => {
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

// 상세 페이지 작은 지도
function initDetailMap(lat, lng) {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof google === 'undefined') return;
    
    detailMap = new google.maps.Map(mapElement, {
        center: { lat: lat, lng: lng },
        zoom: 13,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        scaleControl: false,
        rotateControl: false,
        gestureHandling: 'greedy',
        language: 'en',
        styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] }
        ]
    });
    
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: detailMap,
        title: currentShop?.name || '가게 위치'
    });
    
    mapElement.style.cursor = 'pointer';
    mapElement.addEventListener('click', function(e) {
        if (!e.target.closest('.gm-control-active') && 
            !e.target.closest('.gm-bundled-control') &&
            !e.target.closest('button')) {
            openDetailMapModal();
        }
    });
}

// 모달 열기
function openDetailMapModal() {
    if (!currentShop || !currentShop.latitude || !currentShop.longitude) {
        alert('위치 정보가 없습니다.');
        return;
    }
    
    const modal = document.getElementById('detailMapModal');
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        initModalMap();
    }, 100);
}

// 모달 지도 초기화
function initModalMap() {
    if (!currentShop || !currentShop.latitude || !currentShop.longitude) return;
    
    const mapContainer = document.getElementById('detailMapContainer');
    if (!mapContainer) return;
    
    if (!modalMap) {
        modalMap = new google.maps.Map(mapContainer, {
            center: { lat: currentShop.latitude, lng: currentShop.longitude },
            zoom: 16,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            rotateControl: false,
            scaleControl: false,
            gestureHandling: 'greedy',
            language: 'en',
            styles: [
                { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                { featureType: 'transit', stylers: [{ visibility: 'off' }] }
            ]
        });
        
        setupModalDrag();
    } else {
        modalMap.setCenter({ lat: currentShop.latitude, lng: currentShop.longitude });
    }
    
    if (modalMarker) {
        modalMarker.setMap(null);
    }
    
    modalMarker = new google.maps.Marker({
        position: { lat: currentShop.latitude, lng: currentShop.longitude },
        map: modalMap,
        title: currentShop.name
    });
}

// 모달 드래그 설정
function setupModalDrag() {
    const modal = document.getElementById('detailMapModal');
    const dragHandle = modal.querySelector('.detail-map-modal-drag-handle');
    
    if (!dragHandle) return;
    
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    dragHandle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
    });
    
    dragHandle.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY - startY;
        if (currentY > 0) {
            modal.style.transform = `translateY(${currentY}px)`;
        }
    });
    
    dragHandle.addEventListener('touchend', () => {
        if (currentY > 100) {
            closeDetailMapModal();
        } else {
            modal.style.transform = '';
        }
        isDragging = false;
        currentY = 0;
    });
}

// 모달 닫기
function closeDetailMapModal() {
    const modal = document.getElementById('detailMapModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.transform = '';
        document.body.style.overflow = '';
    }
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


// 모달에서 길찾기
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


// 공유
function shareShop() {
    if (currentShop) {
        const url = window.location.href;
        const title = currentShop.name;
        const categoryMap = {
            beauty: '뷰티',
            dessert: '디저트 카페',
            glasses: '안경점',
            food: '음식점',
            cloth: '의류',
            goods: '굿즈샵'
        };
        const text = `${currentShop.name} - ${currentShop.location}의 ${categoryMap[currentShop.category]}`;

        if (navigator.share) {
            navigator.share({ title: title, text: text, url: url }).catch(err => console.log('공유 취소'));
        } else {
            navigator.clipboard.writeText(url).then(() => {
                alert('링크가 복사되었습니다!');
            }).catch(() => {
                alert('링크 복사에 실패했습니다.');
            });
        }
    }
}

// 뒤로가기
function goBack() {
    const returnToMap = sessionStorage.getItem('returnToMap');
    const mapState = sessionStorage.getItem('mapState');
    
    if (returnToMap === 'true' && mapState) {
        window.location.href = '/';
    } else {
        const referrer = document.referrer;
        
        if (referrer.includes('/category') && !referrer.includes('/category_type')) {
            const urlParams = new URLSearchParams(referrer.split('?')[1] || '');
            const location = urlParams.get('location') || '';
            const category = urlParams.get('category') || '';
            window.location.href = `category.html?location=${location}${category ? '&category=' + category : ''}`;
        } else if (referrer.includes('/category_type')) {
            const urlParams = new URLSearchParams(referrer.split('?')[1] || '');
            const category = urlParams.get('category') || '';
            window.location.href = `category_type.html?category=${category}`;
        } else {
            window.location.href = '/';
        }
    }
}

// 푸터
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = data;
        }
    });