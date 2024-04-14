checkoutSession

En enkel webbshop där det går att lägga till en order och genomföra en betalning med integration med Stripe.
När man registrerar sig så skapas en användare i stripe, lösenordet krypteras och sparas i en JSON-fil på servern.
Man kan logga in, logga ut, registrera sig och välja produkter samt slutföra köp.

För att bygga projektet gör såhär:

1. Klona repot till datorn och öppna upp i VS code
2. Klistra in .env filen i rooten på server mappen eller skapa en egen .env fil med "STRIPE_SECRET_KEY=sk_test_....."
3. Kör igång servern med hjälp av följande kommandon:
4. cd server
5. npm i
6. förutsätter att du har nodemon installerat lokalt, om du inte har det installera det med hjälp av: npm i nodemon
7. npm start
8. Server is up and running...🌭
9. Öppna en ny terminal
10. Kör igång klienten med hjälp av följande kommandon
11. cd client
12. npm i
13. npm run dev
14. klienten är igång
15. klicka på localhost adressen i terminalen
16. Nu är vi igång!

Projektet uppfyller kraven för G

1. Produkter listas när man klickar på visa produkter.
2. Produkterna är upplagda på Stripe och laddas in på sidan.
3. Produkterna kan läggas till i kundkorgen.
4. Det går att lägga en order genom Stripe.
5. Registrering funkar, användare skapas i webbshoppen och Stripe med gemensamt Id.
6. Man kan logga in användaren används vid genomförd betalning.
7. Går inte att placera en order om man inte är inloggad.
8. Ordrar sparas i JSON-fil på servern
9. Ordern sparas inte om man inte får bekräftelse från stripe
