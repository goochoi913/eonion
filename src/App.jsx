/*
  eonion – 3D Print Gallery
  Local image-first setup (public/images/*). Falls back to converting Drive links.
*/

import React, { useMemo, useState } from "react";

// Convert Google Drive share links to a direct image URL when needed.
function driveToImgSrc(url) {
  if (!url) return url;
  if (!url.includes("drive.google.com")) return url; // not a Drive link
  const m1 = url.match(/\/file\/d\/([^/]+)/);
  const m2 = url.match(/[?&]id=([^&]+)/);
  const id = (m1 && m1[1]) || (m2 && m2[1]) || "";
  if (!id) return url;
  return `https://lh3.googleusercontent.com/d/${id}=w1600`;
}

// Placeholder if an image fails to load
const PLACEHOLDER_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='%23e2e8f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'>Image unavailable</text></svg>";

const PRODUCTS = [
  {
    id: 1,
    title: "Elephant Ring Holder",
    price: 8.99,
    category: "Toys",
    material: "PLA",
    color: "Gold",
    printedOn: "2025-08-12",
    image: "images/elephant-ring-holder.JPG", // remove leading slash
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 2,
    title: "Articulated Desk Banana",
    price: 9.5,
    category: "Accessories",
    material: "PLA",
    color: "Yellow",
    printedOn: "2025-09-02",
    image: "images/articulated-banana.jpg",
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 3,
    title: "Mew",
    price: 9.99,
    category: "Toys",
    material: "PLA+",
    color: "Rainbow",
    printedOn: "2025-07-22",
    image: "images/mew.jpg",
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 4,
    title: "Articulated Capybara (blue)",
    price: 6.99,
    category: "Organization",
    material: "PLA",
    color: "Blue",
    printedOn: "2025-05-10",
    image: "images/capybara-blue.jpg",
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 5,
    title: "Articulated Capybara (pink)",
    price: 6.99,
    category: "Accessories",
    material: "PETG",
    color: "Pink",
    printedOn: "2025-10-01",
    image: "images/capybara-pink.jpg",
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 6,
    title: "Spiral Fidget",
    price: 4.99,
    category: "Organization",
    material: "PLA",
    color: "White",
    printedOn: "2025-06-15",
    image: "images/spiral-fidget.jpg",
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 7,
    title: "Mini P.E.K.K.A (pancakes)",
    price: 11.49,
    category: "Planters",
    material: "PLA",
    color: "Terracotta",
    printedOn: "2025-09-18",
    image: "images/pekkas.jpg",
    ebayUrl: "https://www.ebay.com",
  },
  {
    id: 8,
    title: "Balisong Comb",
    price: 5.99,
    category: "Organization",
    material: "PETG",
    color: "Charcoal",
    printedOn: "2025-08-30",
    image: "images/balisong-comb.JPG",
    ebayUrl: "https://www.ebay.com",
  },
];

function formatPrice(n) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function resolveImage(url) {
  return url?.includes("drive.google.com") ? driveToImgSrc(url) : url;
}

function ProductCard({ item }) {
  // build full URL including base path for public assets
  const base = import.meta.env.BASE_URL;
  const localSrc = item.image.startsWith("images/")
    ? `${base}${item.image}`
    : resolveImage(item.image);

  return (
    <a
      href={item.ebayUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title} – view on eBay`}
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={localSrc}
          onError={(e) => {
            const u = item.image || "";
            const m1 = u.match(/\/file\/d\/([^/]+)/);
            const m2 = u.match(/[?&]id=([^&]+)/);
            const id = (m1 && m1[1]) || (m2 && m2[1]);
            if (id && !e.currentTarget.dataset.retry) {
              e.currentTarget.dataset.retry = "1";
              e.currentTarget.src = `https://drive.google.com/uc?export=download&id=${id}`;
            } else {
              e.currentTarget.src = PLACEHOLDER_SVG;
            }
          }}
          referrerPolicy="no-referrer"
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900" title={item.title}>
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {item.category} · {item.material} · {item.color}
          </p>
          <p className="mt-1 text-xs text-slate-500">Printed on {formatDate(item.printedOn)}</p>
        </div>
        <div className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 text-sm font-bold text-slate-900">
          {formatPrice(item.price)}
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => ["all", ...new Set(PRODUCTS.map((p) => p.category))], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const inCategory = category === "all" || p.category === category;
      const text = `${p.title} ${p.category} ${p.material} ${p.color}`.toLowerCase();
      const matches = !q || text.includes(q);
      return inCategory && matches;
    });
    list.sort((a, b) => {
      if (sort === "newest") return new Date(b.printedOn) - new Date(a.printedOn);
      if (sort === "priceLowHigh") return a.price - b.price;
      if (sort === "priceHighLow") return b.price - a.price;
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });
    return list;
  }, [query, sort, category]);

  const base = import.meta.env.BASE_URL;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={`${base}images/logo.png`}
                alt="eonion logo"
                className="h-9 w-9 rounded-xl object-cover shadow"
              />
              <div>
                <div className="text-xl font-extrabold tracking-tight">eonion</div>
                <div className="-mt-1 text-xs text-slate-600">3D prints · Shop via eBay</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>eonion</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ethan’s finely printed Toys, sold on eBay
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse the gallery below. Click any item to jump straight to its eBay listing and checkout there.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="col-span-1 sm:col-span-2">
              <span className="sr-only">Search products</span>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-indigo-300 placeholder:text-slate-400 focus:ring-2"
                placeholder="Search by name, category, or material…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="flex gap-2">
              <select
                aria-label="Filter by category"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-indigo-300 focus:ring-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All categories" : c}
                  </option>
                ))}
              </select>

              <select
                aria-label="Sort products"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-indigo-300 focus:ring-2"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="priceLowHigh">Price: Low → High</option>
                <option value="priceHighLow">Price: High → Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No results. Try a different search or category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-slate-600 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p>© {new Date().getFullYear()} eonion. All rights reserved.</p>
            <p>Built with ❤ — Click any item to buy on eBay.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
