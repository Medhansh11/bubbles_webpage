import React, { useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import { createClient } from '@supabase/supabase-js';

const products = [
  {
    id: 'soap',
    name: 'Soap',
    image: '/logo192.png',
    description: 'Handcrafted organic soap for gentle cleansing. Made with natural oils and botanicals for a refreshing, earthy feel.',
    details: {
      dimensions: '7cm x 5cm x 2.5cm',
      weight: '100g',
      ingredients: 'Olive oil, coconut oil, shea butter, essential oils',
      more: 'Suitable for all skin types. No artificial fragrances or colors.'
    },
    price: 7.99
  },
  {
    id: 'cleanser',
    name: 'Cleanser',
    image: '/logo512.png',
    description: 'Natural cleanser for a fresh, glowing skin. Gentle, effective, and free from harsh chemicals.',
    details: {
      dimensions: 'Bottle: 15cm x 4cm',
      weight: '200ml',
      ingredients: 'Aloe vera, green tea, chamomile, purified water',
      more: 'Dermatologist tested. Vegan. Use daily for best results.'
    },
    price: 12.99
  },
  {
    id: 'recycled-paper',
    name: 'Recycled Paper',
    image: '/logo192.png',
    description: 'Eco-friendly paper made entirely from recycled materials. Perfect for notes, crafts, and sustainable living.',
    details: {
      dimensions: 'A4 (21cm x 29.7cm)',
      weight: '80gsm, 100 sheets',
      ingredients: '100% post-consumer recycled paper',
      more: 'Acid-free, chlorine-free, and fully biodegradable. Supports a circular economy.'
    },
    price: 5.49
  }
];

// Cart Context
const CartContext = createContext();
function useCart() { return useContext(CartContext); }
function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart((prev) => prev.filter(item => item.id !== id));
  const updateQty = (id, qty) => setCart((prev) => prev.map(item => item.id === id ? { ...item, qty } : item));
  const clearCart = () => setCart([]);
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

function CartIcon({ count }) {
  return (
    <span className="cart-icon-wrapper">
      <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h2l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      {count > 0 && <span className="cart-count-badge">{count}</span>}
    </span>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="/" className="footer-logo-link"><img src={logo} alt="Bubbles Logo" className="footer-logo" /></a>
          <div className="footer-brand-text">
            <div className="footer-title">Bubbles</div>
            <div className="footer-tagline">Pure. Earthy. Organic. Skincare for every soul.</div>
          </div>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
          <a href="/contact">Contact</a>
        </div>
        <div className="footer-socials">
          <a href="#" aria-label="Instagram" className="social-icon">📸</a>
          <a href="#" aria-label="Facebook" className="social-icon">📘</a>
          <a href="#" aria-label="Twitter" className="social-icon">🐦</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Bubbles &copy; {new Date().getFullYear()} &mdash; Crafted with love on Earth.</span>
      </div>
    </footer>
  );
}

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-full">
      <section className="brand-hero cool-hero-bg full-span-section">
        <div className="brand-hero-overlay" />
        <div className="hero-bubble hero-bubble1" />
        <div className="hero-bubble hero-bubble2" />
        <div className="hero-bubble hero-bubble3" />
        <img src={logo} alt="Bubbles Logo" className="brand-logo-large" />
        <div className="brand-hero-content">
          <h1>Bubbles</h1>
          <p className="tagline">Experience the purity of organic, earthy skincare.</p>
        </div>
      </section>
      <section className="vision-section full-span-section">
        <h2 className="centered-heading">Our Vision</h2>
        <p className="vision-text">
          At Bubbles, we believe in the power of nature. Our products are crafted with organic ingredients, inspired by the earth, and designed to nurture your skin and soul. Sustainability, purity, and wellness are at the heart of everything we do.
        </p>
      </section>
      <section className="products-section full-span-section home-products-horizontal-alt">
        {products.map((product, idx) => {
          // Check if the product is the Cleanser to apply specific styling
          const isCleanser = product.id === 'cleanser';
          // Check if the product is Recycled Paper to apply specific styling (if needed, currently same as other products except Cleanser)
          const isRecycledPaper = product.id === 'recycled-paper';

          return (
            <div className={`home-product-horizontal-alt ${isCleanser ? 'img-right' : 'img-left'}`} key={product.id}>
              {/* Render image on the left for most products, right for Cleanser */}
              {!isCleanser && (
                <div className="home-product-img-wrap-alt">
                  <img src={product.image} alt={product.name} className="home-product-img" />
                </div>
              )}

              <div className={`home-product-content-alt ${isCleanser ? 'order-left' : ''}`}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {/* Arrow is not needed based on the final design in the image */}
                {/* <div className="home-product-arrow-alt">
                  <span>&#8594;</span>
                </div> */}
                <button className="view-more-btn" onClick={() => navigate(`/product/${product.id}`)} style={{marginTop:'1rem'}}>View Product</button>
              </div>

              {/* Render image on the right specifically for the Cleanser */}
              {isCleanser && (
                <div className="home-product-img-wrap-alt order-right">
                  <img src={product.image} alt={product.name} className="home-product-img" />
                </div>
              )}
            </div>
          );
        })}
      </section>
      <section className="journey-section full-span-section">
        <div className="journey-content">
          <h2>Our Journey</h2>
          <p>
            Bubbles began as a small family passion for pure, honest skincare. From humble beginnings at local markets, we grew by listening to our community and letting nature guide our formulas. Today, we remain committed to handcrafting every product with love, care, and a deep respect for the earth.
          </p>
        </div>
      </section>
    </div>
  );
}

