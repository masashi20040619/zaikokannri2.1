import React from "react";
import { Prize } from "../types";
import PencilIcon from "./icons/PencilIcon";
import TrashIcon from "./icons/TrashIcon";
import ImageIcon from "./icons/ImageIcon";

type Props = {
  prize: Prize;
  onEdit: (p: Prize) => void;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
};

export default function PrizeCard({ prize, onEdit, onDelete, onQuantityChange }: Props) {
  const thumb = prize.images?.[0]?.dataUrl;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 shadow overflow-hidden">
      <div className="relative">
        {thumb ? (
          <img src={thumb} className="w-full h-40 object-cover" alt="" />
        ) : (
          <div className="w-full h-40 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
            <div className="w-10 h-10">
              <ImageIcon />
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onEdit(prize)}
            className="p-2 rounded-xl bg-black/60 text-white hover:bg-black/75"
            aria-label="編集"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(prize.id)}
            className="p-2 rounded-xl bg-black/60 text-white hover:bg-black/75"
            aria-label="削除"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold truncate">{prize.name}</h3>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {prize.category}
              {prize.images?.length ? ` ・画像${prize.images.length}枚` : ""}
            </div>
          </div>
        </div>

        {prize.note ? (
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
            {prize.note}
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            数量
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuantityChange(prize.id, Math.max(0, prize.quantity - 1))}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 hover:opacity-90"
            >
              -
            </button>
            <span className="w-10 text-center font-mono text-lg">{prize.quantity}</span>
            <button
              onClick={() => onQuantityChange(prize.id, prize.quantity + 1)}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 hover:opacity-90"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
