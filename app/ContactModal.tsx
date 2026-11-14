'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Send,
  Check,
  Copy,
  MessageCircle,
  Mail,
  Phone,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INQUIRY_TYPES = [
  'Mobile App Development',
  'Web Application',
  'Full-Stack Project',
  'Developer Role / Hiring',
  'Other Inquiry',
];

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Mobile App Development');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentViaApi, setSentViaApi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('nuwandhara2000@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Free Web3Forms endpoint: forwards message straight to nuwandhara2000@gmail.com
      // Visitors can also send directly or use mailto fallback
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';

      if (accessKey && accessKey !== 'YOUR_ACCESS_KEY_HERE') {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            name,
            email,
            subject: `Portfolio Inquiry: ${inquiryType} from ${name}`,
            inquiry_type: inquiryType,
            message,
            from_name: name,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSentViaApi(true);
          setIsSuccess(true);
          return;
        } else {
          setErrorMsg(data.message || 'Could not send message via Web3Forms. Opening your email app instead...');
        }
      }

      // If no API key configured yet, open Gmail web composer or default mail client
      setSentViaApi(false);
      const subject = encodeURIComponent(`Project Inquiry: ${inquiryType} - ${name}`);
      const body = encodeURIComponent(
        `Hi Pinindu,\n\nName: ${name}\nEmail: ${email}\nInquiry: ${inquiryType}\n\nMessage:\n${message}\n\nSent from your portfolio website.`
      );

      // Try opening Gmail Web directly in browser (works without desktop mail client!)
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=nuwandhara2000@gmail.com&su=${subject}&body=${body}`;
      const mailtoUrl = `mailto:nuwandhara2000@gmail.com?subject=${subject}&body=${body}`;

      const newWindow = window.open(gmailUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback to mailto if popup blocked
        window.location.href = mailtoUrl;
      }

      setIsSuccess(true);
    } catch {
      // Graceful fallback to mailto on network error
      const subject = encodeURIComponent(`Project Inquiry: ${inquiryType} - ${name}`);
      const body = encodeURIComponent(
        `Hi Pinindu,\n\nName: ${name}\nEmail: ${email}\nInquiry: ${inquiryType}\n\nMessage:\n${message}`
      );
      window.location.href = `mailto:nuwandhara2000@gmail.com?subject=${subject}&body=${body}`;
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop contact-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="project-modal contact-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close conversation modal"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>

        <div className="contact-modal-header">
          <span className="section-kicker">
            <Sparkles size={11} className="contact-spark-icon" />
            LET’S TALK · AVAILABLE FOR OPPORTUNITIES
          </span>
          <h2 id="contact-modal-title">Start a Conversation</h2>
          <p className="contact-modal-desc">
            Whether you have a question, a project idea, or a developer role to discuss,
            reach out below and I’ll get back to you as soon as possible.
          </p>

          {/* Quick Direct Actions Pills */}
          <div className="contact-quick-pills">
            <a
              href="https://wa.me/94701046544?text=Hi%20Pinindu,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20talk%20about%20a%20project!"
              target="_blank"
              rel="noreferrer"
              className="quick-pill whatsapp"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Chat</span>
              <ArrowUpRight size={12} />
            </a>

            <button
              type="button"
              className={`quick-pill email ${copied ? 'copied' : ''}`}
              onClick={handleCopyEmail}
              title="Click to copy email address"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
            </button>

            <a
              href="tel:+94701046544"
              className="quick-pill phone"
              title="Call Pinindu Nuwandhara"
            >
              <Phone size={13} />
              <span>+94 701 046 544</span>
            </a>
          </div>
        </div>

        <div className="contact-modal-divider">
          <span>OR SEND A DIRECT MESSAGE</span>
        </div>

        {/* Form Body or Success State */}
        <div className="contact-modal-body">
          {isSuccess ? (
            <div className="contact-success-state">
              <div className="success-icon-wrap">
                <CheckCircle2 size={44} />
              </div>
              <h3>{sentViaApi ? 'Message Delivered!' : 'Email Draft Opened!'}</h3>
              <p>
                {sentViaApi ? (
                  <>
                    Thanks for reaching out, <strong>{name}</strong>! Your message has been sent directly to Pinindu’s Gmail inbox. I will reply to <strong>{email}</strong> shortly.
                  </>
                ) : (
                  <>
                    Your message has been pre-filled in your email client. Simply click <strong>Send</strong> to deliver it directly to <strong>nuwandhara2000@gmail.com</strong>.
                  </>
                )}
              </p>
              {!sentViaApi && (
                <div className="success-tip-box">
                  💡 <strong>Tip:</strong> To send messages 100% automatically in the background without opening an email tab, generate a free access key at <a href="https://web3forms.com" target="_blank" rel="noreferrer">web3forms.com</a> and add it to <code>.env.local</code>.
                </div>
              )}
              <div className="success-actions">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={onClose}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={handleReset}
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {/* Inquiry Type Pills */}
              <div className="form-group">
                <label className="form-label">I’M INTERESTED IN</label>
                <div className="inquiry-pills-row">
                  {INQUIRY_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`inquiry-pill ${inquiryType === type ? 'active' : ''}`}
                      onClick={() => setInquiryType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email inputs in 2 columns */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">
                    YOUR NAME <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">
                    YOUR EMAIL <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Message field */}
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  MESSAGE <span className="required-star">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Tell me about your project, timeline, tech requirements, or role..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                />
              </div>

              {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

              {/* Submit button */}
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button-primary contact-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="status-dot pulsing" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
                <span className="form-note">
                  Direct to <span className="accent-email">nuwandhara2000@gmail.com</span>
                </span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
