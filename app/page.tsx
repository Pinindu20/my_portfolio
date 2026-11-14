'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, BriefcaseBusiness, Code2, Github, Linkedin, Mail, MapPin, Menu, MessageCircle, Phone, Search, Sparkles, X } from 'lucide-react';
import { projects, type Project } from './projects';
import { CardCarousel, CardDetailsPanel, ModalGallery } from './ProjectCarousel';

const roles = ['Mobile Application Developer', 'Web Developer', 'Full-Stack Developer', 'Flutter Developer', 'Laravel Developer'];
const featuredIds = [1, 2, 12, 16, 20, 14];
const categories = ['All', 'Mobile', 'Web'];

function ProjectCard({ project, featured = false, onOpen }: { project: Project; featured?: boolean; onOpen: (project: Project) => void }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'details'>('preview');

  return (
    <div
      role="button"
      tabIndex={0}
      className={`project-card ${featured ? 'featured' : ''} ${activeTab === 'details' ? 'view-details-active' : ''}`}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
      aria-label={`View details for ${project.title}`}
    >
      <div className="card-top">
        <span className="project-number">{String(project.id).padStart(2, '0')}</span>
        <span className="project-type">{project.type}</span>

        {/* Tab switch pills */}
        <div className="card-tab-pills" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`card-tab-pill ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('preview');
            }}
            aria-label="View screenshot preview"
          >
            Screenshots
          </button>
          <button
            type="button"
            className={`card-tab-pill ${activeTab === 'details' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('details');
            }}
            aria-label="View stack and details"
          >
            Stack & Details
          </button>
        </div>

        <button
          type="button"
          className="card-top-expand"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(project);
          }}
          aria-label="Open full popup modal with zoomable images"
          title="Open in popup modal"
        >
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </div>

      {activeTab === 'preview' ? (
        <CardCarousel project={project} featured={featured} />
      ) : (
        <CardDetailsPanel project={project} featured={featured} onOpenModal={() => onOpen(project)} />
      )}

      <div className="project-copy">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="tag-row">
          {project.stack.length > 0 ? (
            project.stack.map(tag => (
              <span className="tag" key={tag}>{tag}</span>
            ))
          ) : (
            <span className="tag tag-dim">Full-Stack & DB</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const featured = useMemo(
    () => featuredIds.map(id => projects.find(project => project.id === id)).filter((p): p is Project => Boolean(p)),
    []
  );
  const visibleProjects = useMemo(() => projects.filter(project => {
    const matchesType = filter === 'All' || project.type === filter;
    const haystack = `${project.title} ${project.summary} ${project.stack.join(' ')} ${project.details.join(' ')}`.toLowerCase();
    return matchesType && haystack.includes(query.toLowerCase());
  }), [filter, query]);
  const closeMenu = () => setMenuOpen(false);

  return <>
    <header className="site-header"><a className="wordmark" href="#home" aria-label="Pinindu Nuwandhara home">Pinindu Nuwandhara<span>.</span></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation"><a href="#about" onClick={closeMenu}>About</a><a href="#experience" onClick={closeMenu}>Experience</a><a href="#work" onClick={closeMenu}>Projects</a><a href="#contact" onClick={closeMenu} className="nav-contact">Let’s talk <ArrowUpRight size={15}/></a></nav>
    </header>

    <main>
      <section className="hero section-wrap" id="home"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/> AVAILABLE FOR NEW OPPORTUNITIES</div>
        <h1>Building useful<br/><span className="gradient-text">digital products.</span></h1>
        <p className="hero-intro">I’m <strong>Pinindu Nuwandhara</strong>, a developer creating mobile and web applications with a focus on practical, thoughtful experiences.</p>
        <div className="hero-actions"><a className="button button-primary" href="#work">Explore my work <ArrowDownRight size={17}/></a><a className="button button-quiet" href="#contact">Get in touch <ArrowRight size={16}/></a></div>
        <div className="hero-meta"><span><MapPin size={15}/> Matara, Sri Lanka</span><span className="meta-divider"/><span>Web · Mobile · Full-stack</span></div>
      </div><div className="hero-visual" aria-label="Pinindu Nuwandhara profile portrait and decorative graphic"><div className="visual-grid"/><div className="visual-glow"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-photo-wrap"><Image src="/profile.jpg" alt="Pinindu Nuwandhara" width={220} height={270} priority className="hero-photo"/><div className="photo-backdrop-glow"/></div><div className="float-chip chip-code"><Code2 size={15}/> Flutter / Laravel</div><div className="float-chip chip-build"><span className="status-dot"/> building with purpose</div><div className="visual-caption">PININDU NUWANDHARA · DEVELOPER</div></div>
        <a className="scroll-note" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></a>
      </section>

      <section className="intro-band"><div className="section-wrap intro-inner"><span className="section-kicker">01 / A LITTLE ABOUT ME</span><p>From <em>mobile workflows</em> to <em>business platforms</em>, I enjoy turning real needs into clear, dependable software.</p><a className="text-link" href="#about">More about me <ArrowRight size={15}/></a></div></section>

      <section className="section-wrap about-section" id="about"><div className="section-heading"><div><span className="section-kicker">01 / PROFILE</span><h2>Curious by nature.<br/><span className="muted-heading">Developer by craft.</span></h2></div><div className="section-side-note">A grounded approach to building<br/>software that people can use.</div></div>
        <div className="about-grid"><div className="about-text"><p>I’m a software developer based in Matara, Sri Lanka, working across web and mobile application development. My experience includes building business workflows, mobile apps, backend integrations, and management systems.</p><p>I like solving practical problems with clean interfaces and maintainable code. I’m especially interested in Flutter development and Laravel-backed applications.</p><div className="about-links"><a href="https://github.com/Pinindu20" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/in/pinindu-nuwandhara-99a9832ba/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14}/></a></div></div>
          <div className="skills-panel"><span className="panel-label">AREAS I WORK IN</span><div className="skills-list">{roles.map((role, index) => <div className="skill-line" key={role}><span className="skill-index">0{index + 1}</span><span>{role}</span><ArrowUpRight size={15}/></div>)}</div><div className="skills-foot"><span>Curious about the whole stack</span><span className="skill-spark">✳</span></div></div></div>
      </section>

      <section className="experience-section" id="experience"><div className="section-wrap"><div className="section-heading"><div><span className="section-kicker">02 / EXPERIENCE</span><h2>Learning by <span className="muted-heading">building.</span></h2></div><div className="section-side-note">A growing path through web<br/>and mobile development.</div></div>
        <div className="timeline"><article className="timeline-item"><div className="timeline-date">JUL 2025 — PRESENT</div><div className="timeline-marker"><span/></div><div className="timeline-content"><div className="timeline-title"><div><h3>Mobile Application Developer</h3><p>Rapidventure Business Solutions</p></div><BriefcaseBusiness size={18}/></div><p className="timeline-desc">Developing mobile applications as part of an ongoing role, alongside web development responsibilities.</p><span className="role-pill">Current role</span></div></article>
        <article className="timeline-item"><div className="timeline-date">MAR 2025 — PRESENT</div><div className="timeline-marker"><span/></div><div className="timeline-content"><div className="timeline-title"><div><h3>Web Developer</h3><p>Rapidventure Business Solutions</p></div><BriefcaseBusiness size={18}/></div><p className="timeline-desc">Working on web development and real-world software projects.</p><span className="role-pill">Current role</span></div></article>
        <article className="timeline-item"><div className="timeline-date">AUG 2024 — FEB 2025</div><div className="timeline-marker"><span/></div><div className="timeline-content"><div className="timeline-title"><div><h3>Software Developer Intern</h3><p>CIS World (PVT) Ltd</p></div><BriefcaseBusiness size={18}/></div><p className="timeline-desc">Completed a six-month internship in a software development role.</p><span className="role-pill completed">6-month internship</span></div></article></div>
      </div></section>

      <section className="section-wrap education-section"><div className="section-heading"><div><span className="section-kicker">03 / EDUCATION</span><h2>Built on a strong <span className="muted-heading">foundation.</span></h2></div></div><div className="education-grid"><article className="education-card"><span className="edu-year">2022 — 2024</span><span className="edu-symbol">✳</span><h3>Higher National Diploma<br/>in Information Technology</h3><p>Faculty of Information Technology<br/>Advanced Technological Institute — Galle</p><span className="edu-status">GRADUATED</span></article><article className="education-card education-secondary"><span className="edu-year">2020</span><span className="edu-symbol">◌</span><h3>G.C.E. Advanced Level<br/>— Common Stream</h3><p>Combined Mathematics — C<br/>Physics — S · ICT — S</p><span className="edu-status">COMPLETED</span></article></div></section>

      <section className="work-section" id="work"><div className="section-wrap"><div className="section-heading work-heading"><div><span className="section-kicker">04 / SELECTED WORK</span><h2>Projects with a <span className="muted-heading">purpose.</span></h2></div><p className="section-side-note">A selection from mobile apps<br/>and business systems I’ve worked on.</p></div>
        <div className="featured-grid">{featured.map(project => <ProjectCard project={project} featured key={project.id} onOpen={setActiveProject}/>)}</div>
        <div className="all-projects-heading"><div><span className="section-kicker">THE FULL COLLECTION</span><h3>All projects <span>({projects.length})</span></h3></div><p>Explore all {projects.length} projects by name, type, or technology.</p></div>
        <div className="project-controls"><div className="filters" role="group" aria-label="Filter projects by type">{categories.map(category => <button key={category} className={filter === category ? 'filter active' : 'filter'} onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>)}</div><label className="search-box"><Search size={16}/><input aria-label="Search projects" placeholder="Search projects or tools…" value={query} onChange={event => setQuery(event.target.value)} suppressHydrationWarning/>{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><X size={14}/></button>}</label></div>
        {visibleProjects.length ? <div className="projects-grid">{visibleProjects.map(project => <ProjectCard project={project} key={project.id} onOpen={setActiveProject}/>)}</div> : <div className="empty-state">No projects match that search. Try another term.</div>}
      </div></section>

      <section className="contact-section" id="contact"><div className="section-wrap contact-wrap"><div className="contact-top"><span className="section-kicker">05 / CONTACT</span><span className="contact-availability"><i/> OPEN TO OPPORTUNITIES</span></div><h2>Have a project<br/>in <span className="gradient-text">mind?</span></h2><div className="contact-bottom"><p>I’m open to conversations about developer roles and interesting projects. Feel free to reach out.</p><a className="button button-primary contact-cta" href="mailto:nuwandhara2000@gmail.com">Start a conversation <ArrowUpRight size={17}/></a></div><div className="contact-details"><a href="mailto:nuwandhara2000@gmail.com"><Mail size={15}/> nuwandhara2000@gmail.com</a><a href="tel:+94701046544"><Phone size={15}/> +94 701 046 544</a><a href="https://wa.me/qr/76XMH3LYYADSP1" target="_blank" rel="noreferrer"><MessageCircle size={15}/> WhatsApp</a></div></div></section>
    </main>
    <footer className="site-footer"><div className="section-wrap footer-inner"><a className="wordmark" href="#home">PN<span>.</span></a><span>© {new Date().getFullYear()} Pinindu Nuwandhara</span><div className="footer-social"><a href="https://github.com/Pinindu20" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a><a href="https://www.linkedin.com/in/pinindu-nuwandhara-99a9832ba/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a><a href="mailto:nuwandhara2000@gmail.com" aria-label="Email"><Mail size={17}/></a></div><a className="back-top" href="#home">BACK TO TOP <ArrowUpRight size={13}/></a></div></footer>

    {activeProject && (
      <div
        className="modal-backdrop"
        role="presentation"
        onMouseDown={event => {
          if (event.target === event.currentTarget) setActiveProject(null);
        }}
      >
        <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" onClick={() => setActiveProject(null)} aria-label="Close project details">
            <X size={19}/>
          </button>
          <ModalGallery project={activeProject} />
          <div className="modal-content">
            <span className="section-kicker">PROJECT {String(activeProject.id).padStart(2, '0')} / {activeProject.type.toUpperCase()}</span>
            <h2 id="modal-title">{activeProject.title}</h2>
            <div className="modal-summary-row">
              <p className="modal-summary">{activeProject.summary}</p>
              <button
                type="button"
                className="modal-jump-to-details"
                onClick={() => {
                  const detailsEl = document.getElementById('modal-details-anchor');
                  detailsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                aria-label="Scroll to technology stack and project workflows"
              >
                <span>Scroll to details</span>
                <ArrowDown size={12} />
              </button>
            </div>

            {/* Technology Stack Section */}
            <div className="modal-details-section" id="modal-details-anchor">
              <div className="modal-details-kicker-row">
                <span className="modal-details-kicker">TECHNOLOGY STACK</span>
                <span className="modal-details-count">
                  {activeProject.stack.length > 0
                    ? `${activeProject.stack.length} technologies`
                    : 'Full-stack'}
                </span>
              </div>
              <div className="modal-stack-tags">
                {activeProject.stack.length > 0 ? (
                  activeProject.stack.map(tag => (
                    <span className="modal-stack-tag" key={tag}>
                      <Sparkles size={10} className="modal-tag-icon" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="modal-stack-tag dim">Full-Stack Architecture &amp; DB Design</span>
                )}
              </div>
            </div>

            {/* Key Workflows & Details Section */}
            {activeProject.details.length > 0 && (
              <div className="modal-details-section">
                <div className="modal-details-kicker-row">
                  <span className="modal-details-kicker">KEY WORKFLOWS &amp; DETAILS</span>
                  <span className="modal-details-count">{activeProject.details.length} features</span>
                </div>
                <ul className="modal-bullet-list">
                  {activeProject.details.map((detail, idx) => (
                    <li key={idx} className="modal-bullet-item">
                      <span className="modal-bullet-icon">✳</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Bottom Action Controls */}
            <div className="modal-bottom-actions">
              <button
                type="button"
                className="modal-bottom-top-btn"
                onClick={() => {
                  const modal = document.querySelector('.project-modal');
                  modal?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ArrowUp size={13} />
                <span>Back to screenshots</span>
              </button>
              <button
                type="button"
                className="modal-bottom-close-btn"
                onClick={() => setActiveProject(null)}
              >
                Close Project
              </button>
            </div>
          </div>
        </section>
      </div>
    )}
  </>;
}
