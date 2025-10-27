// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Dohvati sve forme kojima želimo da primenimo prilagođene Bootstrap stilove validacije
    var forms = document.querySelectorAll('.needs-validation')

    // Prođi kroz forme i spreči slanje ako nisu validne
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

// ===================================
// INICIJALIZACIJA SLIDERA I LIGHTBOXA
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Inicijalizacija Video Slajdera
    if (document.querySelector('.video-swiper')) {
        new Swiper('.video-swiper', {
            loop: false,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                // Video slajder koristi .video-nav-btn
                nextEl: '.video-nav-btn.swiper-button-next',
                prevEl: '.video-nav-btn.swiper-button-prev',
            },
            // Prilagođavanje za različite veličine ekrana
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }
        });
    }

    // 2. Inicijalizacija Slajdera Slika (za svaku kategoriju u Galeriji)
    document.querySelectorAll('.image-swiper').forEach(function(el) {
        // Pronađi roditeljski omotač koji sadrži i swiper i dugmad
        const parentWrapper = el.closest('.swiper-category-wrapper');
        
        new Swiper(el, {
            loop: false,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                // Koristi parentWrapper da pronađe dugmad sa specifičnom klasom .category-nav-btn
                nextEl: parentWrapper.querySelector('.category-nav-btn.swiper-button-next'),
                prevEl: parentWrapper.querySelector('.category-nav-btn.swiper-button-prev'),
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            }
        });
    });

    // 3. JEDNOSTAVNI LIGHTBOX ZA SLIKE NA HOME/INDEX STRANICI
    // (Koristi HTML strukturu sa ID="lightbox")
    
    // Selektuje sve stavke koje treba da se otvore u Lightbox-u, uključujući
    // .portfolio-item (za index.html) i .gallery-item (za gallery.html, ako nisu u swiperu)
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
                
                // 1. Dohvatanje podataka sa <a> taga
                const src = this.getAttribute('data-src');
                const caption = this.getAttribute('data-caption');
                
                // 2. Prikazivanje slike i natpisa
                lightboxImg.src = src;
                lightboxCaption.textContent = caption;
                
                // 3. Otvaranje Lightbox-a
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
            });
        });

        // Zatvaranje Lightbox-a
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
        
        // Sakrivamo prev/next dugmad jer je ovo jednostavan (non-swiper) Lightbox
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    }
});


// ===================================
// FUNKCIONALNOST SWIPER MODALNOG PROZORA (za Gallery.html)
// ===================================

let modalSwiper = null;
const imageModalElement = document.getElementById('imageModal'); // Dohvati modalni element

function openModal(element) {
    // 1. Pronalazimo element koji sadrži SVE slličice (swiper-category-wrapper)
    const categoryWrapper = element.closest('.swiper-category-wrapper');
    
    // 2. Pronalazimo SVE nove DIV-ove sa klasom .gallery-image-wrapper unutar te kategorije
    const allThumbnails = categoryWrapper.querySelectorAll('.gallery-image-wrapper');
    
    // 3. Pronalazimo indeks kliknutog elementa (da bi modal počeo od njega)
    let startIndex = -1;
    allThumbnails.forEach((thumb, index) => {
        if (thumb === element) {
            startIndex = index;
        }
    });

    if (startIndex === -1) return; // Greška, ne bi trebalo da se desi

    // 4. Očisti modal wrapper
    const modalWrapper = document.getElementById('modal-swiper-wrapper');
    modalWrapper.innerHTML = '';

    // 5. Kreiraj slajdove za modal
    allThumbnails.forEach((thumb) => {
        // Hvatamo data-full i data-alt direktno iz thumb (elementa)
        const fullSrc = thumb.getAttribute('data-full');
        const altText = thumb.getAttribute('data-alt');
        
        const newSlide = document.createElement('div');
        newSlide.className = 'swiper-slide';
        // U modalu želimo pravu IMG tag
        newSlide.innerHTML = `
            <img src="${fullSrc}" alt="${altText}" class="img-fluid">
            `;
        modalWrapper.appendChild(newSlide);
    });

    // 6. Otvori modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();

    // 7. Inicijalizuj modal swiper
    // Koristimo setTimeout jer Swiper mora da se inicijalizuje NAKON što se modal prikaže
    document.getElementById('imageModal').addEventListener('shown.bs.modal', function () {
        // Uništi prethodnu instancu Swiper-a ako postoji (važno da ne bi došlo do sukoba)
        if (window.modalSwiperInstance) {
            window.modalSwiperInstance.destroy(true, true);
        }
        
        window.modalSwiperInstance = new Swiper('.modal-swiper', {
            loop: true,
            initialSlide: startIndex,
            navigation: {
                nextEl: '.custom-swiper-modal-next',
                prevEl: '.custom-swiper-modal-prev',
            },
            pagination: {
                el: '.custom-swiper-pagination',
                type: 'fraction',
            },
        });
    }, { once: true }); // Koristi { once: true } da se event handler automatski ukloni

    // Ako modal već nije otvoren, treba nam dodatno ručno okidanje
    if (!document.getElementById('imageModal').classList.contains('show')) {
        // Ako modal nije otvoren, Swiper će se pokrenuti kada se modal prikaže (shown.bs.modal)
        // ali ako je već otvoren (što ne bi trebalo), moramo ga pokrenuti ručno.
    }
}

