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

// 1. Definišemo funkciju openModal
window.openModal = function(clickedImage) {
    
    // Dohvatamo elemente potrebne za popunjavanje modala
    const categoryDiv = clickedImage.closest('.image-swiper');
    
    // Selektujemo sve IMG elemente sa klasom gallery-thumb
    // (Pazimo da koristimo element koji sadrži data-full atribut)
    const categoryImages = categoryDiv.querySelectorAll('.gallery-thumb');
    const modalWrapper = document.getElementById('modal-swiper-wrapper');

    // 1. Priprema sadržaja modala
    modalWrapper.innerHTML = '';
    
    // 2. Dinamičko popunjavanje modala svim slikama iz iste kategorije
    let initialSlideIndex = 0;
    categoryImages.forEach((img, index) => {
        // Koristimo data-full za veliku sliku i data-caption sa roditeljskog <a> taga
        const fullSrc = img.getAttribute('data-full'); 
        const parentLink = img.closest('a'); // Dohvati roditeljski <a> tag
        const caption = parentLink ? parentLink.getAttribute('data-caption') : ''; // Dohvati natpis
        
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        
        // Dodajemo i natpis ispod slike unutar slajda u Modalu
        slide.innerHTML = `
            <img src="${fullSrc}" class="img-fluid" alt="Uvećana slika">
            <p class="modal-caption-text">${caption}</p>
        `;
        modalWrapper.appendChild(slide);

        // Određivanje koja je slika kliknuta
        if (img === clickedImage) {
            initialSlideIndex = index;
        }
    });

    // 3. Prikazivanje Modala
    const imageModal = new bootstrap.Modal(imageModalElement);
    imageModal.show();
    
    // SAČUVAMO INICIJALNI SLAJD ZA KASNIJU INICIJALIZACIJU
    imageModalElement.setAttribute('data-initial-slide', initialSlideIndex);
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

// URL вашег Cloudflare Worker-а - Морате га креирати прво!
const WORKER_ENDPOINT = "https://forma-mail-handler-temp-a24.borisbokan.workers.dev/";

// ===================================
// HANDLER ZA SLANJE FORME KROZ CLOUDFLARE WORKER
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Заустави стандардно слање форме

            formMessage.textContent = 'Šaljem poruku...';
            formMessage.style.color = '#E4B93F'; // Zlatna boja

           
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            fetch(WORKER_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Došlo je do greške na serveru.');
            })
            .then(result => {
                formMessage.textContent = 'Poruka uspešno poslata! Hvala Vam.';
                formMessage.style.color = 'green';
                form.reset(); // Obriši polja forme
            })
            .catch(error => {
                formMessage.textContent = 'Greška pri slanju: ' + error.message;
                formMessage.style.color = '#E2402A'; // Crvena boja
            });
        });
    }
});