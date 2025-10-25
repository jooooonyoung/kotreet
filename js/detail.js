function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

let shopsData = [];
let currentShop = null;

const urlParams = new URLSearchParams(window.location.search);
const shopNo = urlParams.get('no');

window.addEventListener('load', () => {
    const storedData = localStorage.getItem('shopsData');
    if (storedData) {
        try {
            shopsData = JSON.parse(storedData);
            console.log('로드된 가게 수:', shopsData.length);
            console.log('전체 가게 목록:', shopsData.map(s => ({id: s.id, name: s.name})));
        } catch (e) {
            console.error('데이터 로드 실패:', e);
            shopsData = [];
        }
    }
    
    if (shopNo) {
        const shopId = parseInt(shopNo, 10);
        console.log('찾는 가게 ID:', shopId);
        
        currentShop = shopsData.find(s => s.id === shopId);
        console.log('찾은 가게:', currentShop);
        
        if (currentShop) {
            renderDetailPage(currentShop);
        } else {
            console.error('가게를 찾을 수 없습니다. shopNo:', shopNo, 'shopId:', shopId);
            alert('가게 정보를 찾을 수 없습니다. (ID: ' + shopId + ')');
            window.location.href = '/';
        }
    } else {
        alert('잘못된 접근입니다.');
        window.location.href = '/';
    }
});

function renderDetailPage(shop) {
    const categoryMap = {
        nail: '네일샵',
        dessert: '디저트 카페',
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

    document.getElementById('detailBreadcrumb').textContent = `${shop.location} > ${categoryMap[shop.category]}`;
    document.getElementById('detailTitle').textContent = shop.name;

    const priceText = shop.priceMax ? 
        `평균가격 ${shop.price.toLocaleString()}won~${shop.priceMax.toLocaleString()}won` :
        `평균가격 ${shop.price.toLocaleString()}won~`;
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
    document.getElementById('detailComm').textContent = commMap[shop.communication] || shop.communication;
    document.getElementById('detailPayment').textContent = paymentMap[shop.payment] || shop.payment;
    document.getElementById('detailHours').textContent = shop.hours || '영업시간 미정';
    document.getElementById('detailDescription').textContent = shop.description || '가게 설명이 없습니다.';
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

function shareShop() {
    if (currentShop) {
        const url = window.location.href;
        const title = currentShop.name;
        const categoryMap = {
            nail: '네일샵',
            dessert: '디저트 카페',
            glasses: '안경점',
            vintage: '빈티지샵',
            hanbok: '한복대여',
            goods: '굿즈샵'
        };
        const text = `${currentShop.name} - ${currentShop.location}의 ${categoryMap[currentShop.category]}`;

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

fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = data;
        }
    });

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