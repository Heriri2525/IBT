function Navbar({ menuOpen, setMenuOpen }) {

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <a
        href="#home"
        className="nav-logo"
        onClick={closeMenu}
      >
        H<span>.</span>
      </a>

      <nav
        className={
          menuOpen
            ? "nav-menu nav-menu-open"
            : "nav-menu"
        }
      >

        <a href="#home" onClick={closeMenu}>
          Home
        </a>

        <a href="#about" onClick={closeMenu}>
          About
        </a>

        <a href="#skills" onClick={closeMenu}>
          Skills
        </a>

        <a href="#projects" onClick={closeMenu}>
          Work
        </a>

        <a href="#experience" onClick={closeMenu}>
          Experience
        </a>

        <a href="#education" onClick={closeMenu}>
          Education
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>

      </nav>

      <a
        href="mailto:mhermela87@gmail.com"
        className="nav-email"
      >
        Let's talk ↗
      </a>

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "×" : "☰"}
      </button>

    </header>
  );
}

export default Navbar;
