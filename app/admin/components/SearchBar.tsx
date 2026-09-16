"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="🔍 Buscar productos por nombre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-300 bg-white p-4 text-lg shadow-sm outline-none transition focus:border-black"
      />
    </div>
  );
}