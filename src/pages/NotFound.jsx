import { Link } from 'react-router-dom';
import { RiHome4Line, RiArrowLeftLine } from 'react-icons/ri';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4 text-center">
      {/* Glow */}
      <div className="absolute w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Large 404 */}
        <h1 className="font-display text-[10rem] md:text-[14rem] font-bold leading-none
                       bg-gradient-to-b from-primary-500/40 to-transparent bg-clip-text text-transparent
                       select-none pointer-events-none">
          404
        </h1>

        <div className="-mt-8 md:-mt-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Page not found
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">
            The page you&apos;re looking for has drifted away into the digital void.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" id="notfound-home-btn" className="btn-primary px-8 py-3">
              <RiHome4Line /> Go Home
            </Link>
            <button
              id="notfound-back-btn"
              onClick={() => window.history.back()}
              className="btn-secondary px-8 py-3"
            >
              <RiArrowLeftLine /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
