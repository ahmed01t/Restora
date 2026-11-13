'use client';

import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Search,
  MapPin,
  BedDouble,
  Bath,
  MoveUpRight,
  Menu,
  X,
  ChevronDown,
  Heart,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Check,
  Send,
  Building2,
  Award,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { initialProperties, type Property, formatPrice, getUnsplashUrl } from '@/lib/properties';

const categories = ['All homes', 'House', 'Apartment', 'Villa', 'Estate'];

const steps = [
  {
    num: '01',
    title: 'Discover a home',
    desc: 'Thoughtful listings, handpicked to match your personal rhythm of living and light.'
  },
  {
    num: '02',
    title: 'Private preview',
    desc: 'Walk spaces at your own pace with a dedicated architectural advisor by your side.'
  },
  {
    num: '03',
    title: 'Transparent closing',
    desc: 'From first curated offer to final key handover, every contractual detail feels simple.'
  },
  {
    num: '04',
    title: 'Settle in with care',
    desc: 'A permanent place to belong, backed by our white-glove concierge management.'
  }
];

const services = [
  {
    num: '01',
    title: 'Buy or sell with clarity',
    desc: 'Discreet guidance, honest valuation, and a calmer way to make your next move.'
  },
  {
    num: '02',
    title: 'Architectural rentals',
    desc: 'From seasonal desert sanctuaries to city lofts, curated for discerning dwellers.'
  },
  {
    num: '03',
    title: 'Property concierge & care',
    desc: 'Meticulous stewardship for your investment property and the people who call it home.'
  },
  {
    num: '04',
    title: 'Advisory & perspective',
    desc: 'Decades of regional market knowledge, zoning insight, and design appraisal.'
  }
];

const testimonials = [
  {
    quote: 'For the first time, buying a home felt like it was happening with us, not to us. We found an adobe sanctuary that feels like it has always been ours.',
    author: 'Sergio Ramirez',
    location: 'Found his place in Palm Springs',
    initials: 'SR'
  },
  {
    quote: 'Restora curates spaces with true architectural integrity. Their advisors understand light, cross-ventilation, and how materials age over decades.',
    author: 'Elena & Marcus Vance',
    location: 'Moved into The Sol House, Ojai',
    initials: 'EV'
  },
  {
    quote: 'From the initial private viewing to key handover, everything was handled with honesty and warmth. The admin portal made paperwork effortless.',
    author: 'David Chen',
    location: 'Acquired Casa de Cobre, Santa Fe',
    initials: 'DC'
  }
];

const faqs = [
  {
    q: 'How does Restora select properties for its portfolio?',
    a: 'We evaluate every residence on architectural merit, natural lighting, material authenticity (rammed earth, stone, timber), and peaceful landscape integration. Less than 8% of inspected homes meet our standards.'
  },
  {
    q: 'Can I schedule a private or twilight architectural tour?',
    a: 'Yes. Simply click on any residence or use the "Schedule a Tour" button. We will pair you with a local advisor for a private unhurried walkthrough during optimal golden hour.'
  },
  {
    q: 'What makes Restora different from conventional real estate?',
    a: 'We eliminate aggressive sales tactics. We treat real estate as living curation: clear pricing, direct access to administrative tools, honest disclosures, and enduring aesthetic value.'
  },
  {
    q: 'Do you offer leasing and full property stewardship?',
    a: 'Yes. Our property management division handles tenant vetting, maintenance by skilled craftsmen, and complete asset reporting for luxury homeowner portfolios.'
  }
];

