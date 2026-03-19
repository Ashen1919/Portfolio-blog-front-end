import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { RiMenuLine, RiCloseLine, RiUserLine, RiQuillPenLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',      label: 'Home'  },
  { to: '/blog',  label: 'Blog'  },
];

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  /* Shrink navbar on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-primary-400' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/90 backdrop-blur-lg shadow-lg border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="InkWave home"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
              <RiQuillPenLine className="text-white text-xl" />
            </span>
            <span className="font-display font-bold text-xl text-white">
              Ink<span className="text-gradient">Wave</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass} end={to === '/'}>
                {label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/blog/create"
                  className="btn-primary py-2 text-sm"
                  id="navbar-create-post-btn"
                >
                  <RiQuillPenLine /> Write
                </Link>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-gray-300 text-sm">
                    <RiUserLine className="text-primary-400" />
                    {user?.username || 'Author'}
                  </span>
                  <button
                    onClick={handleLogout}
                    id="navbar-logout-btn"
                    className="btn-secondary py-2 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"    className="btn-secondary py-2 text-sm" id="navbar-login-btn">Login</Link>
                <Link to="/register" className="btn-primary  py-2 text-sm" id="navbar-register-btn">Get Started</Link>
              </div>
            )}
          </nav>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            id="navbar-mobile-menu-btn"
          >
            {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-lg border-t border-white/5 px-4 py-6 space-y-4 animate-fade-in">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block py-2 text-base font-medium transition-colors ${
                  isActive ? 'text-primary-400' : 'text-gray-300 hover:text-white'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-white/10 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/blog/create"
                  className="btn-primary w-full justify-center text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  <RiQuillPenLine /> Write a Post
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary w-full justify-center text-sm"
                >
                  Logout ({user?.username})
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-secondary w-full justify-center text-sm">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary  w-full justify-center text-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