function Shop() {
  const navigate = useNavigate();
  return (
    <div className="shop-full">
      <section className="shop-hero">
        <h1>Shop Bubbles</h1>
        <p>Discover our range of pure, organic skincare essentials. Handcrafted with love, delivered with care.</p>
      </section>
      <section className="products-section">
        <div className="products-grid">
          {products.map(product => (
            <div className="product-card clickable" key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
              <div className="product-img-glow">
                <img src={product.image} alt={product.name} className="product-img" />
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-feature-price">₹{product.price.toFixed(2)}</div>
              <button className="buy-now-btn" onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>Buy Now</button>
            </div>
          ))}
        </div>
      </section>
      <section className="shop-benefits">
        <h2>Why Shop With Us?</h2>
        <div className="benefits-list">
          <div className="benefit-item">🌱 100% Organic Ingredients</div>
          <div className="benefit-item">👐 Handcrafted in Small Batches</div>
          <div className="benefit-item">🌍 Eco-Friendly Packaging</div>
          <div className="benefit-item">🚚 Free Shipping Over $30</div>
        </div>
      </section>
    </div>
  );
}

function Contact() {
  return (
    <div className="contact-full">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out with questions, feedback, or just to say hello.</p>
      </section>
      <section className="contact-content">
        <form className="contact-form">
          <h2>Send a Message</h2>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows={5} required />
          <button type="submit">Send</button>
        </form>
        <div className="contact-info">
          <h2>Find Us</h2>
          <div className="map-placeholder">[Map Placeholder]</div>
          <div className="address-block">
            <div>Bubbles HQ</div>
            <div>123 Pure Lane</div>
            <div>Green City, Earth 00001</div>
            <div>Email: <a href="mailto:hello@bubbles.com">hello@bubbles.com</a></div>
            <div>Phone: +1 234 567 8901</div>
          </div>
          <div className="contact-socials">
            <a href="#" aria-label="Instagram" className="social-icon">📸</a>
            <a href="#" aria-label="Facebook" className="social-icon">📘</a>
            <a href="#" aria-label="Twitter" className="social-icon">🐦</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductPage({ id }) {
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = React.useState(1);
  if (!product) return <div className="page"><h2>Product not found</h2></div>;
  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };
  return (
    <div className="page product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-img-wrap">
          <img src={product.image} alt={product.name} className="product-detail-img" />
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-desc">{product.description}</p>
          <div className="product-detail-meta">
            <div><strong>Dimensions:</strong> {product.details.dimensions}</div>
            <div><strong>Weight:</strong> {product.details.weight}</div>
            <div><strong>Ingredients:</strong> {product.details.ingredients}</div>
            <div><strong>More:</strong> {product.details.more}</div>
          </div>
          <div className="product-detail-price">₹{product.price.toFixed(2)}</div>
          <div className="product-detail-actions">
            <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))} className="qty-input" />
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
      <button className="back-btn product-back-btn" onClick={() => navigate(-1)}>&larr; Back to Shop</button>
    </div>
  );
}

