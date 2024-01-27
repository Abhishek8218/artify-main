'use client'


import "@styles/Navbar.scss";
import { Menu, Close, Person, Search, ShoppingCart } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [dropDownMenu, setDropDownMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const handleLogout = async () => {
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");
  const router = useRouter();

  const searchWork = async () => {
    router.push(`/search/${query}`);
  };

  const cart = user?.cart;

  const handleCloseMenu = () => {
    setDropDownMenu(false);
  };

  return (
    <nav className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>
      <div className="navbar_search">
        <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <IconButton disabled={query === ""} onClick={searchWork}>
          <Search sx={{ color: "red" }} />
        </IconButton>
      </div>
      <div className="navbar_right">
        {user && (
          <a href="/cart" className="cart">
            <ShoppingCart sx={{ color: "gray" }} />
            <span>({cart?.length})</span>
          </a>
        )}
        <button className="navbar_right_account" onClick={() => setDropDownMenu(!dropDownMenu)}>
          {dropDownMenu ? <Close sx={{ color: "gray" }} /> : <Menu sx={{ color: "gray" }} />}
          {!user ? <Person sx={{ color: "gray" }} /> : <img src={`data:image/*;base64,${Buffer.from(user.profileImage.data).toString("base64")}`} alt="profile" style={{ objectFit: "fill", borderRadius: "50%", height: "40px" }} />}
        </button>
        {dropDownMenu && !user && (
          <div className="navbar_right_accountmenu" ref={menuRef}>
            <Link href="/login" onClick={handleCloseMenu}>
              Login
            </Link>
            <Link href="/register" onClick={handleCloseMenu}>
              SignUP
            </Link>
          </div>
        )}
        {dropDownMenu && user && (
          <div className="navbar_right_accountmenu" ref={menuRef}>
            <Link href="/wishlist" onClick={handleCloseMenu}>
              Wishlist
            </Link>
            <Link href="/cart" onClick={handleCloseMenu} className="cart2">
              {" "}
              <ShoppingCart sx={{ color: "gray" }} />
              <span>({cart?.length})</span>
            </Link>
            <Link href="/order" onClick={handleCloseMenu}>
              Orders
            </Link>
            <Link href={`/shop?id=${user._id}`} onClick={handleCloseMenu}>
              Your Shop
            </Link>
            <Link href="/create-work" onClick={handleCloseMenu}>
              Sell Your Work
            </Link>
            <a onClick={handleLogout}>Log Out</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
