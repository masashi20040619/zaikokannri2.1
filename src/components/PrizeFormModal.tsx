import React, { useEffect, useMemo, useState } from "react";
import { Prize, PrizeCategory, PrizeImage } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Prize) => void;
  editingPrize: Prize | null;
};

const categories: PrizeCategory[] = [
  "フィギュア",
  "ぬいぐるみ",
  "キーホルダー",
  "雑貨",
  "その他",
];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export default function PrizeFormModal({ isOpen, onClose, onSave, editingPrize }: Props) {
  const isEdit = !!editingPrize;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<PrizeCategory>("その他");
  const [quantity, setQuantity] = useState(0);
  const [note, setNote] = useState("");
  const [images, setImages] = useState<PrizeImage[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPrize) {
      setName(editingPrize.name);
      setCategory(editingPrize.category);
      setQuantity(editingPrize.quantity);
      setNote(editingPrize.note ?? "");
      setImages(editingPrize.images ?? []);
    } else {
      setName("");
      setCategory("その他");
      setQuantity(0);
      setNote("");
      setImages([]);
    }
  }, [isOpen, editingPrize]);

  const canSave = useMemo(() => name.trim().length > 0 && !saving, [name, saving]);

  const onPickImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);

    // 重すぎる画像で落ちるのを避けるため、まず最大枚数を制限（必要なら増やしてOK）
    const limited = arr.slice(0, 10);

    const next: PrizeImage[] = [];
    for (const f of limited) {
      const dataUrl = await fileToDataUrl(f);
      next.push({ id: uid(), dataUrl, name: f.name });
    }
    setImages((prev) => [...prev, ...next]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((x) => x.id !== id));
  };

  const submit = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      const now = Date.now();
      const prize: Prize = {
        id: editingPrize?.id ?? uid(),
        name: name.trim(),
        category,
        quantity: Number.isFinite(quantity) ? quantity : 0,
        note: note.trim() ? note.trim() : undefined,
        images: images.length ? images : undefined,
        createdAt: editingPrize?.createdAt ?? now,
        updatedAt: now,
      };

      await Promise.resolve(onSave(prize));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isEdit ? "編集" : "追加"}</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700"
          >
            閉じる
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">名前</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none"
                placeholder="例：ドラゴンのフィギュア"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PrizeCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-300">数量</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value || "0", 10))}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none"
                min={0}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">メモ</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 outline-none"
                placeholder="例：イベント用、箱あり"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-300">画像（複数可）</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onPickImages(e.target.files)}
              className="block w-full text-sm"
            />

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.dataUrl}
                      alt=""
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-lg px-2 py-1"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700"
          >
            キャンセル
          </button>
          <button
            onClick={submit}
            disabled={!canSave}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}
