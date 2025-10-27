// ===================================
// KLIJENTSKI KOD ZA WEB STRANICU (Očišćena i finalna verzija)
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    'use strict'

    // ===================================
    // 1. Validacija Bootstrap Forme (Needs Validation)
    // ===================================

    // Dohvati sve forme kojima želimo da primenimo prilagođene Bootstrap stilove validacije
    var forms = document.querySelectorAll('.needs-validation')

    // Prođi kroz forme i spreči slanje ako nisu validne (standardna Bootstrap logika)
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                // Ako Bootstrap validacija NIJE OK, sprečavamo slanje
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })

    // ===================================
    // 2. Slanje Forme Kroz Cloudflare Worker (JSON metoda)
    // ===================================
    const form = document.getElementById('contactForm');
    const workerEndpoint = 'https://email-sender-lubis.borisbokan.workers.dev/'; // Vaš Worker EndPoint

    if (form) {
        form.addEventListener('submit', function (event) {
            // NE DODAJEMO event.preventDefault() OVDE JER JE VEĆ DODAT U Bootstrap validaciji (gore)

            // Ako Bootstrap validacija prođe (form.checkValidity() je true), nastavljamo sa slanjem
            if (form.checkValidity()) {
                event.preventDefault(); // Sprečavamo standardno slanje

                // Korišćenje FormData objekta za prikupljanje podataka
                const formData = new FormData(form);

                // Konvertovanje FormData u plain JavaScript objekat (JSON)
                const jsonData = {};
                formData.forEach((value, key) => jsonData[key] = value);

                // Slanje forme putem fetch-a sa JSON formatom
                fetch(workerEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // KLJUČNO: Šaljemo JSON
                    },
                    body: JSON.stringify(jsonData), // Šaljemo JSON string
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        // Greška 500 će se uhvatiti ovde
                        throw new Error(`HTTP greška: ${response.status}`);
                    }
                })
                .then(data => {
                    if (data.success) {
                        alert('Poruka je uspešno poslata!');
                        form.reset();
                        form.classList.remove('was-validated'); // Ukloni validacione stilove
                    } else {
                        alert('Greška pri slanju: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Lokalna greška:', error);
                    // Prikazuje 500 grešku ili grešku pri mreži
                    alert('Došlo je do greške na klijentskoj strani ili Workeru: ' + error.message);
                });
            }
        });
    }

    // ===================================
    // 3. Inicijalizacija SLIDERA i LIGHTBOXA
    // ===================================
    
    // a) Video Slajder
    if (document.querySelector('.video-swiper')) {
        new Swiper('.video-swiper', {
            // ... (Swiper parametri za video) ...
            loop: false,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.video-nav-btn.swiper-button-next',
                prevEl: '.video-nav-btn.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 20, },
                1024: { slidesPerView: 3, spaceBetween: 30, },
            }
        });
    }

    // b) Slajderi Slika (po kategoriji)
    document.querySelectorAll('.image-swiper').forEach(function(el) {
        const parentWrapper = el.closest('.swiper-category-wrapper');
        
        new Swiper(el, {
            // ... (Swiper parametri za galeriju) ...
            loop: false,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: parentWrapper.querySelector('.category-nav-btn.swiper-button-next'),
                prevEl: parentWrapper.querySelector('.category-nav-btn.swiper-button-prev'),
            },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 15, },
                992: { slidesPerView: 3, spaceBetween: 20, },
            }
        });
    });

    // c) Jednostavan Lightbox (jedna instanca)
    const simpleLightboxItems = document.querySelectorAll('.portfolio-item'); 
    const lightbox = document.getElementById('lightbox'); 
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (lightbox) {
        simpleLightboxItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const src = this.getAttribute('data-src');
                const caption = this.getAttribute('data-caption');
                lightboxImg.src = src;
                lightboxCaption.textContent = caption;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Sakrij prev/next dugmad za jednostavan Lightbox
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    }
});


// ===================================
// 4. FUNKCIONALNOST SWIPER MODALNOG PROZORA (Potpuno izdvojena funkcija)
// ===================================

let modalSwiper = null; // Stavljamo na globalni nivo za lakše uništavanje
const imageModalElement = document.getElementById('imageModal'); // Dohvati modalni element
if (imageModalElement) {
    // 2. Inicijalizacija Swipera kada je Modal POTPUNO OTVOREN
    // OVAJ DEO KODA KOJI SE DUPLIRAO JE SADA KORISTAN
    imageModalElement.addEventListener('shown.bs.modal', function () {
        const initialSlideIndex = parseInt(this.getAttribute('data-initial-slide') || 0);

        // Uništi prethodni Swiper ako postoji
        if (modalSwiper !== null) {
            modalSwiper.destroy(true, true);
        }
        
        // Kreiraj novi Swiper
        modalSwiper = new Swiper('.modal-swiper', {
            loop: true, 
            slidesPerView: 1,
            initialSlide: initialSlideIndex, 
            navigation: {
                nextEl: '.custom-swiper-modal-next', 
                prevEl: '.custom-swiper-modal-prev',
            },
            pagination: {
                el: '.custom-swiper-pagination',
                type: 'fraction', 
            },
        });
    });
}
// Potrebno je i definisati globalnu funkciju za otvaranje modala ako se koristi u HTML-u
// (Ona je predugačka za ovaj komentar, ali pretpostavljamo da je 'function openModal(element)' definisana)
// Ako Vam je potrebna, stavite originalnu 'function openModal(element)' ovde.