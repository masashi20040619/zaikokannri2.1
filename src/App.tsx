import React, { useEffect, useMemo, useState } from "react";
import { Prize, PrizeCategory } from "./types";
import { StorageService } from "./services/storage";

import PrizeList from "./components/PrizeList";
import PrizeFormModal from "./components/PrizeFormModal";

import PlusIcon from "./components/icons/PlusIcon";
import SearchIcon from "./components/icons/SearchIcon";
import Squares2x2Icon from "./components/icons/Squares2x2Icon";
import QueueListIcon from "./components/icons/QueueListIcon";

const categories: PrizeCategory[] = [
  "フィギュア",
  "ぬいぐるみ",
  "キーホルダー",
  "雑貨",
  "その他",
];

export default function App() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PrizeCategory | "ALL">("ALL");

  const [view, setView] = useState<"grid" | "list">("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Prize | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await StorageService.getAll();
        all.sort((a, b) => b.updatedAt - a.updatedAt);
        setPrizes(all);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prizes.filter((p) => {
      const hitName = p.name.toLowerCase().includes(q);
      const hitNote = (p.note ?? "").toLowerCase().includes(q);
      const hitCat = category === "ALL" ? true : p.category === category;
      return (q ? hitName || hitNote : true) && hitCat;
    });
  }, [prizes, query, category]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (prize: Prize) => {
    setEditing(prize);
    setModalOpen(true);
  };

  const upsert = async (prize: Prize) => {
    await StorageService.put(prize);
    setPrizes((prev) => {
      const exists = prev.some((x) => x.id === prize.id);
      const next = exists ? prev.map((x) => (x.id === prize.id ? prize : x)) : [prize, ...prev];
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      return next;
    });
  };

  const remove = async (id: string) => {
    await StorageService.delete(id);
    setPrizes((prev) => prev.filter((x) => x.id !== id));
  };

  const changeQty = async (id: string, newQty: number) => {
    setPrizes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: newQty, updatedAt: Date.now() } : p
      )
    );

    const p = prizes.find((x) => x.id === id);
    if (!p) return;
    await StorageService.put({ ...p, quantity: newQty, updatedAt: Date.now() });
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">在庫管理</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              ブラウザ内（IndexedDB）に保存。画像を複数入れても落ちにくい構成。
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
          >
            <PlusIcon />
            追加
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <div className="w-5 h-5 text-slate-500">
                <SearchIcon />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none border-b border-slate-200 dark:border-slate-700 py-1"
                placeholder="検索（名前/メモ）"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none"
              >
                <option value="ALL">全カテゴリ</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-xl ${view === "grid" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-700"}`}
                aria-label="grid"
              >
                <Squares2x2Icon />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-xl ${view === "list" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-700"}`}
                aria-label="list"
              >
                <QueueListIcon />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-600 dark:text-slate-300">読み込み中...</div>
        ) : (
          <PrizeList
            prizes={filtered}
            viewMode={view}
            onEdit={openEdit}
            onDelete={remove}
            onQuantityChange={changeQty}
          />
        )}

        <PrizeFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={upsert}
          editingPrize={editing}
        />
      </div>
    </div>
  );
}
