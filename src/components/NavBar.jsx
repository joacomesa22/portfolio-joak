import { useState } from "react";

const NavBar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div
      id="navbar"
      className="flex justify-between items-center p-[var(--spacer--sm)] z-10"
    >
      <div className="hover:scale-105 duration-300">
        <a href="/">
          <img src="./assets/logo.svg" alt="logo" className="animate-fade" />
        </a>
      </div>
      <ul className="hidden sm:flex gap-8">
        <li className="animate-slideDown1">
          <a href="#skillset" className="navLink">
            Skillset
          </a>
        </li>
        <li className="animate-slideDown2">
          <a href="#projects" className="navLink">
            Projects
          </a>
        </li>
        <li className="animate-slideDown3">
          <a href="#about" className="navLink">
            About
          </a>
        </li>
        <li className="animate-slideDown4">
          <a href="#contact" className="navLink">
            Contact
          </a>
        </li>
      </ul>
      <div onClick={handleNav} className="block sm:hidden">
        {!nav ? (
          <img src="./assets/bars.svg" alt="bars" className="h-[34px]" />
        ) : (
          <img src="./assets/xmark.svg" alt="bars" className="h-[40px]" />
        )}
      </div>
      <div
        className={
          !nav
            ? "fixed left-[-100%] top-0 h-full w-[60%] border-r border-r-colorBlue bg-colorDark flex flex-col items-center justify-around z-10"
            : "fixed left-0 top-0 h-full w-[60%] border-r border-r-colorBlue bg-colorDark ease-in-out duration-500 flex flex-col items-center justify-around z-10"
        }
      >
        <ul className="flex flex-col gap-8 items-center bg-colorDark">
          <li className="p-4">
            <a href="#skillset" className="navLink" onClick={handleNav}>
              Skillset
            </a>
          </li>
          <li className="p-4">
            <a href="#projects" className="navLink" onClick={handleNav}>
              Projects
            </a>
          </li>
          <li className="p-4">
            <a href="#about" className="navLink" onClick={handleNav}>
              About
            </a>
          </li>
          <li className="p-4">
            <a href="#contact" className="navLink" onClick={handleNav}>
              Contact
            </a>
          </li>
        </ul>
        <div className="hover:scale-105 duration-300">
          <a href="/">
            <img src="./assets/logo.svg" alt="logo" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