// 2. Inicijalizacija Swipera kada je Modal POTPUNO OTVOREN
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
        initialSlide: initialSlideIndex, // Prikazuje kliknutu sliku prvu
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


// ===================================
// INICIJALIZACIJA SLIDERA I LIGHTBOXA (Ostavljamo neizmenjeno)
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Inicijalizacija Video Slajdera
    if (document.querySelector('.video-swiper')) {
        new Swiper('.video-swiper', {
            loop: false,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.video-nav-btn.swiper-button-next',
                prevEl: '.video-nav-btn.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }
        });
    }

    // 2. Inicijalizacija Slajdera Slika
    document.querySelectorAll('.image-swiper').forEach(function(el) {
        const parentWrapper = el.closest('.swiper-category-wrapper');
        
        new Swiper(el, {
            loop: false,
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: parentWrapper.querySelector('.category-nav-btn.swiper-button-next'),
                prevEl: parentWrapper.querySelector('.category-nav-btn.swiper-button-prev'),
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
            }
        });
    });

    // 3. JEDNOSTAVNI LIGHTBOX ZA SLIKE NA HOME/INDEX STRANICI
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
        
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    }
});


// ===================================
// FUNKCIONALNOST SWIPER MODALNOG PROZORA (za Gallery.html) (Ostavljamo neizmenjeno)
// ===================================
function openModal(element) {
    // 1. Pronalazimo elemente: Slike i kontejner kategorije
    const categoryWrapper = element.closest('.swiper-category-wrapper');
    const allThumbnails = categoryWrapper.querySelectorAll('.gallery-image-wrapper');
    
    // 2. Pronalazimo indeks kliknutog elementa (startnu poziciju)
    let startIndex = Array.from(allThumbnails).indexOf(element);
    if (startIndex === -1) return; 

    // 3. Očisti modal wrapper
    const modalWrapper = document.getElementById('modal-swiper-wrapper');
    modalWrapper.innerHTML = '';

    // 4. Kreiraj slajdove za modal (ubacujemo IMG tagove)
    allThumbnails.forEach((thumb) => {
        const fullSrc = thumb.getAttribute('data-full');
        const altText = thumb.getAttribute('data-alt');
        
        const newSlide = document.createElement('div');
        newSlide.className = 'swiper-slide';
        
        // Koristimo IMG tag u modalu!
        newSlide.innerHTML = `
            <img src="${fullSrc}" alt="${altText}" class="img-fluid" style="max-height: 85vh; width: auto;">
        `;
        modalWrapper.appendChild(newSlide);
    });

    // 5. Otvori modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();

    // 6. Inicijalizuj modal swiper NAKON ŠTO SE MODAL POTPUNO PRIKAŽE
    document.getElementById('imageModal').addEventListener('shown.bs.modal', function () {
        
        // Uništavamo prethodnu instancu ako postoji 
        if (window.modalSwiperInstance) {
            window.modalSwiperInstance.destroy(true, true);
        }
        
        // Stavljamo u globalnu varijablu da možemo uništiti
        window.modalSwiperInstance = new Swiper('.modal-swiper', {
            loop: true,
            initialSlide: startIndex,
            // Ponovno prikazujemo strelice za navigaciju
            navigation: {
                nextEl: '.custom-swiper-modal-next',
                prevEl: '.custom-swiper-modal-prev',
            },
            pagination: {
                el: '.custom-swiper-pagination',
                type: 'fraction',
            },
        });
        
        // Osiguravamo da su strelice vidljive (vjerovatno je ovo uzrok problema)
        // Ako je Swiper uspio da ih inicijalizuje, moramo se pobrinuti da nisu sakrivene
        const nextBtn = document.querySelector('.custom-swiper-modal-next');
        const prevBtn = document.querySelector('.custom-swiper-modal-prev');
        
        if (nextBtn && prevBtn) {
            nextBtn.style.display = 'flex'; // Koristimo flex da bi se videle
            prevBtn.style.display = 'flex';
        }

    }, { once: true }); 
}


