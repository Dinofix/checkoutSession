checkoutSession

En enkel webbshop där det går att lägga till en order och genomföra en betalning med integration med Stripe.
När man registrerar sig så skapas en användare i stripe, lösenordet krypteras och sparas i en JSON-fil på servern.
Man kan logga in, logga ut, registrera sig och välja produkter samt slutföra köp.

För att bygga projektet gör såhär:

1. Klona repot till datorn och öppna upp i VS code
2. Klistra in .env filen i rooten på server mappen eller skapa en egen .env fil med "STRIPE_SECRET_KEY=sk_test_....."
3. Öppna en terminal
4. Kör igång servern med hjälp av följande kommandon:
5. cd server
6. npm i
7. förutsätter att du har nodemon installerat lokalt, om du inte har det installera det med hjälp av: npm i nodemon
8. npm start
9. Server is up and running...🌭
10. Öppna en ny terminal
11. Kör igång klienten med hjälp av följande kommandon
12. cd client
13. npm i
14. npm run dev
15. klienten är igång
16. klicka på localhost adressen i terminalen
17. Nu är vi igång!

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
