import { useRef } from 'react';
import './Contact.css';

export default function Contact() {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message received! We\'ll get back to you soon.');
    formRef.current?.reset();
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="contact-intro">Reach us anytime at <strong>0785468526</strong> or send us a message below:</p>

      <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Your Name" 
          required
        />
        <input 
          type="email" 
          placeholder="Your Email" 
          required
        />
        <textarea 
          placeholder="Your Message" 
          rows="6"
          required
        ></textarea>
        <button type="submit" className="submit-btn">Send Message</button>
      </form>

      <div className="social-section">
        <h3>Follow Us</h3>
        <div className="social-links">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </span>
            Instagram
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" fill="currentColor" />
              </svg>
            </span>
            Facebook
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
            <span className="social-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 5.9a8.4 8.4 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1 4.2 4.2 0 0 0-7.1 3.8 11.9 11.9 0 0 1-8.6-4.4 4.2 4.2 0 0 0 1.3 5.6A4 4 0 0 1 2 9.7v.1a4.2 4.2 0 0 0 3.4 4.1 4.2 4.2 0 0 1-1.1.1 3.8 3.8 0 0 1-.8-.1 4.2 4.2 0 0 0 3.9 2.9 8.5 8.5 0 0 1-5.3 1.8A8.2 8.2 0 0 1 2 19.5a12 12 0 0 0 6.5 1.9c7.8 0 12-6.5 12-12v-.5A8.6 8.6 0 0 0 22 5.9Z" fill="currentColor" />
              </svg>
            </span>
            Twitter
          </a>
        </div>
      </div>

      <footer className="contact-footer">
        <p>&copy; 2026 Thrift AF. All rights reserved.</p>
        <p>Nairobi, Kenya 📍</p>
      </footer>
    </div>
  );
}