// VAŽNO: Nakon što ovo radi, MORAMO vratiti Swiper logiku

imageModalElement.addEventListener('shown.bs.modal', function () {
    const initialSlideIndex = parseInt(this.getAttribute('data-initial-slide') || 0);

    if (modalSwiper !== null) {
        modalSwiper.destroy(true, true);
    }
    
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

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const workerEndpoint = 'https://email-sender-lubis.borisbokan.workers.dev/';

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Zaustavi standardno slanje forme

        // Korišćenje FormData objekta za prikupljanje podataka
        const formData = new FormData(form); 

        // Slanje forme putem fetch-a
        fetch(workerEndpoint, {
            method: 'POST',
            body: formData // Worker sada prepoznaje FormData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Poruka je uspešno poslata!');
                form.reset(); 
            } else {
                alert('Greška pri slanju: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Lokalna greška:', error);
            alert('Došlo je do greške na klijentskoj strani.');
        });
    });
});


// // ===================================
// // HANDLER ZA SLANJE FORME KROZ CLOUDFLARE WORKER (FIKSIRANO)
// // ===================================

// // URL вашег Cloudflare Worker-а - PROVERITE DA LI JE ISPRAVAN!
// const WORKER_ENDPOINT = "https://email-sender-lubis.borisbokan.workers.dev/";

// // js/script.js

// document.getElementById('contactForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Sprečava standardno slanje forme
    
//     const form = event.target;
//     const formMessage = document.getElementById('formMessage');
//     const endpoint = form.action;

//     // 1. Klijentska validacija (iz prethodnog razgovora)
//     if (!form.checkValidity()) {
//         form.classList.add('was-validated');
//         return;
//     }
    
//     // 2. Kreiranje FormData objekta
//     const formData = new FormData(form); 

//     // Prikazivanje poruke o slanju i onemogućavanje dugmeta
//     formMessage.innerHTML = '<div class="alert alert-info">Šaljem poruku...</div>';
//     const submitButton = form.querySelector('button[type="submit"]');
//     submitButton.disabled = true;

//     // 3. Slanje na Worker endpoint
//     fetch(endpoint, {
//         method: 'POST',
//         body: formData, // Worker očekuje FormData, pa je šaljemo direktno
//     })
//     .then(response => response.json())
//     .then(data => {
//         submitButton.disabled = false;
//         form.classList.remove('was-validated');

//         if (data.success) {
//             formMessage.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
//             form.reset(); // Resetuje formu nakon uspeha
//         } else {
//             // Prikaz greške iz Worker-a
//             formMessage.innerHTML = `<div class="alert alert-danger">Greška: ${data.message}</div>`;
//         }
//     })
//     .catch(error => {
//         submitButton.disabled = false;
//         console.error('Konekciona greška:', error);
//         formMessage.innerHTML = '<div class="alert alert-danger">Došlo je do greške pri povezivanju. Molimo pokušajte ponovo.</div>';
//     });
// });