import { useEffect } from "react";

// المقاسات الحقيقية هتيجي من العميل، فكل القيم هنا Placeholder.
export default function SizeGuide({ open, onClose, sizes = ["S", "M", "L", "XL"] }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        className="relative w-full max-w-lg rounded-t-[28px] bg-surface p-6 sm:rounded-[28px] sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="size-guide-title" className="text-3xl">
              Size guide
            </h2>
            <p className="mt-1 text-sm text-muted">
              Measurements in cm. [SIZE CHART PENDING FROM CLIENT]
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-pink-soft focus-visible:outline-2 focus-visible:outline-pink"
            aria-label="Close size guide"
          >
            ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="py-3 font-medium">Size</th>
                <th className="py-3 font-medium">Bust</th>
                <th className="py-3 font-medium">Waist</th>
                <th className="py-3 font-medium">Hips</th>
                <th className="py-3 font-medium">Length</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((s) => (
                <tr key={s} className="border-b border-border last:border-0">
                  <td className="py-3 font-semibold text-ink">{s}</td>
                  <td className="py-3 text-muted">[TBD]</td>
                  <td className="py-3 text-muted">[TBD]</td>
                  <td className="py-3 text-muted">[TBD]</td>
                  <td className="py-3 text-muted">[TBD]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}