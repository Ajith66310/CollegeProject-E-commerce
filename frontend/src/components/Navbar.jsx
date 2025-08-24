import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setProfileOpen(false);
  };

  // close dropdown on outside click
  useEffect(() => {
    const onOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      {/* Logo */}
      <Link to="/"><img src={assets.logo} className="w-36" alt="Logo" /></Link>

      {/* Nav links (desktop) */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/shop" className="flex flex-col items-center gap-1">
          <p>SHOP</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
        />

        {/* Profile + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            onClick={() => {
              if (!token) return navigate('/login');
              setProfileOpen((v) => !v);
            }}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="Profile"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          />
          {/* On desktop, also show on hover; on mobile, show when profileOpen === true */}
          {token && (
            <div
              className={`absolute right-0 pt-4 z-50 ${profileOpen ? 'block' : 'hidden'
                } sm:group-hover:block`}
            >
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
                {/* <button
                  onClick={() => setProfileOpen(false)}
                  className="text-left cursor-pointer hover:text-black"
                >
                  My Profile
                </button> */}
                <button
                  onClick={() => {
                    navigate('/orders');
                    setProfileOpen(false);
                  }}
                  className="text-left cursor-pointer hover:text-black"
                >
                  Orders
                </button>
                <button
                  onClick={logout}
                  className="text-left cursor-pointer hover:text-black"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Sidebar Overlay for small screen */}
      <div
        className={`fixed inset-0 z-50 bg-black/90 transition-all ${visible ? 'block' : 'hidden'
          }`}
      >
        {/* Sidebar content */}
        <div className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer border-b"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="block py-3 px-6 border-b text-gray-700"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="block py-3 px-6 border-b text-gray-700"
            to="/shop"
          >
            SHOP
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="block py-3 px-6 border-b text-gray-700"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="block py-3 px-6 border-b text-gray-700"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
