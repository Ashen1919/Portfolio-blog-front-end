import { Link } from 'react-router-dom';
import { RiQuillPenLine, RiGithubLine, RiTwitterXLine, RiLinkedinLine, RiHeartFill } from 'react-icons/ri';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 shadow-glow-sm">
                <RiQuillPenLine className="text-white text-xl" />
              </span>
              <span className="font-display font-bold text-xl text-white">
                Ink<span className="text-gradient">Wave</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A modern blogging platform where ideas flow freely. Share your stories, insights, and expertise with the world.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { href: 'https://github.com', icon: <RiGithubLine size={18} />,    label: 'GitHub'   },
                { href: 'https://twitter.com',icon: <RiTwitterXLine size={18} />,  label: 'Twitter'  },
                { href: 'https://linkedin.com',icon: <RiLinkedinLine size={18} />, label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10
                             text-gray-400 hover:text-white hover:bg-primary-600/20 hover:border-primary-500/30
                             transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/',        label: 'Home'     },
                { to: '/blog',    label: 'Blog'     },
                { to: '/login',   label: 'Login'    },
                { to: '/register',label: 'Register' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter teaser */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest articles delivered straight to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                aria-label="Newsletter email"
                className="form-input flex-1 text-sm py-2"
              />
              <button className="btn-primary py-2 px-4 text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="divider mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-500 text-sm">
          <p>© {year} InkWave. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <RiHeartFill className="text-accent-500" /> using Spring Boot &amp; React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
