// Globalna varijabla za čuvanje instance Swipera, neophodno za ispravno uništavanje
window.modalSwiperInstance = null;

function openModal(element) {
    // 1. Pronalazimo elemente: Slike i kontejner kategorije
    // Koristimo .swiper-category-wrapper jer je to stabilan roditelj
    const categoryWrapper = element.closest('.swiper-category-wrapper');
    if (!categoryWrapper) {
        console.error("Greška: Roditeljski '.swiper-category-wrapper' nije pronađen.");
        return;
    }
    
    // Slike su sada DIV-ovi sa klasom .gallery-image-wrapper
    const allThumbnails = categoryWrapper.querySelectorAll('.gallery-image-wrapper');
    
    // 2. Pronalazimo indeks kliknutog elementa (startnu poziciju)
    const allThumbnailsArray = Array.from(allThumbnails);
    let startIndex = allThumbnailsArray.indexOf(element);
    
    if (startIndex === -1) {
        console.error("Greška: Kliknuti element nije pronađen u listi sličica.");
        return;
    }

    // 3. Očisti modal wrapper (mesto gde Swiper pravi slajdove)
    const modalWrapper = document.getElementById('modal-swiper-wrapper');
    modalWrapper.innerHTML = '';

    // 4. Kreiraj slajdove za modal (ubacujemo IMG tagove sa data-full URL-om)
    allThumbnails.forEach((thumb) => {
        const fullSrc = thumb.getAttribute('data-full');
        const altText = thumb.getAttribute('data-alt');
        
        const newSlide = document.createElement('div');
        newSlide.className = 'swiper-slide';
        
        // U modalu koristimo standardni IMG tag
        newSlide.innerHTML = `
            <img src="${fullSrc}" alt="${altText}" class="img-fluid" style="max-height: 85vh; width: auto;">
        `;
        modalWrapper.appendChild(newSlide);
    });

    // 5. Otvori modal
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();

    // 6. Inicijalizuj modal swiper NAKON ŠTO SE MODAL POTPUNO PRIKAŽE
    // Događaj 'shown.bs.modal' je ključan za rad Swiper strelica
    document.getElementById('imageModal').addEventListener('shown.bs.modal', function handler() {
        
        // Uništavamo prethodnu instancu ako postoji
        if (window.modalSwiperInstance) {
            window.modalSwiperInstance.destroy(true, true);
        }
        
        // Inicijalizacija nove instance
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
        
        // Ručno vraćamo display strelica, za svaki slučaj (ako su negde skrivene)
        const nextBtn = document.querySelector('.custom-swiper-modal-next');
        const prevBtn = document.querySelector('.custom-swiper-modal-prev');
        if (nextBtn && prevBtn) {
            nextBtn.style.display = 'flex';
            prevBtn.style.display = 'flex';
        }

        // Uklanjamo ovaj event listener nakon pokretanja
        this.removeEventListener('shown.bs.modal', handler);

    }); 
}

// Dodatne funkcije za inicijalizaciju Swipera na galeriji (ako ih nisi imao)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.image-swiper').forEach(el => {
        const nextEl = el.closest('.swiper-category-wrapper').querySelector('.category-nav-btn.swiper-button-next');
        const prevEl = el.closest('.swiper-category-wrapper').querySelector('.category-nav-btn.swiper-button-prev');

        new Swiper(el, {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            navigation: {
                nextEl: nextEl,
                prevEl: prevEl,
            },
            breakpoints: {
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                992: {
                    slidesPerView: 4,
                    spaceBetween: 30
                }
            }
        });
    });
});