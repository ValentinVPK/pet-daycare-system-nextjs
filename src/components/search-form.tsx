"use client";

import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();

  return (
    <form className="w-full h-full">
      <input
        type="search"
        placeholder="Search pets"
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        onChange={(e) => {
          handleChangeSearchQuery(e.target.value);
        }}
        value={searchQuery}
      />
    </form>
  );
}