function ProductRouteWrapper() {
  const { id } = useParams();
  return <ProductPage id={id} />;
}

function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const grouped = cart.reduce((acc, item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) found.qty += 1;
    else acc.push({ ...item });
    return acc;
  }, []);
  const total = grouped.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (grouped.length === 0) return <div className="page cart-page"><h2>Your cart is empty.</h2></div>;
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {grouped.map(item => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="product-img" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <div>Price: ₹{item.price.toFixed(2)}</div>
              <div>
                Qty: <input type="number" min="1" value={item.qty} onChange={e => updateQty(item.id, Math.max(1, Number(e.target.value)))} className="qty-input" />
              </div>
              <div style={{display:'flex',gap:'0.7rem',marginTop:'0.5rem'}}>
                <button className="view-more-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                <button className="buy-now-btn" onClick={() => { updateQty(item.id, item.qty); navigate('/checkout'); }}>Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div><strong>Total: ₹{total.toFixed(2)}</strong></div>
        <button className="add-to-cart-btn" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        <button className="back-btn" onClick={clearCart} style={{marginLeft:'1rem'}}>Clear Cart</button>
      </div>
    </div>
  );
}

// Supabase client setup
const supabase = createClient(
  'https://mhkpalfoqmxwudwfwqms.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oa3BhbGZvcW14d3Vkd2Z3cW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTk0MzcsImV4cCI6MjA2NDA3NTQzN30.bhoo3k9HA59VdS51dft4oyYAwxnuZJi7ahjGw7Phvo4'
);

