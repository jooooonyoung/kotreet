let shopsData = [];

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
    
    // 언어 적용
    document.querySelector('.category-all-title').textContent = t('allShopsTitle');
    document.querySelector('.category-all-desc').textContent = t('allShopsDesc');
    document.querySelector('.floating-btn span').textContent = t('directions');
    
    renderAllShops();
    loadFooter();
});

function renderAllShops() {
    const container = document.getElementById('allShops');
    
    if (shopsData.length > 0) {
        const sortedShops = [...shopsData].sort((a, b) => a.id - b.id);
        container.innerHTML = sortedShops.map(shop => {
            const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
            const priceText = shop.priceMax ? 
                `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
                `₩${shop.price.toLocaleString()}~`;
            const categoryLabel = getCategoryLabel(shop.category);
            return `
                <div class="category-shop-card" onclick="goToDetail(${shop.id})">
                    <img src="${imgUrl}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                    <div class="category-shop-info">
                        <div class="category-shop-name">${shop.name}</div>
                        <div class="category-shop-price">${priceText}</div>
                        <div class="category-shop-location">${shop.location} · ${categoryLabel}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        const noShopsText = getCurrentLanguage() === 'en' ? 'No shops registered.' : '등록된 가게가 없습니다.';
        container.innerHTML = `<p style="color: #6c757d; font-size: 13px; text-align: center; padding: 40px 20px;">${noShopsText}</p>`;
    }
}

function goToDetail(shopId) {
    const shopNo = String(shopId).padStart(4, '0');
    window.location.href = `detail.html?no=${shopNo}`;
}

function goBack() {
    window.location.href = '/';
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
                // Footer 로드 후 언어 적용
                if (typeof applyLanguage === 'function') {
                    setTimeout(applyLanguage, 50);
                }
                if (typeof initLanguageSelector === 'function') {
                    setTimeout(initLanguageSelector, 100);
                }
            }
        });
}

window.addEventListener('scroll', () => {
    const floatingBtn = document.querySelector('.floating-btn');
    if (floatingBtn) {
        if (window.scrollY > 1) {
            floatingBtn.classList.add('visible');
        } else {
            floatingBtn.classList.remove('visible');
        }
    }
});
