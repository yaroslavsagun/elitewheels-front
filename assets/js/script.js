import { api_link, basic_user } from "./constants.js";

const header = document.querySelector(".header");

const account = document.getElementById('headerAccountBtn');

let user = [];

let avatar_path = '';

async function getUser() {
    const res = await fetch(api_link + `/user?Authorization=` + localStorage.getItem('token'), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await res.json();
    if (data.data == undefined) {
        user = basic_user;
    } else {
        user = data.data;
    }
    avatar_path = user.avatar ? user.avatar : "assets/img/profile_photo.png";
}

function changeAvatar(path = avatar_path) {
    account.innerHTML = `<img src="${path}" alt="Account" class="account-black" id="accountBlack"
              style="display: flex;">`;
}

document.addEventListener('DOMContentLoaded', async function() {
    await getUser();
    changeAvatar();

    const seeMoreBtn = document.querySelector('.see-more-btn');
    const rentNowBtn = document.querySelector('.rent-now-btn');
    const logoBtn = document.getElementById('headerLogo');
    const accountBtn = document.getElementById('headerAccountBtn');
    const signupLink = document.getElementById('signupLink');

    function smoothTransition(e) {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(function() {
            window.location = e.target.href;
        }, 500);
    }

    if (logoBtn) {
        logoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            location.href = '/';
        });
    }

    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            location.href = '/catalog';
        });
    }

    if (rentNowBtn) {
        rentNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            location.href = '/catalog';
        });
    }

    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (localStorage.getItem('token') == null) {
                location.href = '/login';
            } else {
                location.href = '/profile';
            }
            
        });
    }

    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            location.href = '/signup';
        });
    }

    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            location.href = '/';
        });
    }

    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            location.href = '/login';
        });
    }
});

const footer = document.querySelector(".footer");
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