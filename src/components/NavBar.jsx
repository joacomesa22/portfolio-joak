import { useState } from "react";

const NavBar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div
      id="navbar"
      className="flex justify-between items-center py-[var(--spacer--sm)] z-10"
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
      <div className="hidden sm:flex justify-center items-center gap-4 animate-fade">
        <a
          href="https://www.instagram.com/joacoo.dev/"
          target="_blank"
          className="hover:scale-110 duration-300"
        >
          <img src="./assets/instagram.svg" alt="instagram icon" />
        </a>
        <a
          href="https://www.tiktok.com/@joacoo.dev"
          target="_blank"
          className="hover:scale-110 duration-300"
        >
          <img src="./assets/tiktok.svg" alt="tiktok icon" />
        </a>
      </div>
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
        <div className="flex flex-col justify-center items-center gap-6">
          <a
            href="https://www.instagram.com/joacoo.dev/"
            target="_blank"
            className="hover:scale-110 duration-300"
          >
            <img src="./assets/instagram.svg" alt="instagram icon" />
          </a>
          <a
            href="https://www.tiktok.com/@joacoo.dev"
            target="_blank"
            className="hover:scale-110 duration-300"
          >
            <img src="./assets/tiktok.svg" alt="tiktok icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
