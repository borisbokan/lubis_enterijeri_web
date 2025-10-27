document.addEventListener('DOMContentLoaded', function () {
    'use strict'

    // ===============================================
    // 1. Inicijalizacija Swiper Slajdera
    // ===============================================

    // Inicijalizacija Swipera za Video sekciju (ako postoji)
    if (document.querySelector('.video-swiper')) {
        new Swiper('.video-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                // Prikazuje 2 slajda na širini od 768px i više
                768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                },
                // Prikazuje 3 slajda na širini od 1024px i više
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                },
            }
        });
    }


    // Inicijalizacija Swipera za Galeriju slika (po kategorijama)
    document.querySelectorAll('.image-swiper').forEach(function(swiperElement) {
        new Swiper(swiperElement, {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: false, // Ne mora biti loop za galeriju
            navigation: {
                nextEl: swiperElement.parentNode.querySelector('.swiper-button-next'),
                prevEl: swiperElement.parentNode.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                // Prikazuje 2 slike na širini od 576px i više
                576: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                // Prikazuje 3 slike na širini od 768px i više
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                // Prikazuje 4 slike na širini od 1024px i više
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
            }
        });
    });


    // ===============================================
    // 2. Logika za Modalnu Galeriju (Popup)
    // ===============================================

    // Globalne varijable za modal i Swiper
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalSwiperWrapper = document.getElementById('modal-swiper-wrapper');
    let modalSwiperInstance = null;
    let allImagesData = []; // Čuva sve podatke o slikama na stranici

    // Funkcija koja prikuplja sve slike sa stranice
    function collectAllImages() {
        allImagesData = [];
        // Tražimo sve elemente koji imaju data-full i data-alt
        const imageElements = document.querySelectorAll('.gallery-image-wrapper[data-full]');
        
        imageElements.forEach((el, index) => {
            const fullUrl = el.getAttribute('data-full');
            const altText = el.getAttribute('data-alt');
            
            allImagesData.push({
                index: index, // Globalni indeks
                fullUrl: fullUrl,
                altText: altText
            });
        });
    }

    // Pozivamo funkciju za prikupljanje slika pri učitavanju
    collectAllImages();

    // Globalna funkcija za otvaranje modala (poziva se iz HTML-a onclick="openModal(this)")
    window.openModal = function(clickedElement) {
        const initialIndex = allImagesData.findIndex(item => item.fullUrl === clickedElement.getAttribute('data-full'));

        // Ako Swiper već postoji, uništavamo ga
        if (modalSwiperInstance) {
            modalSwiperInstance.destroy(true, true);
            modalSwiperInstance = null;
        }
        
        // Praznimo wrapper pre popunjavanja
        modalSwiperWrapper.innerHTML = '';

        // Popunjavamo wrapper novim slajdovima
        allImagesData.forEach(item => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide', 'modal-slide');
            
            const img = document.createElement('img');
            img.src = item.fullUrl;
            img.alt = item.altText;
            img.classList.add('img-fluid', 'modal-image');
            
            slide.appendChild(img);
            modalSwiperWrapper.appendChild(slide);
        });

        // Inicijalizujemo novi Swiper sa svim slikama
        modalSwiperInstance = new Swiper('.modal-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            initialSlide: initialIndex, // Otvara na kliknutoj slici
            navigation: {
                nextEl: '.custom-swiper-modal-next',
                prevEl: '.custom-swiper-modal-prev',
            },
            pagination: {
                el: '.custom-swiper-pagination',
                clickable: true,
            },
        });

        // Prikazujemo modal
        imageModal.show();
    }


    // ===============================================
    // 3. Bootstrap Validacija (Preuzeto iz Vašeg koda)
    // ===============================================
    var forms = document.querySelectorAll('.needs-validation')
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
    
    // NAPOMENA: Ako odlučite da se vratite na Cloudflare Worker logiku za formu,
    // taj kod ide ovde, ali je trenutno uklonjen.
    
});