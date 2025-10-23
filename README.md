# eonion – 3D Print Gallery

This is a simple React + Tailwind site that lists your 3D prints. Clicking a card opens the item's eBay page in a new tab.

## Run locally
1. Install Node.js (v18+ recommended).
2. In a terminal, install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Vite will show a local URL (usually http://localhost:5173). Open it in your browser.

## Customize products
Edit `src/App.jsx`. Find the `PRODUCTS` array and update fields:
```js
{
  id: 9,
  title: "Your Product Name",
  price: 12.34,
  category: "Accessories",
  material: "PLA",
  color: "Black",
  printedOn: "2025-10-17",
  image: "/images/my-print.jpg", // or a full https:// URL
  ebayUrl: "https://www.ebay.com/itm/XXXXXXXXXX"
}
```
- **title**: What shows on the card.
- **image**: Can be a full URL (https://...) or a local file in `public/images/` using `/images/filename.jpg`.
- **ebayUrl**: Paste the exact eBay listing link (starts with https://).
- **printedOn**: ISO date (YYYY-MM-DD) for sorting by newest.
- **category/material/color/price**: Used for filters and display.

To use local images, put files into `public/images/` (create it if missing) and reference as `/images/yourfile.jpg`.

## Build for deployment
```bash
npm run build
npm run preview   # optional local preview of the production build
```
The production build is generated in the `dist/` folder. You can deploy it to Netlify, Vercel, GitHub Pages, or any static host.
