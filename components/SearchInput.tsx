import React from "react";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
  return (
    <div>
      <Input
        type="text"
        placeholder="search"
        className="bg-[#EDF3F8]  rounded-lg "
      />
    </div>
  );
};

export default SearchInput;
