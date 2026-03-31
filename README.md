# 🌡️ Vertrouwensbarometer — Dominique @ DHL ADC

> *"Sneller bezorgd dan een DHL pakket"*

Een DHL-stijl barometer die het vertrouwen van het ADC-team in Dominique (Team Manager) bijhoudt. Alleen @dhl.com medewerkers kunnen stemmen.

## Features

- 🌡️ Animerende SVG-thermometer (rood → geel → groen)
- 😇/💀 Stemknoppen met 10-minuten rate limiting
- 📦 Easter egg bij score = 0
- 💀 Barst-effect bij score < -50
- 🎉 Confetti bij positieve stemmen
- 🔴 Rood scherm-flash bij negatieve stemmen
- 🗳️ Live updates elke 5 seconden
- 👥 Recente stemmers (initialen avatar)
- 🔐 DHL email login — **geen wachtwoord**, alleen @dhl.com
- 🤝 Terugkerende gebruikers worden herkend op naam
- ⚙️ Admin pagina om score te resetten
- 📦 Zwevende DHL-pakketjes als achtergrond
- 🟡🔴 DHL kleuren (geel/rood)

## Login systeem

Geen wachtwoord nodig. Vul je DHL e-mailadres in (`voornaam.achternaam@dhl.com`).

Het systeem:
1. Valideert dat het een `@dhl.com` adres is in het formaat `voornaam.achternaam`
2. Extraheert je voornaam automatisch (Claire.Gilles@dhl.com → "Claire")
3. Maakt een account aan bij eerste login — of herkent je bij terugkeer
4. Toont je initialen als avatar
5. Onthoudt je via een JWT-sessie (cookie)

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **NextAuth.js** (Credentials provider — DHL email)
- **Prisma + SQLite** (lokaal) / PostgreSQL (prod)
- **Framer Motion** (animaties)

## Setup

### 1. Environment variables

Kopieer `.env.local` en vul in:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genereer-een-sterk-secret-hier
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL=jouw.naam@dhl.com
```

Genereer een secret:
```bash
openssl rand -base64 32
# of: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Database opzetten

```bash
npm run prisma:push
```

### 3. Starten

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin toegang

Zet `ADMIN_EMAIL` in `.env.local` op jouw @dhl.com adres.
Na inloggen verschijnt "Admin" in het gebruikersmenu.

Of via Prisma Studio:
```bash
npm run prisma:studio
# Zet isAdmin = true op een User record
```

## Database schema

```
User
  id, email, firstName, lastName
  isAdmin, createdAt, lastLogin
  votes →

Vote
  id, value (+1/-1), userId, createdAt
```

## Productie (PostgreSQL)

Update `.env.local`:
```
DATABASE_URL="postgresql://user:pass@host:5432/vertrouwen"
```

Update `prisma/schema.prisma` provider naar `postgresql`, dan:
```bash
npm run build
npm start
```
