import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import Magnetic from "./fx/Magnetic";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const sections = navLinks
      .map((n) => document.getElementById(n.id)?.parentElement)
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.querySelector(".hash-span")?.id;
            if (id) setActive(id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center fixed top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-primary/70 backdrop-blur-xl border-b border-white/[0.06]"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            if (window.__lenis) window.__lenis.scrollTo(0);
            else window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt='logo' className='w-9 h-9 object-contain' />
          <p className='text-white text-[18px] font-bold cursor-pointer flex items-center'>
            Himanshu&nbsp;
            <span className='sm:flex hidden items-center gap-2 text-secondary font-medium'>
              <span className='text-white/20'>|</span> AI Engineer
              <span className='relative flex w-2 h-2'>
                <span className='absolute inline-flex h-full w-full rounded-full bg-[#38ef7d] opacity-60 animate-ping' />
                <span className='relative inline-flex rounded-full w-2 h-2 bg-[#38ef7d]' />
              </span>
            </span>
          </p>
        </Link>

        <ul className='list-none hidden sm:flex flex-row gap-2'>
          {navLinks.map((nav) => (
            <li key={nav.id}>
              <Magnetic strength={0.25}>
                <a
                  href={`#${nav.id}`}
                  className={`relative block px-4 py-2 text-[16px] font-medium rounded-full transition-colors ${
                    active === nav.id ? "text-white" : "text-secondary hover:text-white"
                  }`}
                >
                  {active === nav.id && (
                    <motion.span
                      layoutId='nav-pill'
                      className='absolute inset-0 rounded-full bg-white/[0.07] border border-white/10'
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className='relative'>{nav.title}</span>
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>

        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <button type='button' aria-label='Toggle menu' onClick={() => setToggle(!toggle)}>
            <img src={toggle ? close : menu} alt='' className='w-[28px] h-[28px] object-contain' />
          </button>

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 bg-[#0d0a24]/95 backdrop-blur-xl border border-white/10 absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.id ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => setToggle(false)}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
