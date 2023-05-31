"use client";

import { faBars, faFolder, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="sticky flex justify-between items-center p-4">
      <FontAwesomeIcon icon={faBars} size="lg" />
      <Link href="/" className="flex justify-center items-center">
        <FontAwesomeIcon icon={faFolder} size="2xl" />
      </Link>
      <FontAwesomeIcon icon={faSearch} size="lg" />
    </nav>
  );
};

export default Navbar;
