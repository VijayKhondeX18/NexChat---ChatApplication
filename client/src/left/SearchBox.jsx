import { FiSearch } from "react-icons/fi";

function SearchBox({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
      <div className="flex items-center flex-1 bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-700/50">
        <FiSearch className="text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 ml-3 bg-transparent outline-none text-white placeholder:text-gray-500 text-sm"
        />
      </div>
    </div>
  );
}

export default SearchBox;