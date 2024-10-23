const header = document.querySelector(".header");
const searchBtn = document.querySelector(".search-btn");
const logoWhite = document.querySelector(".logo-white");
const logoBlack = document.querySelector(".logo-black");
const accountWhite = document.querySelector(".account-white");
const accountBlack = document.querySelector(".account-black");

let lastScrollTop = 0;
let isAnimating = false;

window.addEventListener("scroll", () => {
    if (isAnimating) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition > 100 && !header.classList.contains("scrolled")) {
        isAnimating = true;
        header.style.transform = "translateY(-100%)";
        
        setTimeout(() => {
            header.classList.add("scrolled");
            header.style.transform = "translateY(0)";
            searchBtn.style.display = "block";
            logoWhite.style.display = "none";
            logoBlack.style.display = "inline";
            accountWhite.style.display = "none";
            accountBlack.style.display = "inline";
            
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }, 200);
    } else if (scrollPosition <= 100 && header.classList.contains("scrolled")) {
        isAnimating = true;
        header.style.transform = "translateY(-100%)";
        
        setTimeout(() => {
            header.classList.remove("scrolled");
            header.style.transform = "translateY(0)";
            searchBtn.style.display = "none";
            logoWhite.style.display = "inline";
            logoBlack.style.display = "none";
            accountWhite.style.display = "inline";
            accountBlack.style.display = "none";
            
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }, 200);
    }

    if (scrollPosition + windowHeight > documentHeight - 100) {
        footer.classList.toggle('scrolled', (scrollPosition % 200 < 100));
    } else {
        footer.classList.remove('scrolled');
    }

    lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition;
}, { passive: true });

document.addEventListener('DOMContentLoaded', function() {
    const seeMoreBtn = document.querySelector('.see-more-btn');
    const rentNowBtn = document.querySelector('.rent-now-btn');
    const accountBtn = document.getElementById('headerAccountBtn');
    const signupLink = document.getElementById('signupLink');

    function smoothTransition(e) {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(function() {
            window.location = e.target.href;
        }, 500);
    }

    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', smoothTransition);
    }

    if (rentNowBtn) {
        rentNowBtn.addEventListener('click', smoothTransition);
    }

    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup.html';
        });
    }

    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('signupFullName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;

            if (fullName === '') {
                alert('Будь ласка, введіть ваше повне ім\'я');
                return;
            }

            if (email === '' || !isValidEmail(email)) {
                alert('Будь ласка, введіть коректну email адресу');
                return;
            }

            if (phone === '' || !isValidPhone(phone)) {
                alert('Будь ласка, введіть коректний номер телефону');
                return;
            }

            if (password.length < 6) {
                alert('Пароль повинен містити щонайменше 6 символів');
                return;
            }

            alert('Реєстрація успішна!');
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(phone);
    }

    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');

    function updateSliders() {
        if (parseInt(minPrice.value) > parseInt(maxPrice.value)) {
            if (this === minPrice) {
                maxPrice.value = minPrice.value;
            } else {
                minPrice.value = maxPrice.value;
            }
        }
        minPriceInput.value = minPrice.value;
        maxPriceInput.value = maxPrice.value;
    }

    minPrice.addEventListener('input', updateSliders);
    maxPrice.addEventListener('input', updateSliders);

    minPriceInput.addEventListener('change', function() {
        minPrice.value = this.value;
        updateSliders.call(minPrice);
    });

    maxPriceInput.addEventListener('change', function() {
        maxPrice.value = this.value;
        updateSliders.call(maxPrice);
    });
});

const isItemPage = document.querySelector('.item-content');

if (isItemPage) {
    let lastScrollTop = 0;
    
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            if (scrollPosition > lastScrollTop) {
                header.style.transform = "translateY(-100%)";
            } else {
                header.style.transform = "translateY(0)";
            }
        } else {
            header.style.transform = "translateY(0)";
        }
        
        lastScrollTop = scrollPosition <= 0 ? 0 : scrollPosition;
    }, { passive: true });
}
