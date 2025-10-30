// 다국어 지원 시스템
const translations = {
    ko: {
        // 공통
        directions: "Directions",
        
        // Footer
        footerTerms: "이용약관",
        footerPrivacy: "개인정보 처리방침",
        footerCompanyName: "상호명",
        footerCEO: "대표",
        footerPrivacyOfficer: "개인정보보호책임자",
        footerBusinessNumber: "사업자등록번호",
        footerAddress: "주소",
        footerEmail: "이메일",
        footerContact: "고객문의",
        footerDescription: "코트릿은 광고대행업체로 코트릿 플랫폼을 통하여 판매자와 고객 사이에 이루어지는 통신판매의 당사자가 아닙니다. 코트릿을 통하여 방문하는 업체 서비스에 관한 의무와 책임은 해당 서비스를 제공하는 업체에게 있습니다.",
        footerCopyright: "© 2025 Kotreet Inc. All rights reserved",
        footerLanguage: "한국어",
        
        // Category
        categoryBeauty: "뷰티",
        categoryGlasses: "안경점",
        categoryDessert: "디저트 카페",
        categoryCloth: "의류",
        categoryFood: "음식점",
        categoryGoods: "굿즈샵",
        
        // Category All
        allShopsTitle: "전체 가게",
        allShopsDesc: "모든 지역의 모든 카테고리 가게를 소개합니다.",
        
        // Category Type
        popularShopsTitle: "🔥 가장 많이 본 가게",
        popularShopsDesc: "조회수가 높은 인기 가게",
        beautyDesc: "한국의 뷰티샵을 소개합니다.",
        glassesDesc: "한국의 안경점을 소개합니다.",
        dessertDesc: "한국의 디저트 카페를 소개합니다.",
        clothDesc: "한국의 의류샵을 소개합니다.",
        foodDesc: "한국의 음식점을 소개합니다.",
        goodsDesc: "한국의 굿즈샵을 소개합니다.",
        
        // Category Region
        regionPopularTitle: "🔥 {region}에서 가장 많이 본 가게",
        regionPopularDesc: "이 지역에서 조회수가 높은 인기 가게",
        
        // Detail
        detailIntroTitle: "점주 소개",
        detailLocationTitle: "위치",
        detailDirections: "DIRECTIONS",
        
        // 지역명
        hongdae: "홍대",
        myeongdong: "명동",
        gangnam: "강남",
        seongsu: "성수",
        
        // Category All Pages
        categoryPageTitle: "CATEGORY",
        locationPageTitle: "LOCATION"
    },
    en: {
        // Common
        directions: "Directions",
        
        // Footer
        footerTerms: "Terms of Service",
        footerPrivacy: "Privacy Policy",
        footerCompanyName: "Company",
        footerCEO: "CEO",
        footerPrivacyOfficer: "Privacy Officer",
        footerBusinessNumber: "Business Registration",
        footerAddress: "Address",
        footerEmail: "Email",
        footerContact: "Contact",
        footerDescription: "Kotreet is an advertising agency and is not a party to the telecommunication sales made between sellers and customers through the Kotreet platform. The obligations and responsibilities for merchant services visited through Kotreet belong to the respective merchant.",
        footerCopyright: "© 2025 Kotreet Inc. All rights reserved",
        footerLanguage: "English",
        
        // Category
        categoryBeauty: "Beauty",
        categoryGlasses: "Glasses",
        categoryDessert: "Dessert Cafe",
        categoryCloth: "Clothing",
        categoryFood: "Restaurant",
        categoryGoods: "Goods Shop",
        
        // Category All
        allShopsTitle: "All Shops",
        allShopsDesc: "Introducing shops from all regions and categories.",
        
        // Category Type
        popularShopsTitle: "🔥 Most Viewed Shops",
        popularShopsDesc: "Popular shops with high views",
        beautyDesc: "Introducing Korean beauty shops.",
        glassesDesc: "Introducing Korean optical shops.",
        dessertDesc: "Introducing Korean dessert cafes.",
        clothDesc: "Introducing Korean clothing shops.",
        foodDesc: "Introducing Korean restaurants.",
        goodsDesc: "Introducing Korean goods shops.",
        
        // Category Region
        regionPopularTitle: "🔥 Most Viewed Shops in {region}",
        regionPopularDesc: "Popular shops with high views in this area",
        
        // Detail
        detailIntroTitle: "Shop Introduction",
        detailLocationTitle: "Location",
        detailDirections: "DIRECTIONS",
        
        // 지역명
        hongdae: "Hongdae",
        myeongdong: "Myeongdong",
        gangnam: "Gangnam",
        seongsu: "Seongsu",
        
        // Category All Pages
        categoryPageTitle: "CATEGORY",
        locationPageTitle: "LOCATION"
    }
};

