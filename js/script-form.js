// Worker kod za MailChannels - FINALNA JSON VERZIJA (ZAOBILAZI DNS)
const RECIPIENT_EMAIL = 'zeljkosegrt7@gmail.com'; 

// KLJUČNA PROMENA: Pošiljalac je sada Vaš privatni email
const SENDER_EMAIL = 'zeljkosegrt7@gmail.com'; 

export default {
  async fetch(request, env, ctx) { 
    
    // ... (Svi cors/options delovi ostaju isti) ...
    
    try {
      // ... (Parsiranje jsonData) ...
      const ime = jsonData.ime ? jsonData.ime.trim() : '';
      const email = jsonData.email ? jsonData.email.trim() : ''; // Email klijenta
      // ...
      
      const subject = `Novi Upit sa Sajta od: ${ime}`;
      const emailBody = `Ime: ${ime}\nEmail: ${email}\n\nPoruka:\n${poruka}`; 

      const mailChannelsResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          personalizations: [
            { 
              to: [{ email: RECIPIENT_EMAIL }],
              // KORISTIMO EMAIL KLIJENTA ZA ODGOVOR
              headers: { 'Reply-To': email } 
            }
          ],
          // Slanje sa Vašeg Gmail-a
          from: { email: SENDER_EMAIL, name: `Lubis Interijeri (Upit od: ${ime})` },
          subject: subject,
          content: [{ type: 'text/plain', value: emailBody }], 
        }),
      });

      // ... (Provera statusa i vraćanje odgovora) ...
      
    } catch (error) {
      // ...
    }
  },
};