function Reveal({
  children,
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Restora home">
      <span className="brand-mark">r</span>
      <span>
        restora<span className="brand-period">.</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <Brand />

      <nav className={`nav ${open ? 'open' : ''}`}>
        <a href="#homes" onClick={() => setOpen(false)} className="nav-link">
          <span>Find a home</span>
        </a>
        <a href="#journey" onClick={() => setOpen(false)} className="nav-link">
          <span>Our approach</span>
        </a>
        <a href="#services" onClick={() => setOpen(false)} className="nav-link">
          <span>What we do</span>
        </a>
        <a href="#stories" onClick={() => setOpen(false)} className="nav-link">
          <span>Stories</span>
        </a>
        <a href="#faq" onClick={() => setOpen(false)} className="nav-link">
          <span>FAQ</span>
        </a>

        {/* Quick Admin Portal link inside mobile menu */}
        <div className="mobile-admin-wrap">
          <a href="/admin" className="mobile-admin-link">
            <ShieldCheck size={16} /> Admin Workspace
          </a>
        </div>
      </nav>

      <div className="header-actions">
        {/* Admin Portal Shortcut Badge */}
        <a href="/admin" className="header-admin-btn" title="Open Admin Management Workspace">
          <span className="admin-status-dot" />
          <span>Admin Portal</span>
          <ArrowUpRight size={13} className="admin-arrow" />
        </a>

        <a className="header-cta" href="#contact">
          <span>Schedule Tour</span>
          <ArrowUpRight size={15} />
        </a>

        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filter, setFilter] = useState('All homes');
  const [priceRange, setPriceRange] = useState('any');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'Buy' | 'Rent' | 'Sell'>('Buy');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeStory, setActiveStory] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [savedHomes, setSavedHomes] = useState<number[]>([]);
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('14:00');
  const [tourName, setTourName] = useState('');
  const [tourEmail, setTourEmail] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load properties dynamically if updated
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.properties && Array.isArray(data.properties)) {
          setProperties(data.properties);
        }
      })
      .catch(() => {});
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleSaveHome = (id: number, name: string) => {
    setSavedHomes((prev) => {
      const isSaved = prev.includes(id);
      if (isSaved) {
        triggerToast(`Removed "${name}" from your saved homes.`);
        return prev.filter((item) => item !== id);
      } else {
        triggerToast(`Saved "${name}" to your favorites.`);
        return [...prev, id];
      }
    });
  };

  // Filter listings
  const visible = useMemo(() => {
    return properties.filter((h) => {
      // Must be published on public site
      const isPublished = h.status === 'Published';

      const matchesCategory = filter === 'All homes' || h.type === filter;

      const matchesQuery =
        !query ||
        `${h.location} ${h.name} ${h.type}`.toLowerCase().includes(query.toLowerCase());

      const matchesPrice =
        priceRange === 'any' ||
        (priceRange === 'under-2000' && h.price < 2000) ||
        (priceRange === '2000-3000' && h.price >= 2000 && h.price <= 3000) ||
        (priceRange === 'above-3000' && h.price > 3000);

      return isPublished && matchesCategory && matchesQuery && matchesPrice;
    });
  }, [properties, filter, query, priceRange]);

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTourSubmitted(true);
    triggerToast(`Viewing request confirmed for ${selectedProperty?.name}!`);
    setTimeout(() => {
      setTourSubmitted(false);
      setSelectedProperty(null);
    }, 2800);
  };

  return (
    <main id="top">
      <div className="site-shell">
        <Header />

        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-top">
            <div className="hero-heading">
              <p className="kicker">
                <span className="kicker-line" /> A more considered way home
              </p>
              <h1>
                FIND YOUR
                <br />
                PLACE IN THE
                <br />
                <em>world.</em>
              </h1>
              <div className="hero-bottom">
                <a className="button button-dark hero-btn" href="#homes">
                  <span>Explore homes</span>
                  <ArrowUpRight size={17} />
                </a>
                <p>
                  Good homes. Good people.
                  <br />
                  An enduring feeling of peace that stays with you.
                </p>
              </div>
            </div>

            <div className="hero-aside">
              <div className="seal" title="Editorial Living Standards">
                <span>THE ART OF</span>
                <strong>
                  FEELING
                  <br />
                  AT HOME
                </strong>
                <span>EST. WITH CARE · 2026</span>
              </div>
              <div className="hero-stat">
                <strong>
                  350<span>k+</span>
                </strong>
                <span>curated luxury residences</span>
              </div>
              <div className="hero-stat">
                <strong>
                  120<span>k+</span>
                </strong>
                <span>dwellers settled with serenity</span>
              </div>
            </div>
          </div>

          <div className="hero-photo">
            <img
              src={getUnsplashUrl('photo-1600210492486-724fe5c67fb0', 1900)}
              alt="Sunlit modern desert villa surrounded by native fan palms"
            />
            <div className="photo-caption">
              <span>01 / 04 · ARCHITECTURAL COLLECTION</span>
              <span>A slower kind of living · Palm Springs, California</span>
            </div>
            <a href="#homes" className="photo-discover">
              <span>A home to come back to</span>
              <span className="discover-arrow">
                <ArrowUpRight size={19} />
              </span>
            </a>
          </div>

          {/* SEARCH BAR */}
          <div className="search-wrap">
            <div className="search-tabs">
              {(['Buy', 'Rent', 'Sell'] as const).map((x) => (
                <button
                  key={x}
                  className={mode === x ? 'active' : ''}
                  onClick={() => setMode(x)}
                >
                  {x}
                </button>
              ))}
            </div>

            <div className="search-fields">
              <label>
                <span>Where do you want to be?</span>
                <div className="field-input-box">
                  <MapPin size={17} className="field-icon" />
                  <input
                    placeholder="Palm Springs, Ojai, Santa Fe..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      className="field-clear"
                      onClick={() => setQuery('')}
                      aria-label="Clear location search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </label>

              <label>
                <span>What feels like home?</span>
                <div className="field-input-box">
                  <Building2 size={17} className="field-icon" />
                  <select
                    aria-label="Property type"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="dropdown-chevron" />
                </div>
              </label>

              <label>
                <span>Monthly Lease / Budget</span>
                <div className="field-input-box">
                  <span className="dollar">$</span>
                  <select
                    aria-label="Price range"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="any">Any monthly price</option>
                    <option value="under-2000">Under $2,000 / mo</option>
                    <option value="2000-3000">$2,000 – $3,000 / mo</option>
                    <option value="above-3000">$3,000+ / mo</option>
                  </select>
                  <ChevronDown size={15} className="dropdown-chevron" />
                </div>
              </label>

              <a className="button button-dark search-button" href="#homes">
                <Search size={16} />
                <span>Find a home</span>
              </a>
            </div>
          </div>
        </section>

        {/* INTRO SECTION */}
        <section className="intro section-pad">
          <div className="intro-label">
            <span className="kicker-line" /> A note about us
          </div>
          <div className="intro-main">
            <h2>
              We design atmospheres,
              <br />
              not just <em>buildings.</em> Our work is defined by material honesty and a{' '}
              <em>deep respect for nature.</em>
            </h2>
            <div className="intro-bottom">
              <p>
                Finding a home should feel like the beginning of something good. We bring
                thoughtful homes and good people together, with the kind of care that makes the
                entire journey feel a little more like home.
              </p>
              <div className="intro-image">
                <img
                  src={getUnsplashUrl('photo-1600566753190-17f0baa2a6c3', 750)}
                  alt="Warm natural materials in an adobe inspired living space"
                  loading="lazy"
                />
                <span>Places with a point of view.</span>
              </div>
            </div>
          </div>
        </section>

        {/* THE RESTORA WAY / JOURNEY */}
        <section className="journey section-pad" id="journey">
          <div className="section-heading">
            <div>
              <p className="kicker">
                <span className="kicker-line" /> The Restora way
              </p>
              <h2>
                Peace of mind at
                <br />
                every step <em>home.</em>
              </h2>
            </div>
            <p className="section-note">
              From the first golden-hour daydream to the first night in, we make room for the
              moments that matter.
            </p>
          </div>

          <div className="steps">
            {steps.map((st, i) => (
              <Reveal key={st.num} delay={i * 0.08} className="step-cell">
                <div className={`step ${i === 0 ? 'step-active' : ''}`}>
                  <div className="step-header-row">
                    <span className="step-number">{st.num}</span>
                    <ArrowUpRight className="step-arrow" size={18} />
                  </div>
                  <div className="step-content">
                    <h3>{st.title}</h3>
                    <p>{st.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="journey-photo">
            <img
              src={getUnsplashUrl('photo-1600607687939-ce8a6c25118c', 1600)}
              alt="A welcoming modern desert home in golden afternoon light"
              loading="lazy"
            />
            <div className="journey-note">
              <span className="kicker">A GOOD PLACE TO BEGIN</span>
              <h3>
                Find a home
                <br />
                that feels like <em>you.</em>
              </h3>
              <p>Considered homes. Clear advice. A better feeling, all the way through.</p>
              <a href="#homes" className="text-link">
                <span>Explore all homes</span> <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* HOMES LISTINGS */}
        <section className="homes section-pad" id="homes">
          <div className="homes-heading">
            <div>
              <p className="kicker">
                <span className="kicker-line" /> A few good places
              </p>
              <h2>
                Rooms to grow into.
                <br />
                <em>Places to belong.</em>
              </h2>
            </div>
            <p className="section-note">
              Each home has a story. Handcrafted with rammed earth, desert timber, and boundless
              views.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="filter-row">
            <div className="filters">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`filter ${filter === c ? 'active' : ''}`}
                >
                  {c}
                  {c === 'All homes' && <span className="filter-count">{properties.filter(p => p.status === 'Published').length}</span>}
                </button>
              ))}
            </div>

            <div className="filter-actions">
              {(filter !== 'All homes' || query || priceRange !== 'any') && (
                <button
                  className="reset-filter-btn"
                  onClick={() => {
                    setFilter('All homes');
                    setQuery('');
                    setPriceRange('any');
                  }}
                >
                  Reset filters
                </button>
              )}
              <a className="text-link all-link" href="#contact">
                <span>Contact advisor</span> <ArrowRight size={15} />
              </a>
            </div>
          </div>

          {/* Property Cards Grid */}
          <motion.div className="property-grid" layout>
            <AnimatePresence>
              {visible.map((home, i) => {
                const isSaved = savedHomes.includes(home.id);
                return (
                  <motion.article
                    key={home.id}
                    className="property-card"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div
                      className="property-image"
                      onClick={() => setSelectedProperty(home)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${home.name}`}
                    >
                      <img
                        src={getUnsplashUrl(home.image, 850)}
                        alt={`${home.name}, ${home.type} in ${home.location}`}
                        loading="lazy"
                      />
                      <span className="listing-tag">{home.tag}</span>
                      <span className="view-details-hover">
                        <span>Inspect residence</span>
                        <ArrowUpRight size={14} />
                      </span>
                    </div>

                    <button
                      className={`heart ${isSaved ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveHome(home.id, home.name);
                      }}
                      aria-label={isSaved ? 'Remove from saved' : 'Save home'}
                    >
                      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    <div className="property-copy">
                      <div className="property-price">
                        {formatPrice(home.price)}
                        <span> / month</span>
                        <button
                          className="round-arrow"
                          onClick={() => setSelectedProperty(home)}
                          aria-label={`View details for ${home.name}`}
                        >
                          <ArrowUpRight size={17} />
                        </button>
                      </div>

                      <h3
                        className="property-name"
                        onClick={() => setSelectedProperty(home)}
                      >
                        {home.name}
                      </h3>

                      <p className="property-place">
                        <MapPin size={14} />
                        {home.location}
                      </p>

                      <div className="property-meta">
                        <span>
                          <BedDouble size={15} /> {home.bedrooms} beds
                        </span>
                        <span>
                          <Bath size={15} /> {home.bathrooms || 2} baths
                        </span>
                        <span>
                          <MoveUpRight size={15} /> {home.size || 2200} sqft
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && (
            <div className="empty-state">
              <p>No published homes match that search or price filter.</p>
              <button
                className="button button-dark"
                onClick={() => {
                  setFilter('All homes');
                  setQuery('');
                  setPriceRange('any');
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* SERVICES SECTION */}
        <section className="services section-pad" id="services">
          <div className="services-top">
            <div>
              <p className="kicker">
                <span className="kicker-line" /> Here for the whole story
              </p>
              <h2>
                More than a<br />
                <em>front door.</em>
              </h2>
            </div>
            <p className="section-note">
              Whatever home means to you, we bring thoughtful care, zoning mastery, and regional
              authenticity to your search.
            </p>
          </div>

          <div className="services-grid">
            {services.map((srv, i) => (
              <Reveal key={srv.num} delay={i * 0.06} className="service-cell">
                <a className="service" href="#contact">
                  <div className="service-top-row">
                    <span className="service-no">{srv.num}</span>
                    <span className="service-icon">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <div className="service-content">
                    <h3>{srv.title}</h3>
                    <p>{srv.desc}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* STORIES / TESTIMONIALS SLIDER */}
        <section className="testimonial" id="stories">
          <div className="testimonial-image">
            <img
              src={getUnsplashUrl('photo-1600607687920-4e2a09cf159d', 1100)}
              alt="Calm sunlit home interior with natural desert stone"
              loading="lazy"
            />
          </div>

          <div className="testimonial-content">
            <p className="kicker">
              <span className="kicker-line" /> Kind words, honestly
            </p>
            <div className="quote-mark">“</div>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={activeStory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {testimonials[activeStory].quote}
              </motion.blockquote>
            </AnimatePresence>

            <div className="quote-person">
              <div className="avatar">{testimonials[activeStory].initials}</div>
              <div>
                <strong>{testimonials[activeStory].author}</strong>
                <span>{testimonials[activeStory].location}</span>
              </div>

              <div className="quote-controls">
                <button
                  onClick={() =>
                    setActiveStory((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))
                  }
                  aria-label="Previous story"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setActiveStory((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))
                  }
                  aria-label="Next story"
                >
                  →
                </button>
              </div>
            </div>

            <div className="quote-progress">
              <span
                style={{
                  width: `${((activeStory + 1) / testimonials.length) * 100}%`,
                  transition: 'width 0.35s ease'
                }}
              />
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="faq section-pad" id="faq">
          <div className="faq-heading">
            <p className="kicker">
              <span className="kicker-line" /> A few things you might wonder
            </p>
            <h2>
              Good questions.
              <br />
              <em>Clear answers.</em>
            </h2>
            <p>Still curious? We’re always delighted to talk through your relocation or sale.</p>
            <a className="text-link" href="mailto:hello@restora.example">
              <span>Ask us anything</span> <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="faq-list">
            {faqs.map((item, i) => (
              <div
                className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}
                key={item.q}
              >
                <button
                  className="faq-q-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="faq-q">{item.q}</span>
                  <span className="faq-plus">{openFaq === i ? '−' : '+'}</span>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      className="faq-answer-wrap"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                    >
                      <p className="faq-answer">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* NEWSLETTER / CONTACT */}
        <section className="newsletter section-pad" id="contact">
          <img
            src={getUnsplashUrl('photo-1600607687644-c7171b42498f', 1700)}
            alt="Warmly lit architectural desert residence at twilight"
            loading="lazy"
          />
          <div className="newsletter-overlay" />

          <div className="newsletter-copy">
            <p className="kicker">
              <span className="kicker-line" /> A little note from us
            </p>
            <h2>
              Stay close to
              <br />
              <em>what feels like home.</em>
            </h2>
            <p>
              Thoughtful homes, regional stories, and unhurried design inspiration, delivered
              occasionally.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.currentTarget.reset();
                triggerToast('Thanks for joining. You are warmly welcomed to the Restora circle.');
              }}
            >
              <label className="sr-only" htmlFor="email">
                Your email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                <ArrowUpRight size={19} />
              </button>
            </form>
            <span className="newsletter-privacy">
              A considered note every month. No noise or marketing spam. Unsubscribe anytime.
            </span>
          </div>
        </section>

        {/* PARTNERS TICKER */}
        <section className="partners">
          <span>In good company</span>
          <strong>the local edit</strong>
          <strong>FIELDNOTES</strong>
          <strong>
            habitat<span>®</span>
          </strong>
          <strong>slow living co.</strong>
          <strong>COMMON GROUND</strong>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-top">
            <div>
              <Brand light />
              <p>
                Making room for the
                <br />
                way you truly want to live.
              </p>
              <div className="socials">
                <a href="#contact" aria-label="Instagram">
                  ig
                </a>
                <a href="#contact" aria-label="Facebook">
                  f
                </a>
                <a href="#contact" aria-label="LinkedIn">
                  in
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div>
                <span>Find your place</span>
                <a href="#homes">Buy a home</a>
                <a href="#homes">Find a rental</a>
                <a href="#homes">Sell with us</a>
                <a href="/admin">Admin Portal</a>
              </div>

              <div>
                <span>Get to know us</span>
                <a href="#journey">Our approach</a>
                <a href="#services">Our services</a>
                <a href="#stories">Kind words</a>
                <a href="#faq">Frequently asked</a>
              </div>

              <div>
                <span>Say hello</span>
                <a href="mailto:hello@restora.example">hello@restora.example</a>
                <a href="#contact">Work with us</a>
                <a href="#contact">Visit our studio</a>
              </div>
            </div>
          </div>

          <div className="footer-big">
            restora<span>.</span>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Restora Realty LLC. Crafted with care and architectural honesty.</span>
            <div>
              <a href="#top">Privacy Policy</a>
              <a href="#top">Terms of Service</a>
              <a href="/admin">Workspace Access</a>
              <span>California · Arizona · Everywhere home</span>
            </div>
          </div>
        </footer>
      </div>

      {/* PROPERTY DETAIL / VIEWING BOOKING MODAL */}
      {selectedProperty && (
        <div
          className="modal-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedProperty(null);
          }}
        >
          <div className="property-modal-card">
            <button
              className="detail-close-btn"
              onClick={() => setSelectedProperty(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="detail-modal-layout">
              {/* Photo & Tag */}
              <div className="detail-image-box">
                <img
                  src={getUnsplashUrl(selectedProperty.image, 1200)}
                  alt={selectedProperty.name}
                />
                <span className="listing-tag">{selectedProperty.tag}</span>
              </div>

              {/* Information & Booking */}
              <div className="detail-info-box">
                <div className="detail-header">
                  <span className="detail-type">{selectedProperty.type} Residence · {selectedProperty.status}</span>
                  <h2>{selectedProperty.name}</h2>
                  <p className="detail-loc">
                    <MapPin size={15} /> {selectedProperty.location}
                  </p>
                  <div className="detail-price-tag">
                    {formatPrice(selectedProperty.price)}
                    <span>/month</span>
                  </div>
                </div>

                <div className="detail-specs-bar">
                  <div className="spec-badge">
                    <BedDouble size={16} />
                    <strong>{selectedProperty.bedrooms}</strong>
                    <span>Beds</span>
                  </div>
                  <div className="spec-badge">
                    <Bath size={16} />
                    <strong>{selectedProperty.bathrooms || 2}</strong>
                    <span>Baths</span>
                  </div>
                  <div className="spec-badge">
                    <MoveUpRight size={16} />
                    <strong>{selectedProperty.size || 2200}</strong>
                    <span>Sqft</span>
                  </div>
                </div>

                <p className="detail-story">{selectedProperty.description}</p>

                {selectedProperty.amenities && (
                  <div className="detail-amenities">
                    <h4>Signature Amenities</h4>
                    <ul>
                      {selectedProperty.amenities.map((amenity) => (
                        <li key={amenity}>
                          <Check size={14} className="amenity-check" />
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tour Form */}
                <div className="detail-booking-section">
                  <h3>Schedule a Private Golden-Hour Viewing</h3>
                  {tourSubmitted ? (
                    <div className="booking-success-box">
                      <Sparkles size={20} />
                      <p>
                        Your appointment request for <strong>{tourDate || 'this week'}</strong> has been registered. An advisor will reach out to confirm your private gate code.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleTourSubmit} className="tour-form">
                      <div className="tour-form-row">
                        <label>
                          <span>Preferred Date</span>
                          <input
                            type="date"
                            required
                            value={tourDate}
                            onChange={(e) => setTourDate(e.target.value)}
                          />
                        </label>
                        <label>
                          <span>Preferred Time</span>
                          <select
                            value={tourTime}
                            onChange={(e) => setTourTime(e.target.value)}
                          >
                            <option value="10:00">10:00 AM (Morning light)</option>
                            <option value="14:00">2:00 PM (Afternoon)</option>
                            <option value="17:00">5:00 PM (Golden hour sunset)</option>
                          </select>
                        </label>
                      </div>

                      <div className="tour-form-row">
                        <label>
                          <span>Your Name</span>
                          <input
                            type="text"
                            placeholder="Alex Morgan"
                            required
                            value={tourName}
                            onChange={(e) => setTourName(e.target.value)}
                          />
                        </label>
                        <label>
                          <span>Email Address</span>
                          <input
                            type="email"
                            placeholder="alex@domain.com"
                            required
                            value={tourEmail}
                            onChange={(e) => setTourEmail(e.target.value)}
                          />
                        </label>
                      </div>

                      <button type="submit" className="button button-dark booking-submit-btn">
                        <span>Request Private Viewing</span>
                        <ArrowUpRight size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="public-toast" role="alert">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
    </main>
  );
}
