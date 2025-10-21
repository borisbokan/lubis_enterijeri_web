// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
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
            // Prilagođavanje za različite veličine ekrana (da bude mock-up 3 slajda)
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

    // 2. Inicijalizacija Slajdera Slika (za svaku kategoriju)
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

});


// ===================================
// FUNKCIONALNOST MODALNOG PROZORA
// ===================================

let modalSwiper = null;
const imageModalElement = document.getElementById('imageModal'); // Dohvati modalni element

// 1. Definišemo funkciju openModal
window.openModal = function(clickedImage) {
    // ... (OSTATAK openModal KODA: Traženje slika, punjenje modalWrapper-a) ...

    const categoryDiv = clickedImage.closest('.image-swiper');
    const categoryImages = categoryDiv.querySelectorAll('.gallery-thumb');
    const modalWrapper = document.getElementById('modal-swiper-wrapper');

    // 1. Priprema sadržaja modala
    modalWrapper.innerHTML = '';
    
    // 2. Dinamičko popunjavanje modala svim slikama iz iste kategorije
    let initialSlideIndex = 0;
    categoryImages.forEach((img, index) => {
        const fullSrc = img.getAttribute('data-full');
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        
        slide.innerHTML = `<img src="${fullSrc}" class="img-fluid" alt="Uvećana slika">`;
        modalWrapper.appendChild(slide);

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
            nextEl: '.custom-swiper-modal-next', // Koristimo klase definisane za Modal u HTML-u
            prevEl: '.custom-swiper-modal-prev',
        },
        pagination: {
            el: '.custom-swiper-pagination',
            type: 'fraction', 
        },
    });
});