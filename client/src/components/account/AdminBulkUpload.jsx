
import { useState } from "react";
import api from "../../api/axios";

const sheets = [
  "Suits",
  "Blazers",
  "Tuxedos",
  "100% Cotton",
  "Cotton-Silk Blend",
  "Cotton-Polyester Blend",
  "Pants",
  "Overcoats",
  "Trench Coats",
  "Leather Jackets",
  "Belts",
  "Ties & Bow Ties",
  "Pocket Squares",
  "Cufflinks & Tie Bars",
  "Suspenders & Braces",
  "Scarves & Gloves",
  "Shoes",
  "Long Sleeve",
  "Short Sleeve",
  "Polo Shirts",
  "Hoodies",
  "Sweatshirts",
  "Chinos",
  "Casual & Sweatpants",
  "Wallets",
  "Hand Bags",
];

export default function ProductSheetSync() {
  const [loading, setLoading] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function syncSheet(sheet) {
    setLoading(sheet || "ALL");
    setResult(null);
    setError("");

    try {
      const response = await api.post(
        "/sync/products",
        null,
        {
          params: sheet ? { sheet } : {},
        }
      );

      const data = response.data;
      setResult(data);

      if (data.success === false) {
        setError("Sync finished with errors. Check the report below.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to sync products."
      );
    } finally {
      setLoading("");
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Product Catalogue Sync
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Import or update products from Google Sheets.
          </p>
        </div>

        <button
          onClick={() => syncSheet(null)}
          disabled={Boolean(loading)}
          className="rounded-lg bg-black px-5 py-3 text-white
                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading === "ALL"
            ? "Syncing all sheets..."
            : "Sync All Sheets"}
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-300
                        bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sheets.map((sheet) => (
          <div
            key={sheet}
            className="flex items-center justify-between gap-3
                       rounded-xl border border-gray-200 p-4"
          >
            <div className="min-w-0">
              <h2 className="font-semibold">{sheet}</h2>
              <p className="mt-1 text-xs text-gray-500">
                Google Sheets tab
              </p>
            </div>

            <button
              onClick={() => syncSheet(sheet)}
              disabled={Boolean(loading)}
              className="shrink-0 rounded-lg border px-4 py-2
                         text-sm font-medium hover:bg-gray-100
                         disabled:opacity-50"
            >
              {loading === sheet ? "Syncing..." : "Sync"}
            </button>
          </div>
        ))}
      </div>

      {result && (
        <section className="mt-8 rounded-xl border p-5">
          <h2 className="text-lg font-bold">Sync Report</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Created", result.totals?.created ?? 0],
              ["Updated", result.totals?.updated ?? 0],
              ["Skipped", result.totals?.skipped ?? 0],
              ["Errors", result.totals?.errors ?? 0],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg bg-gray-100 p-4"
              >
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            {result.sheets?.map((item) => (
              <div
                key={item.sheet}
                className="border-b pb-4 last:border-0"
              >
                <h3 className="font-semibold">{item.sheet}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Created: {item.created} · Updated: {item.updated}
                  {" · "}Skipped: {item.skipped}
                </p>

                {item.errors?.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-red-600">
                    {item.errors.map((e, index) => (
                      <li key={`${e.row}-${index}`}>
                        Row {e.row}: {e.product} — {e.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