// 현재 언어 가져오기
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ko';
}

// 언어 설정
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

// 번역 가져오기
function t(key, params = {}) {
    const lang = getCurrentLanguage();
    let text = translations[lang][key] || translations['ko'][key] || key;
    
    // 파라미터 치환
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// 카테고리 레이블 가져오기
function getCategoryLabel(category) {
    const categoryMap = {
        beauty: getCurrentLanguage() === 'en' ? 'Beauty' : '뷰티',
        dessert: getCurrentLanguage() === 'en' ? 'Dessert Cafe' : '디저트 카페',
        glasses: getCurrentLanguage() === 'en' ? 'Glasses' : '안경점',
        vintage: getCurrentLanguage() === 'en' ? 'Restaurant' : '음식점',
        food: getCurrentLanguage() === 'en' ? 'Restaurant' : '음식점',
        cloth: getCurrentLanguage() === 'en' ? 'Clothing' : '의류',
        goods: getCurrentLanguage() === 'en' ? 'Goods Shop' : '굿즈샵'
    };
    return categoryMap[category] || category;
}

// 지역 레이블 가져오기
function getLocationLabel(location) {
    const lang = getCurrentLanguage();
    const locationMap = {
        '홍대': lang === 'en' ? 'Hongdae' : '홍대',
        '명동': lang === 'en' ? 'Myeongdong' : '명동',
        '강남': lang === 'en' ? 'Gangnam' : '강남',
        '성수': lang === 'en' ? 'Seongsu' : '성수'
    };
    return locationMap[location] || location;
}

// 페이지 로드 시 언어 적용
function applyLanguage() {
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;
    
    // data-i18n 속성을 가진 모든 요소 번역
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // data-i18n-placeholder 속성을 가진 모든 요소의 placeholder 번역
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Footer 언어 선택 버튼 초기화
function initLanguageSelector() {
    const checkFooter = setInterval(() => {
        const langBtn = document.querySelector('.footer-select-btn');
        if (langBtn) {
            clearInterval(checkFooter);
            
            const lang = getCurrentLanguage();
            langBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                ${lang === 'ko' ? '한국어' : 'English'}
            `;
            
            let dropdown = document.querySelector('.language-dropdown');
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.className = 'language-dropdown';
                dropdown.style.cssText = `
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: none;
                    margin-bottom: 8px;
                    min-width: 120px;
                    z-index: 1000;
                `;
                
                dropdown.innerHTML = `
                    <button class="lang-option" data-lang="ko" style="display: block; width: 100%; padding: 12px 16px; border: none; background: none; text-align: left; cursor: pointer; font-size: 14px; color: #222; transition: background 0.2s;">
                        🇰🇷 한국어
                    </button>
                    <button class="lang-option" data-lang="en" style="display: block; width: 100%; padding: 12px 16px; border: none; background: none; text-align: left; cursor: pointer; font-size: 14px; color: #222; transition: background 0.2s;">
                        🇺🇸 English
                    </button>
                `;
                
                langBtn.parentElement.style.position = 'relative';
                langBtn.parentElement.appendChild(dropdown);
                
                dropdown.querySelectorAll('.lang-option').forEach(option => {
                    option.addEventListener('mouseenter', (e) => {
                        e.target.style.background = '#f5f5f5';
                    });
                    option.addEventListener('mouseleave', (e) => {
                        e.target.style.background = 'none';
                    });
                    option.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const selectedLang = e.target.getAttribute('data-lang');
                        setLanguage(selectedLang);
                    });
                });
            }
            
            langBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            document.addEventListener('click', (e) => {
                if (!langBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }
    }, 100);
    
    setTimeout(() => clearInterval(checkFooter), 10000);
}

// 초기화
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        applyLanguage();
        initLanguageSelector();
    });
}