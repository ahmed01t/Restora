'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronDown,
  CirclePlus,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
  BedDouble,
  Bath,
  MoveUpRight,
  ShieldCheck
} from 'lucide-react';
import { Property, PropertyStatus, PropertyType, formatPrice, getUnsplashUrl } from '@/lib/properties';

interface AdminDashboardProps {
  initialProperties: Property[];
}

export default function AdminDashboard({ initialProperties }: AdminDashboardProps) {
  const router = useRouter();
  const [items, setItems] = useState<Property[]>(initialProperties);
  const [tab, setTab] = useState<'All listings' | 'Published' | 'Drafts' | 'Under review'>('All listings');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'price-asc' | 'price-desc' | 'name'>('updated');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Property | null>(null);
  const [previewItem, setPreviewItem] = useState<Property | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice(null);
    }, 4500);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  // Add new property
  const handleAddListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProp = {
      name: String(formData.get('name')),
      location: String(formData.get('location')),
      price: Number(formData.get('price')),
      type: String(formData.get('type')) as PropertyType,
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms') || 2),
      size: Number(formData.get('size') || 2000),
      status: String(formData.get('status') || 'Draft') as PropertyStatus,
      tag: String(formData.get('tag') || 'Just listed'),
      image: String(formData.get('image') || 'photo-1600210492486-724fe5c67fb0'),
      description: String(formData.get('description') || 'Architecturally designed home with thoughtful desert materials.')
    };

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      if (res.ok) {
        const data = await res.json();
        setItems((current) => [data.property, ...current]);
        setShowAddModal(false);
        showToast(`Listing "${newProp.name}" added successfully.`);
      } else {
        // Fallback local update
        const fallback: Property = {
          id: Date.now(),
          ...newProp,
          updated: 'Just now',
          amenities: ['Mountain Views', 'Private Patio', 'Solar Array']
        };
        setItems((current) => [fallback, ...current]);
        setShowAddModal(false);
        showToast(`Listing "${newProp.name}" created locally.`);
      }
    } catch {
      const fallback: Property = {
        id: Date.now(),
        ...newProp,
        updated: 'Just now',
        amenities: ['Mountain Views', 'Private Patio', 'Solar Array']
      };
      setItems((current) => [fallback, ...current]);
      setShowAddModal(false);
      showToast(`Listing "${newProp.name}" created.`);
    }
  };

  // Edit existing property
  const handleEditListing = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(event.currentTarget);
    const updated = {
      ...editingItem,
      name: String(formData.get('name')),
      location: String(formData.get('location')),
      price: Number(formData.get('price')),
      type: String(formData.get('type')) as PropertyType,
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
      size: Number(formData.get('size')),
      status: String(formData.get('status')) as PropertyStatus,
      tag: String(formData.get('tag')),
      description: String(formData.get('description'))
    };

    try {
      await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {}

    setItems((current) => current.map((p) => (p.id === updated.id ? updated : p)));
    setEditingItem(null);
    showToast(`Property "${updated.name}" updated successfully.`);
  };

  // Quick toggle status
  const handleStatusToggle = async (item: Property) => {
    const nextStatus: PropertyStatus =
      item.status === 'Published'
        ? 'Draft'
        : item.status === 'Draft'
        ? 'Under review'
        : 'Published';

    const updated = { ...item, status: nextStatus };
    setItems((current) => current.map((p) => (p.id === item.id ? updated : p)));
    showToast(`Status of "${item.name}" changed to ${nextStatus}.`);

    try {
      await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch {}
  };

  // Delete property
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}"?`)) return;

    setItems((current) => current.filter((p) => p.id !== id));
    showToast(`"${name}" was deleted.`);

    try {
      await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
    } catch {}
  };

  // Filter and sort items
  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        const matchesTab =
          tab === 'All listings' ||
          (tab === 'Published' && item.status === 'Published') ||
          (tab === 'Drafts' && item.status === 'Draft') ||
          (tab === 'Under review' && item.status === 'Under review');

        const matchesQuery =
          !query ||
          `${item.name} ${item.location} ${item.type}`.toLowerCase().includes(query.toLowerCase());

        return matchesTab && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // Default order
      });
  }, [items, tab, query, sortBy]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((p) => p.status === 'Published').length;
    const drafts = items.filter((p) => p.status === 'Draft').length;
    const underReview = items.filter((p) => p.status === 'Under review').length;
    const totalValue = items.reduce((acc, p) => acc + p.price, 0);
    return { total, published, drafts, underReview, totalValue };
  }, [items]);

  return (
    <main className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <a href="/" className="admin-logo" title="Return to public site">
          <span className="brand-mark">r</span>
          <span>
            restora<span className="brand-period">.</span>
          </span>
        </a>

        <span className="admin-workspace">PORTAL WORKSPACE</span>

        <nav className="admin-nav-links">
          <a className="side-link selected" href="#listings">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </a>
          <a className="side-link" href="#listings">
            <Home size={18} />
            <span>Properties</span>
            <span className="side-count">{items.length}</span>
          </a>
          <a
            className="side-link"
            href="#inquiries"
            onClick={(e) => {
              e.preventDefault();
              showToast('You have 8 prospective buyer inquiries pending response.');
            }}
          >
            <Bell size={18} />
            <span>Inquiries</span>
            <span className="side-count active-badge">8</span>
          </a>
          <a
            className="side-link"
            href="#settings"
            onClick={(e) => {
              e.preventDefault();
              showToast('Admin settings: Authenticated as admin@restora.com');
            }}
          >
            <SlidersHorizontal size={18} />
            <span>Settings</span>
          </a>
          <a className="side-link" href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            <span>View Live Site</span>
          </a>
        </nav>

        <div className="side-bottom">
          <div className="admin-avatar">AR</div>
          <div className="admin-user">
            <strong>Alex Rivera</strong>
            <span>Lead Estate Director</span>
          </div>
          <button
            className="side-logout"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out of Admin"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <a href="/" className="back-site">
            <ArrowLeft size={16} />
            <span>Back to website</span>
          </a>

          <div className="admin-top-actions">
            <span className="admin-live">
              <span className="live-dot" /> Live production sync
            </span>
            <button
              className="admin-icon-btn"
              onClick={() => showToast('All systems running smoothly. No new alerts.')}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="notification-pip" />
            </button>
            <button
              className="admin-logout-top-btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={15} />
              <span>{loggingOut ? 'Signing out...' : 'Sign out'}</span>
            </button>
          </div>
        </header>

        {/* Admin Dashboard Content */}
        <div className="admin-content">
          <div className="admin-title-row">
            <div>
              <p className="admin-eyebrow">
                <ShieldCheck size={14} className="eyebrow-icon" /> PROPERTY MANAGEMENT & PORTFOLIO
              </p>
              <h1>Admin Dashboard</h1>
              <p className="admin-subtitle">
                Curate luxury residences, inspect client visibility, and manage asking prices in real time.
              </p>
            </div>
            <div className="admin-header-buttons">
              <button className="add-listing" onClick={() => setShowAddModal(true)}>
                <CirclePlus size={17} />
                <span>Add a property</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="admin-stats">
            <article className="stat-card">
              <span>Total properties</span>
              <strong>{stats.total.toString().padStart(2, '0')}</strong>
              <small>Across Palm Springs, Ojai & NM</small>
            </article>
            <article className="stat-card">
              <span>Published live</span>
              <strong className="stat-highlight">{stats.published.toString().padStart(2, '0')}</strong>
              <small>Visible to website visitors</small>
            </article>
            <article className="stat-card">
              <span>Drafts & Review</span>
              <strong>{(stats.drafts + stats.underReview).toString().padStart(2, '0')}</strong>
              <small>{stats.drafts} drafts · {stats.underReview} under review</small>
            </article>
            <article className="stat-card">
              <span>Monthly portfolio</span>
              <strong>${stats.totalValue.toLocaleString()}</strong>
              <small>Combined monthly lease volume</small>
            </article>
          </div>

          {/* Listings Management Panel */}
          <section id="listings" className="listing-panel">
            <div className="panel-heading">
              <div>
                <h2>Portfolio Listings</h2>
                <p>Complete control over listings, statuses, and pricing visible on Restora.</p>
              </div>

              {/* Sort Selector */}
              <div className="sort-dropdown-wrap">
                <label htmlFor="sort-select" className="sr-only">Sort properties</label>
                <div className="sort-box">
                  <ArrowDownUp size={14} />
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="updated">Sort: Recently updated</option>
                    <option value="price-asc">Price: Low to high</option>
                    <option value="price-desc">Price: High to low</option>
                    <option value="name">Name: Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="listing-toolbar">
              <div className="admin-tabs">
                {(['All listings', 'Published', 'Drafts', 'Under review'] as const).map((label) => {
                  const count =
                    label === 'All listings'
                      ? stats.total
                      : label === 'Published'
                      ? stats.published
                      : label === 'Drafts'
                      ? stats.drafts
                      : stats.underReview;

                  return (
                    <button
                      key={label}
                      className={label === tab ? 'current' : ''}
                      onClick={() => setTab(label)}
                    >
                      {label}
                      <span className="tab-badge">{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className="table-search">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, city or type..."
                />
                {query && (
                  <button className="clear-search" onClick={() => setQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="listing-table-wrap">
              <table className="listing-table">
                <thead>
                  <tr>
                    <th>PROPERTY</th>
                    <th>TYPE & SPECS</th>
                    <th>STATUS (CLICK TO TOGGLE)</th>
                    <th>MONTHLY RATE</th>
                    <th>LAST UPDATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="table-row">
                      <td>
                        <div className="admin-property">
                          <img
                            src={getUnsplashUrl(item.image, 160)}
                            alt={item.name}
                            className="admin-prop-thumb"
                          />
                          <div>
                            <strong>{item.name}</strong>
                            <span>
                              <MapPin size={12} /> {item.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-specs-cell">
                          <span className="type-badge">{item.type}</span>
                          <span className="specs-sub">
                            {item.bedrooms} beds · {item.bathrooms || 2} baths · {item.size || 2000} sqft
                          </span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`status-btn status-${item.status.toLowerCase().replace(' ', '-')}`}
                          onClick={() => handleStatusToggle(item)}
                          title="Click to toggle status (Published / Draft / Under review)"
                        >
                          <span className="status-indicator" />
                          {item.status}
                        </button>
                      </td>
                      <td className="table-price">
                        ${item.price.toLocaleString()}
                        <span>/mo</span>
                      </td>
                      <td className="updated-cell">{item.updated}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            title="Preview listing details"
                            className="action-btn"
                            onClick={() => setPreviewItem(item)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            title="Edit listing"
                            className="action-btn"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            title="Delete listing"
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(item.id, item.name)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="admin-empty">
                  <p>No properties match your current filters or search query.</p>
                  <button
                    className="button button-dark"
                    onClick={() => {
                      setTab('All listings');
                      setQuery('');
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            <footer className="table-footer">
              <span>
                Showing <strong>{filtered.length}</strong> of <strong>{items.length}</strong> properties
              </span>
              <div className="pagination-controls">
                <button disabled>Previous</button>
                <button className="page-current">1</button>
                <button disabled>Next</button>
              </div>
            </footer>
          </section>

          <p className="admin-footnote">
            Restora Editorial Real Estate · Fully synchronized administrative workspace
          </p>
        </div>
      </section>

      {/* Floating Notification Toast */}
      {notice && (
        <div className="admin-toast" role="status">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddModal && (
        <div
          className="modal-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <form className="listing-modal" onSubmit={handleAddListing}>
            <div className="modal-head">
              <div>
                <span className="modal-kicker">PORTFOLIO EXPANSION</span>
                <h2>Add New Property</h2>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-grid">
              <label>
                Property Name
                <input name="name" required placeholder="e.g. Saguaro Sanctuary" />
              </label>

              <label>
                Location (City, State)
                <input name="location" required placeholder="e.g. Palm Springs, California" />
              </label>

              <div className="modal-two-col">
                <label>
                  Monthly Asking Rent ($)
                  <input name="price" type="number" min="100" defaultValue="2500" required />
                </label>
                <label>
                  Property Type
                  <select name="type" defaultValue="Villa">
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Estate">Estate</option>
                  </select>
                </label>
              </div>

              <div className="modal-three-col">
                <label>
                  Bedrooms
                  <input name="bedrooms" type="number" min="1" defaultValue="4" required />
                </label>
                <label>
                  Bathrooms
                  <input name="bathrooms" type="number" min="1" defaultValue="3" required />
                </label>
                <label>
                  Square Footage
                  <input name="size" type="number" min="200" defaultValue="2600" required />
                </label>
              </div>

              <div className="modal-two-col">
                <label>
                  Tag / Ribbon
                  <select name="tag" defaultValue="Just listed">
                    <option value="Just listed">Just listed</option>
                    <option value="Featured">Featured</option>
                    <option value="Open house">Open house</option>
                    <option value="New price">New price</option>
                  </select>
                </label>
                <label>
                  Publication Status
                  <select name="status" defaultValue="Published">
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Under review">Under review</option>
                  </select>
                </label>
              </div>

              <label>
                Architectural Story / Description
                <textarea
                  name="description"
                  rows={3}
                  defaultValue="A tranquil sunlit residence with rammed-earth textures, expansive glass walls, and native landscaping."
                />
              </label>

              <label>
                Unsplash Photo ID or URL
                <input
                  name="image"
                  defaultValue="photo-1600210492486-724fe5c67fb0"
                  placeholder="photo-id or full URL"
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="add-listing">
                Save Property <ArrowUpRight size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingItem && (
        <div
          className="modal-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditingItem(null);
          }}
        >
          <form className="listing-modal" onSubmit={handleEditListing}>
            <div className="modal-head">
              <div>
                <span className="modal-kicker">UPDATE PROPERTY</span>
                <h2>Edit {editingItem.name}</h2>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setEditingItem(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-grid">
              <label>
                Property Name
                <input name="name" defaultValue={editingItem.name} required />
              </label>

              <label>
                Location
                <input name="location" defaultValue={editingItem.location} required />
              </label>

              <div className="modal-two-col">
                <label>
                  Monthly Asking Rent ($)
                  <input name="price" type="number" defaultValue={editingItem.price} required />
                </label>
                <label>
                  Property Type
                  <select name="type" defaultValue={editingItem.type}>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Estate">Estate</option>
                  </select>
                </label>
              </div>

              <div className="modal-three-col">
                <label>
                  Bedrooms
                  <input name="bedrooms" type="number" defaultValue={editingItem.bedrooms} required />
                </label>
                <label>
                  Bathrooms
                  <input name="bathrooms" type="number" defaultValue={editingItem.bathrooms || 2} required />
                </label>
                <label>
                  Square Footage
                  <input name="size" type="number" defaultValue={editingItem.size || 2000} required />
                </label>
              </div>

              <div className="modal-two-col">
                <label>
                  Tag / Ribbon
                  <select name="tag" defaultValue={editingItem.tag}>
                    <option value="Just listed">Just listed</option>
                    <option value="Featured">Featured</option>
                    <option value="Open house">Open house</option>
                    <option value="New price">New price</option>
                  </select>
                </label>
                <label>
                  Status
                  <select name="status" defaultValue={editingItem.status}>
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Under review">Under review</option>
                  </select>
                </label>
              </div>

              <label>
                Description
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem.description}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button type="submit" className="add-listing">
                Save Changes <ArrowUpRight size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Property Quick Preview Modal */}
      {previewItem && (
        <div
          className="modal-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPreviewItem(null);
          }}
        >
          <div className="listing-modal preview-modal">
            <div className="preview-image-wrap">
              <img
                src={getUnsplashUrl(previewItem.image, 900)}
                alt={previewItem.name}
                className="preview-img"
              />
              <span className="listing-tag">{previewItem.tag}</span>
              <button
                className="preview-close-btn"
                onClick={() => setPreviewItem(null)}
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
            </div>

            <div className="preview-body">
              <div className="preview-top">
                <div>
                  <span className="preview-type">{previewItem.type} · {previewItem.status}</span>
                  <h3>{previewItem.name}</h3>
                  <p className="preview-loc">
                    <MapPin size={14} /> {previewItem.location}
                  </p>
                </div>
                <div className="preview-price">
                  {formatPrice(previewItem.price)}
                  <span>/month</span>
                </div>
              </div>

              <div className="preview-specs-bar">
                <span><BedDouble size={16} /> {previewItem.bedrooms} Bedrooms</span>
                <span><Bath size={16} /> {previewItem.bathrooms || 2} Bathrooms</span>
                <span><MoveUpRight size={16} /> {previewItem.size || 2000} sqft</span>
              </div>

              <p className="preview-desc">{previewItem.description}</p>

              <div className="preview-actions">
                <button
                  className="button button-dark"
                  onClick={() => {
                    setEditingItem(previewItem);
                    setPreviewItem(null);
                  }}
                >
                  <Edit3 size={15} /> Edit Listing
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={() => setPreviewItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

