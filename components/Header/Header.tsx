import React from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon as SearchIcon,
  ShoppingCartIcon,
  Bars3Icon as MenuIcon,
} from "@heroicons/react/24/outline";

function Header() {
  return (
    <header>
      {/* Top Navbar */}
      <div className="flex items-center bg-amazon-blue px-4 py-2 grow space-x-2">
        <div className="mt-2 flex items-center grow sm:grow-0">
          <Image
            src="https://links.papareact.com/f90"
            width={150}
            height={40}
            alt="logo"
            className="cursor-pointer"
            objectFit="contain"
          />
        </div>
        {/* Search */}
        <div className="hidden sm:flex items-center h-10 rounded-md grow cursor-pointer bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 mt-[-8px]">
          <input
            className="p-2 h-full w-6 grow shrink rounded-l-md focus:outline-none bg-white"
            type="text"
            placeholder="Search"
          />
          <SearchIcon className="h-12 p-4" />
        </div>

        {/* Right */}
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div className="link">
            <p>Hello, Md Sadikur Rahman</p>
            <p className="font-extrabold md:text-sm">Account & Lists</p>
          </div>
          <div className="link">
            <p className="font-extrabold md:text-sm">Returns</p>
            <p className="font-extrabold md:text-sm">& Orders</p>
          </div>
          <div className="link relative flex items-center">
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 rounded-full text-center text-black font-bold">
              4
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2">
              Basket
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div></div>
    </header>
  );
}

export default Header;
