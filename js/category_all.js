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
    
    renderAllShops();
    loadFooter();
});

function renderAllShops() {
    const container = document.getElementById('allShops');
    
    if (shopsData.length > 0) {
        const sortedShops = [...shopsData].sort((a, b) => a.id - b.id); // ID순 정렬
        container.innerHTML = sortedShops.map(shop => {
            const imgUrl = shop.thumbnail || (shop.images && shop.images[0]) || '';
            const priceText = shop.priceMax ? 
                `₩${shop.price.toLocaleString()}~₩${shop.priceMax.toLocaleString()}` :
                `₩${shop.price.toLocaleString()}~`;
            return `
                <div class="category-shop-card" onclick="goToDetail(${shop.id})">
                    <img src="${imgUrl}" alt="${shop.name}" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                    <div class="category-shop-info">
                        <div class="category-shop-name">${shop.name}</div>
                        <div class="category-shop-price">${priceText}</div>
                        <div style="font-size: 11px; color: #6c757d; margin-top: 4px;">${shop.location} • ${getCategoryLabel(shop.category)}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = '<p style="color: #6c757d; font-size: 13px; text-align: center; padding: 40px 20px;">등록된 가게가 없습니다.</p>';
    }
}

function getCategoryLabel(category) {
    const labels = {
        nail: '네일샵',
        glasses: '안경점',
        dessert: '디저트 카페',
        hanbok: '한복 대여',
        vintage: '음식점',
        goods: '굿즈샵'
    };
    return labels[category] || category;
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