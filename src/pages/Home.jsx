import { Link } from 'react-router-dom';
import { RiArrowRightLine, RiSparklingLine, RiPenNibLine } from 'react-icons/ri';
import useFetch from '../hooks/useFetch';
import BlogCard from '../components/BlogCard';
import Spinner from '../components/Spinner';

/* ── Hero decorative floating shapes ────────────────────────────────────────── */
const HeroDecor = () => (
  <>
    <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-1/3 right-10 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl pointer-events-none animate-float" />
  </>
);

/* ── Stat pill ──────────────────────────────────────────────────────────────── */
const StatPill = ({ icon, label, value }) => (
  <div className="glass px-5 py-3 flex items-center gap-3">
    <span className="text-primary-400 text-xl">{icon}</span>
    <div>
      <p className="text-white font-bold text-lg leading-none">{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  </div>
);

const Home = () => {
  // Fetch first 3 posts for featured section
  // Spring Boot endpoint: GET /api/posts?page=0&size=3
  const { data, loading, error } = useFetch('/api/posts/allPosts', { page: 0, size: 3 });

  // Spring Boot may return a Page object ({ content: [...] }) or a plain array
  const posts = Array.isArray(data) ? data : data?.content ?? [];
  const featured = posts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
        <HeroDecor />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,112,246,0.6) 1px, transparent 1px), linear-gradient(to right, rgba(99,112,246,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/60 border border-primary-700/40 text-primary-300 text-sm font-medium mb-8 animate-fade-in">
            <RiSparklingLine className="animate-pulse-slow" />
            Modern Blogging Platform
          </span>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
            Where Ideas Come
            <br />
            <span className="text-gradient">Alive in Words</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up animate-delay-100">
            Discover thought-provoking stories, tutorials, and insights from passionate writers around the globe.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animate-delay-200">
            <Link to="/blog" id="hero-explore-btn" className="btn-primary text-base px-8 py-4">
              Explore Posts <RiArrowRightLine className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/register" id="hero-start-writing-btn" className="btn-secondary text-base px-8 py-4">
              <RiPenNibLine /> Start Writing
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in animate-delay-300">
            <StatPill icon="✍️" label="Articles published" value="10+" />
            <StatPill icon="👥" label="Active authors"     value="50+" />
            <StatPill icon="🌍" label="Monthly readers"    value="2K+"  />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
      </section>

      {/* ── Featured Posts ────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 bg-dark-900" id="featured-posts">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="tag mb-4 inline-block">Featured</span>
            <h2 className="section-title">Latest from the Blog</h2>
            <p className="section-subtitle mx-auto">
              Hand-picked stories to inspire, inform, and entertain.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl mb-2">Could not load posts</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {featured.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-20">No posts yet — be the first to write one!</p>
              )}

              <div className="text-center mt-12">
                <Link to="/blog" id="home-view-all-btn" className="btn-secondary text-base px-8 py-4">
                  View All Posts <RiArrowRightLine />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-dark-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass p-10 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-glow-primary opacity-30 pointer-events-none" />
            <h2 className="font-display text-4xl font-bold text-white mb-4 relative">
              Ready to Share Your Story?
            </h2>
            <p className="text-gray-400 text-lg mb-8 relative">
              Join our community of writers and publish your first post today.
            </p>
            <Link to="/register" id="cta-join-btn" className="btn-primary text-base px-10 py-4 relative">
              Join InkWave <RiArrowRightLine />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
