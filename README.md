Checkout Session

Client
   "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3"
Server
    "bcrypt": "^5.1.1",
    "cookie-session": "^2.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "stripe": "^14.24.0"

1. Produkter listas när man klickar på visa kundkorg
2. Produkterna finns på stripe och laddas in på sidan
3. Produkterna kan läggas till i kundkorgen
4. Går att lägga en order genom Stripe
5. Registrering funkar, användare skapas i webbshoppen och stripe
6. man kan logga in och logga ut
7. går inte att placera en order om man inte är inloggad
8. sparas i JSON fil
9. ordern sparas inte om man inte får bekräftelse från stripe
