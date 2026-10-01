import { FiSearch } from "react-icons/fi";



function SearchButton() {
  return (
    <button className="search-btn cursor-pointer hover:bg-slate-200" >
     <FiSearch onClick={() => console.log("Search button clicked")}  className="text-xl  text-gray-600" />
    </button>
  );
}

export default SearchButton;