function Checkout() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = React.useState({
    name: '', email: '',
    shipping_address: '', shipping_city: '', shipping_zip: '', shipping_country: '',
    billing_address: '', billing_city: '', billing_zip: '', billing_country: ''
  });
  const [sameAsShipping, setSameAsShipping] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const grouped = cart.reduce((acc, item) => {
    const found = acc.find(i => i.id === item.id);
    if (found) found.qty += 1;
    else acc.push({ ...item });
    return acc;
  }, []);
  const total = grouped.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Handle toggle for billing = shipping
  const handleToggle = () => {
    setSameAsShipping((prev) => {
      const next = !prev;
      if (next) {
        setForm(f => ({
          ...f,
          billing_address: f.shipping_address,
          billing_city: f.shipping_city,
          billing_zip: f.shipping_zip,
          billing_country: f.shipping_country
        }));
      }
      return next;
    });
  };

  // Keep billing in sync if toggle is on and shipping changes
  React.useEffect(() => {
    if (sameAsShipping) {
      setForm(f => ({
        ...f,
        billing_address: f.shipping_address,
        billing_city: f.shipping_city,
        billing_zip: f.shipping_zip,
        billing_country: f.shipping_country
      }));
    }
  }, [sameAsShipping, form.shipping_address, form.shipping_city, form.shipping_zip, form.shipping_country]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Compose order data
    const order = {
      user_name: form.name,
      user_email: form.email,
      billing_address: `${form.billing_address}, ${form.billing_city}, ${form.billing_zip}, ${form.billing_country}`,
      shipping_address: `${form.shipping_address}, ${form.shipping_city}, ${form.shipping_zip}, ${form.shipping_country}`,
      total,
      status: 'pending',
      items: grouped.map(item => ({ id: item.id, name: item.name, qty: item.qty, price: item.price })),
    };
    // Save to Supabase
    const { error: supaError } = await supabase.from('orders').insert([order]);
    setLoading(false);
    if (supaError) {
      setError(supaError.message);
      return;
    }
    setSubmitted(true);
    clearCart();
  };
  if (grouped.length === 0 && !submitted) return <div className="page"><h2>Your cart is empty.</h2></div>;
  if (submitted) return <div className="page"><h2>Thank you for your order!</h2><p>We have received your order and will ship it soon.</p></div>;

  // Slide switch CSS
  const switchStyles = {
    container: {
      display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0'
    },
    label: {
      display: 'inline-block', position: 'relative', width: '48px', height: '28px',
    },
    slider: {
      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
      background: sameAsShipping ? '#4caf50' : '#ccc', borderRadius: '34px', transition: 'background 0.2s',
    },
    circle: {
      position: 'absolute', height: '22px', width: '22px', left: sameAsShipping ? '22px' : '4px', bottom: '3px',
      background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 4px #0002',
    },
    visuallyHidden: {
      opacity: 0, width: 0, height: 0, position: 'absolute',
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {/* Flex container for form and summary side by side on desktop */}
      <div className="checkout-flex-wrap">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Contact Info</h3>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
          <h3>Shipping Address</h3>
          <input name="shipping_address" placeholder="Address" value={form.shipping_address} onChange={handleChange} required />
          <input name="shipping_city" placeholder="City" value={form.shipping_city} onChange={handleChange} required />
          <input name="shipping_zip" placeholder="ZIP/Postal Code" value={form.shipping_zip} onChange={handleChange} required />
          <input name="shipping_country" placeholder="Country" value={form.shipping_country} onChange={handleChange} required />
          <div style={switchStyles.container}>
            <label style={switchStyles.label}>
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={handleToggle}
                style={switchStyles.visuallyHidden}
                aria-pressed={sameAsShipping}
                aria-label="Billing address same as shipping address"
              />
              <span style={switchStyles.slider}></span>
              <span style={switchStyles.circle}></span>
            </label>
            <span style={{fontSize:'1rem',color:'#555'}}>Billing address same as shipping?</span>
          </div>
          <h3>Billing Address</h3>
          <input name="billing_address" placeholder="Address" value={form.billing_address} onChange={handleChange} required disabled={sameAsShipping} />
          <input name="billing_city" placeholder="City" value={form.billing_city} onChange={handleChange} required disabled={sameAsShipping} />
          <input name="billing_zip" placeholder="ZIP/Postal Code" value={form.billing_zip} onChange={handleChange} required disabled={sameAsShipping} />
          <input name="billing_country" placeholder="Country" value={form.billing_country} onChange={handleChange} required disabled={sameAsShipping} />
          {error && <div style={{color:'red',marginTop:'1rem'}}>{error}</div>}
          <button className="add-to-cart-btn" type="submit" disabled={loading}>{loading ? 'Placing Order...' : 'Place Order'}</button>
        </form>
        <div className="checkout-summary-box">
          <h3>Order Summary</h3>
          <ul>
            {grouped.map(item => (
              <li key={item.id}>{item.qty} x {item.name} (₹{item.price.toFixed(2)} each)</li>
            ))}
          </ul>
          <div style={{margin: '1.2rem 0 0.7rem 0', borderTop: '1px solid #d1c7b7', height: 1, width: '100%'}} />
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
            <span>Shipping</span>
            <span>₹100.00</span>
          </div>
          <div style={{margin: '0.7rem 0 1.2rem 0', borderTop: '1px solid #d1c7b7', height: 1, width: '100%'}} />
          <div><strong>Total: ₹{(total + 100).toFixed(2)}</strong></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { cart } = useCart();
  return (
    <Router>
      <nav className="navbar modern-navbar">
        <div className="navbar-left">
          <img src={logo} alt="Bubbles Logo" className="nav-logo" />
          <Link to="/" className="nav-brand">Bubbles</Link>
        </div>
        <div className="navbar-center-wrap">
          <div className="navbar-center">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="navbar-right">
          <Link to="/cart" className="cart-link"><CartIcon count={cart.reduce((a,b)=>a+b.qty,0)} /></Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductRouteWrapper />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default function WrappedApp() {
  return <CartProvider><App /></CartProvider>;
}
