import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";

const SearchBar = ({
  placeholderText,
  searchString,
  setSearchString,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholderText || "Search..."}
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {sortBy ? (
        <Button
          variant="outline"
          onClick={() => setSortBy(sortBy === "ASC" ? "DESC" : "ASC")}
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by ID {sortBy === "ASC" ? "↑" : "↓"}
        </Button>
      ) : (
        <></>
      )}
      {/* Sort */}
    </div>
  );
};

export default SearchBar;
