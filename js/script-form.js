// ===================================Slanje fome kroz Cloudflare Worker (JSON VERZIJA)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const workerEndpoint = 'https://email-sender-lubis.borisbokan.workers.dev/';
  form.addEventListener('submit', function (event) {
      
    const workerEndpoint = 'https://email-sender-lubis.borisbokan.workers.dev/';

        event.preventDefault();

        const formData = new FormData(form);
        // Konvertovanje FormData u plain JavaScript objekat (JSON)
        const jsonData = {};
        formData.forEach((value, key) => jsonData[key] = value);

        fetch(workerEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // KLJUČNA PROMENA: Šaljemo JSON
            },
            body: JSON.stringify(jsonData), // Šaljemo JSON string
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP greška: ${response.status}`);
            }
        })
        .then(data => {
            if (data.success) {
                // Prikaz uspeha
                alert('Poruka je uspešno poslata!');
                form.reset(); 
            } else {
                alert('Greška pri slanju: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Lokalna greška:', error);
            alert('Došlo je do greške na klijentskoj strani ili Workeru: ' + error.message);
        });
    });
});