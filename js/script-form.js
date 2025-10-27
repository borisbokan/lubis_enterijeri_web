// ===================================
    // SLANJE FORME
    // ===================================
    const form = document.getElementById('contactForm');
    // KLJUČNO: KORISTIMO WORKERS ROUTE
    const workerEndpoint = 'https://lubisenterijeri.com/api/email'; 

    if (form) {
        form.addEventListener('submit', function (event) {
            
            if (form.checkValidity()) {
                event.preventDefault(); 
                
                const formData = new FormData(form);
                const jsonData = {};
                formData.forEach((value, key) => jsonData[key] = value);

                fetch(workerEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(jsonData), 
                })
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error(`HTTP greška: ${response.status}`);
                })
                .then(data => {
                    if (data.success) {
                        alert('Poruka je uspešno poslata!');
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        alert('Greška pri slanju: ' + data.message);
                    }
                })
                .catch(error => {
                    alert('Došlo je do greške: ' + error.message);
                });
            }
        });
    }



