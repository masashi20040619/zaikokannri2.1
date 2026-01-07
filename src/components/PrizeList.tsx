import React from "react";
import { Prize } from "../types";
import PrizeCard from "./PrizeCard";

type Props = {
  prizes: Prize[];
  viewMode: "grid" | "list";
  onEdit: (p: Prize) => void;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
};

export default function PrizeList({
  prizes,
  viewMode,
  onEdit,
  onDelete,
  onQuantityChange,
}: Props) {
  if (prizes.length === 0) {
    return (
      <div className="text-slate-600 dark:text-slate-300">
        データがありません（追加してみて）
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-3"
      }
    >
      {prizes.map((p) => (
        <PrizeCard
          key={p.id}
          prize={p}
          onEdit={onEdit}
          onDelete={onDelete}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
}
