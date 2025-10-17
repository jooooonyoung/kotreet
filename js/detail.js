let shopsData = [];
let currentShop = null;

// URL에서 no 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
const shopNo = urlParams.get('no');

window.addEventListener('load', () => {
    if (localStorage.getItem('shopsData')) {
        shopsData = JSON.parse(localStorage.getItem('shopsData'));
    }
    
    if (shopNo) {
        const shopId = parseInt(shopNo);
        currentShop = shopsData.find(s => s.id === shopId);
        
        if (currentShop) {
            renderDetailPage(currentShop);
        } else {
            alert('가게를 찾을 수 없습니다.');
            window.location.href = 'index.html';
        }
    } else {
        alert('잘못된 접근입니다.');
        window.location.href = 'index.html';
    }
});

function renderDetailPage(shop) {
    const categoryMap = {
        nail: '네일샵',
        hair: '헤어샵',
        glasses: '안경점',
        vintage: '빈티지샵',
        hanbok: '한복대여',
        goods: '굿즈샵'
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

    // Breadcrumb
    document.getElementById('detailBreadcrumb').textContent = `${shop.location} > ${categoryMap[shop.category]}`;

    // 가게명
    document.getElementById('detailTitle').textContent = shop.name;

    // 가격
    document.getElementById('detailPrice').textContent = `평균가격 ${shop.price.toLocaleString()}won~`;

    // 이미지 캐러셀
    const carouselContainer = document.getElementById('carousel');
    carouselContainer.innerHTML = shop.images.map(img => `
        <div class="carousel-slide">
            <img src="${img}" alt="${shop.name}">
        </div>
    `).join('');
    
    document.getElementById('totalSlides').textContent = shop.images.length;
    setupCarousel(shop.images.length);

    // 동영상
    if (shop.video) {
        document.getElementById('detailVideo').style.display = 'block';
        document.getElementById('detailVideoFrame').src = shop.video + '?autoplay=0';
    }

    // 특징
    document.getElementById('detailMood').textContent = moodMap[shop.mood] || shop.mood;
    document.getElementById('detailComm').textContent = commMap[shop.communication] || shop.communication;
    document.getElementById('detailPayment').textContent = paymentMap[shop.payment] || shop.payment;
    document.getElementById('detailHours').textContent = shop.hours || '영업시간 미정';

    // 설명
    document.getElementById('detailDescription').textContent = shop.description || '가게 설명이 없습니다.';

    // 지도 버튼
    document.getElementById('mapButton').setAttribute('onclick', `openGoogleMap(${shop.latitude}, ${shop.longitude})`);
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

function openGoogleMap(lat, lng) {
    window.open(`https://www.google.com/maps/?q=${lat},${lng}`, '_blank');
}

function openMapLink() {
    if (currentShop && currentShop.latitude && currentShop.longitude) {
        openGoogleMap(currentShop.latitude, currentShop.longitude);
    }
}

function goBack() {
    window.history.back();
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