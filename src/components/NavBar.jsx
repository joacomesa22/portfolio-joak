import { useState } from "react";

const NavBar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navLinks = [
    { href: "#skillset", label: "Skillset", animation: "animate-slideDown1" },
    { href: "#projects", label: "Projects", animation: "animate-slideDown2" },
    { href: "#about", label: "About", animation: "animate-slideDown3" },
    { href: "#contact", label: "Contact", animation: "animate-slideDown4" },
  ];

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
        {navLinks.map((link, idx) => (
          <li key={link.href} className={link.animation}>
            <a href={link.href} className="navLink">
              {link.label}
            </a>
          </li>
        ))}
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
          {navLinks.map((link) => (
            <li key={link.href} className="p-4">
              <a href={link.href} className="navLink" onClick={handleNav}>
                {link.label}
              </a>
            </li>
          ))}
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
