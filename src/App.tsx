import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiAward,
  FiBookOpen,
  FiCloud,
  FiCode,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiSend,
} from "react-icons/fi";
import { portfolio } from "./data/portfolio";
import "./App.css";

const navItems = [
  { label: "about", href: "/#about" },
  { label: "experience", href: "/#experience" },
  { label: "education", href: "/#education" },
  { label: "certifications", href: "/#certifications" },
  { label: "research", href: "/#research" },
  { label: "skills", href: "/#skills" },
  { label: "projects", href: "/projects" },
  { label: "contact", href: "/#contact" },
];

type PortfolioProject = (typeof portfolio.projects)[number];

function useReveal(routeKey: string) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [routeKey]);
}

function useMagnetic() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const cleanups: Array<() => void> = [];

    elements.forEach((element) => {
      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
      };
      const onLeave = () => {
        element.style.transform = "translate(0, 0)";
      };
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let glowX = cursorX;
    let glowY = cursorY;
    let frame = 0;

    const move = (event: PointerEvent) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      document.documentElement.style.setProperty("--cursor-x", `${cursorX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${cursorY}px`);
    };
    const over = (event: Event) => {
      if ((event.target as HTMLElement).closest("a,button,input,textarea,[data-cursor='large']")) {
        document.body.classList.add("cursor-large");
      }
    };
    const out = (event: Event) => {
      if ((event.target as HTMLElement).closest("a,button,input,textarea,[data-cursor='large']")) {
        document.body.classList.remove("cursor-large");
      }
    };
    const tick = () => {
      glowX += (cursorX - glowX) * 0.16;
      glowY += (cursorY - glowY) * 0.16;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      <div className="cursor-dot" ref={cursorRef} aria-hidden="true" />
    </>
  );
}

function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: -1000, y: -1000 };
    const dots = Array.from({ length: 78 }, (_, index) => ({
      x: ((index * 83) % 100) / 100,
      y: ((index * 47) % 100) / 100,
      phase: index * 0.53,
      speed: 0.00022 + (index % 5) * 0.000035,
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const positions = dots.map((dot) => ({
        x: dot.x * width + Math.cos(time * dot.speed + dot.phase) * 18,
        y: dot.y * height + Math.sin(time * dot.speed + dot.phase) * 18,
      }));

      positions.forEach((a, index) => {
        for (let j = index + 1; j < positions.length; j += 1) {
          const b = positions[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < 145) {
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(125, 244, 255, ${(1 - distance / 145) * 0.09})`;
            context.stroke();
          }
        }
      });

      positions.forEach(({ x, y }) => {
        const distance = Math.hypot(pointer.x - x, pointer.y - y);
        const proximity = Math.max(0, 1 - distance / 240);
        context.beginPath();
        context.arc(x, y, 1.2 + proximity * 2.8, 0, Math.PI * 2);
        context.fillStyle = `rgba(183, 243, 74, ${0.18 + proximity * 0.62})`;
        context.fill();
        if (proximity > 0.08) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(pointer.x, pointer.y);
          context.strokeStyle = `rgba(183, 243, 74, ${proximity * 0.16})`;
          context.stroke();
        }
      });
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas className="signal-field" ref={canvasRef} aria-hidden="true" />;
}

function TypingText() {
  const [index, setIndex] = useState(0);
  const [slice, setSlice] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const words = portfolio.typed;
  const current = words[index % words.length];

  useEffect(() => {
    const doneTyping = slice === current.length;
    const doneDeleting = slice === 0;
    const delay = doneTyping && !deleting ? 1200 : deleting ? 36 : 72;
    const timer = window.setTimeout(() => {
      if (doneTyping && !deleting) {
        setDeleting(true);
      } else if (doneDeleting && deleting) {
        setDeleting(false);
        setIndex((value) => value + 1);
      } else {
        setSlice((value) => value + (deleting ? -1 : 1));
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [current, deleting, slice]);

  return <span className="typing-text">{current.slice(0, slice)}</span>;
}

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--tilt-x", `${(-y * 9).toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
      element.style.setProperty("--look-x", `${(x * 18).toFixed(2)}px`);
      element.style.setProperty("--look-y", `${(y * 14).toFixed(2)}px`);
    };
    const leave = () => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--look-x", "0px");
      element.style.setProperty("--look-y", "0px");
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="portrait-card" ref={ref} data-cursor="large">
      <div className="portrait-hud">
        <span aria-hidden="true" />
        <strong>ACTIVE</strong>
      </div>
      <img src={portfolio.portrait} alt="Rahul Debnath portrait" loading="eager" />
      <span className="eye-track eye-left" />
      <span className="eye-track eye-right" />
      <div className="portrait-ring" />
      <div className="portrait-scan" />
    </div>
  );
}

function SkillBubbles() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bubbles = useMemo(
    () =>
      portfolio.skills.map((skill, index) => ({
        skill,
        size: 68 + (index % 6) * 10 + (skill.length > 16 ? 12 : 0),
        left: 10 + ((index * 17) % 78),
        top: 10 + ((index * 29) % 76),
        phase: index * 0.63,
      })),
    []
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const pointer = { x: -1000, y: -1000 };
    let frame = 0;

    const move = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const tick = (time: number) => {
      const rect = wrap.getBoundingClientRect();
      const nodes = Array.from(wrap.querySelectorAll<HTMLElement>(".skill-bubble"));
      const positions = bubbles.map((data) => ({
        x: (data.left / 100) * rect.width + Math.cos(time * 0.00038 + data.phase) * 24,
        y: (data.top / 100) * rect.height + Math.sin(time * 0.00048 + data.phase) * 28,
      }));

      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const a = positions[i];
          const b = positions[j];
          const minDistance = (bubbles[i].size + bubbles[j].size) * 0.42;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (distance < minDistance) {
            const push = (minDistance - distance) * 0.18;
            const ux = dx / distance;
            const uy = dy / distance;
            a.x += ux * push;
            a.y += uy * push;
            b.x -= ux * push;
            b.y -= uy * push;
          }
        }
      }

      nodes.forEach((element, index) => {
        const position = positions[index];
        const dx = position.x - pointer.x;
        const dy = position.y - pointer.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const force = Math.max(0, 1 - distance / 190);
        const pushX = (dx / distance) * force * 92;
        const pushY = (dy / distance) * force * 92;
        const scale = 1 + force * 0.08;
        element.style.transform = `translate3d(${position.x + pushX}px, ${position.y + pushY}px, 0) scale(${scale})`;
        element.style.setProperty("--bubble-glow", `${0.12 + force * 0.35}`);
      });
      frame = requestAnimationFrame(tick);
    };

    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, [bubbles]);

  return (
    <div className="skills-orbital" ref={wrapRef} data-cursor="large">
      {bubbles.map((bubble) => (
        <span
          className="skill-bubble"
          key={bubble.skill}
          style={{
            width: bubble.size,
            height: bubble.size,
            marginLeft: -bubble.size / 2,
            marginTop: -bubble.size / 2,
          }}
        >
          {bubble.skill}
        </span>
      ))}
    </div>
  );
}

function ContactForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = encodeURIComponent(String(form.get("name") || ""));
    const message = encodeURIComponent(String(form.get("message") || ""));
    window.location.href = `mailto:${portfolio.email}?subject=Portfolio enquiry from ${name}&body=${message}`;
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} data-reveal>
      <label>
        <span>Name</span>
        <input name="name" placeholder="Your name" autoComplete="name" required />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" placeholder="Tell me what you want to build..." rows={4} required />
      </label>
      <button data-magnetic type="submit">
        Send signal <FiSend />
      </button>
    </form>
  );
}

function getProjectUrl(project: PortfolioProject) {
  const links = project.links as { linkedin?: string; github?: string; live?: string } | undefined;
  return links?.linkedin || links?.github || links?.live || project.link || "";
}

function ProjectCard({ project, index, compact = false }: { project: PortfolioProject; index: number; compact?: boolean }) {
  const projectUrl = getProjectUrl(project);
  const visualIndex = (index % 5) + 1;

  return (
    <article
      className={`project-card${project.title.length > 48 ? " project-card--long-title" : ""}${compact ? " archive-project-card" : ""}`}
      data-reveal
      key={project.id || project.title}
      data-cursor="large"
      id={compact ? `project-${project.id}` : undefined}
    >
      <div className={`project-visual visual-${visualIndex}`}>
        <span>{project.code}</span>
        <div className="project-scan" />
        <div className="project-map-lines" />
      </div>
      <div className="project-details">
        <div className="project-kicker">
          <span>{String(index + 1).padStart(2, "0")}</span>
          {project.year} | {project.type}
        </div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.contribution && <p className="project-contribution">Contribution: {project.contribution}</p>}
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {projectUrl && (
          <a href={projectUrl} target="_blank" rel="noopener noreferrer" data-magnetic>
            View Project <FiArrowUpRight />
          </a>
        )}
      </div>
    </article>
  );
}

function ProjectsPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const projects = portfolio.projects;
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((project) => project.categories || [project.type]))).sort()],
    [projects]
  );
  const visibleProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((project) => {
      const categoryMatch = activeCategory === "All" || (project.categories || [project.type]).includes(activeCategory);
      const haystack = [
        project.title,
        project.type,
        project.category,
        project.summary,
        project.description,
        project.contribution,
        ...(project.tags || []),
        ...(project.categories || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return categoryMatch && (!query || haystack.includes(query));
    });
  }, [activeCategory, projects, searchQuery]);
  const climaq = projects.find((project) => project.id === "climaq");

  return (
    <div className="projects-page section-pad">
      <section className="project-archive-hero" data-reveal>
        <a className="back-home-link" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <FiArrowDownRight /> Back to portfolio
        </a>
        <p className="eyebrow">Project Archive</p>
        <h1>Systems built for the real world.</h1>
        <p>
          A collection of AI, machine learning, geospatial intelligence, data analytics, climate intelligence,
          and applied research systems powered by one maintainable project archive.
        </p>
        <div className="archive-count">
          <strong>{projects.length}</strong>
          <span>{projects.length === 1 ? "Project" : "Projects"}</span>
        </div>
      </section>

      {climaq && (
        <section className="project-detail-panel" data-reveal aria-labelledby="climaq-detail-title">
          <div>
            <span className="paper-status">Featured Project</span>
            <h2 id="climaq-detail-title">CLiMAQ</h2>
            <p>{climaq.description}</p>
          </div>
          <dl>
            <div>
              <dt>Context</dt>
              <dd>{climaq.context}</dd>
            </div>
            <div>
              <dt>Domain</dt>
              <dd>{climaq.domain}</dd>
            </div>
            <div>
              <dt>My Contribution</dt>
              <dd>{climaq.contribution}</dd>
            </div>
          </dl>
          <a href={getProjectUrl(climaq)} target="_blank" rel="noopener noreferrer" data-magnetic>
            LinkedIn project announcement <FiArrowUpRight />
          </a>
        </section>
      )}

      <section className="archive-controls" aria-label="Project filters" data-reveal>
        <div className="archive-filter-row">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={category === activeCategory ? "active" : ""}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="project-search">
          <span>Search projects</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title, category, technology..."
          />
        </label>
      </section>

      <section className="archive-grid" aria-label="All projects">
        {visibleProjects.map((project, index) => (
          <ProjectCard project={project} index={index} compact key={project.id || project.title} />
        ))}
      </section>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(() => window.location.pathname);
  useReveal(route);
  useMagnetic();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isProjectsRoute = route === "/projects";
  const featuredProjects = useMemo(
    () =>
      portfolio.projects
        .filter((project) => project.featured)
        .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999))
        .slice(0, 5),
    []
  );

  const navigate = (href: string) => {
    const url = new URL(href, window.location.origin);
    window.history.pushState({}, "", `${url.pathname}${url.hash}`);
    setRoute(url.pathname);
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = isProjectsRoute ? "Projects | Rahul Debnath" : "Rahul Debnath | AI/ML Software Engineer";
    let meta = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = isProjectsRoute
      ? "Explore Rahul Debnath's AI, machine learning, geospatial intelligence, data analytics, climate intelligence and research projects."
      : "Rahul Debnath's AI/ML software engineering portfolio across Agentic AI, GeoAI, research, and production systems.";
  }, [isProjectsRoute]);

  useEffect(() => {
    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(available > 0 ? window.scrollY / available : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell">
      <CustomCursor />
      <SignalField />
      <div className="ambient-orb orb-one" aria-hidden="true" />
      <div className="ambient-orb orb-two" aria-hidden="true" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Rahul Debnath - home">
          RD<span>_</span>
        </a>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav id="main-navigation" className={menuOpen ? "nav-open" : ""}>
          {navItems.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.href);
              }}
            >
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-status" href={`mailto:${portfolio.email}`} data-magnetic>
          <i /> Available for AI/ML opportunities
        </a>
      </header>

      <main id="top">
        {isProjectsRoute ? (
          <ProjectsPage onNavigate={navigate} />
        ) : (
          <>
        <section className="hero section-pad">
          <div className="hero-meta hero-animate">
            <span>
              <FiMapPin /> {portfolio.location}
            </span>
            <span>AI/ML Software Engineer | Agentic AI | Researcher</span>
          </div>
          <div className="hero-grid">
            <Portrait />
            <div className="hero-copy">
              <p className="eyebrow hero-animate">AI / ML | Agentic AI | GeoAI | Software Engineering</p>
              <div className="designation-badge hero-animate">
                <span>{portfolio.title}</span>
              </div>
              <h1 aria-label="Rahul Debnath">
                <span className="hero-line">
                  <span>RAHUL</span>
                </span>
                <span className="hero-line outline">
                  <span>DEBNATH</span>
                </span>
              </h1>
              <p className="typing-shell hero-animate">
                Building <TypingText />
              </p>
              <div className="hero-badges hero-animate">
                {portfolio.heroBadges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
              <div className="hero-bottom hero-animate">
                <p>{portfolio.hero}</p>
                <div className="hero-actions">
                  <a href="#work" className="pill-link primary" data-magnetic>
                    Explore work <FiArrowDownRight />
                  </a>
                  <a href={portfolio.resume} className="pill-link" target="_blank" data-magnetic>
                    Resume <FiDownload />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ticker" aria-label="Core disciplines">
          <div>
            {[...portfolio.disciplines, ...portfolio.disciplines].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i>✦</i>
              </span>
            ))}
          </div>
        </section>

        <section className="about section-pad" id="about">
          <div className="section-index" data-reveal>
            <span>01</span> Profile
          </div>
          <div className="about-grid">
            <h2 data-reveal>
              I turn complex spatial and document data into <em>deployable intelligence.</em>
            </h2>
            <div className="about-copy" data-reveal>
              <p>{portfolio.about}</p>
              <div className="link-row">
                <a href={portfolio.linkedin} target="_blank" rel="noreferrer" data-magnetic>
                  <FiLinkedin /> LinkedIn <FiArrowUpRight />
                </a>
                <a href={portfolio.github} target="_blank" rel="noreferrer" data-magnetic>
                  <FiGithub /> GitHub <FiArrowUpRight />
                </a>
                <a href={portfolio.resume} target="_blank" data-magnetic>
                  <FiDownload /> Resume
                </a>
              </div>
            </div>
          </div>
          <div className="metrics">
            {portfolio.metrics.map((metric) => (
              <div className="metric" key={metric.label} data-reveal>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="experience section-pad" id="experience">
          <div className="section-index" data-reveal>
            <span>02</span> Professional Experience
          </div>
          <div className="section-heading" data-reveal>
            <p>Professional Timeline</p>
            <h2>Career journey shaped by promotion, production AI, and research depth.</h2>
          </div>
          <div className="career-roadmap">
            {portfolio.experience.map((role, index) => (
              <article className={index === 0 ? "career-card current-role" : "career-card"} data-reveal key={`${role.role}-${role.period}`}>
                <div className="career-node">
                  <span>0{index + 1}</span>
                  <i />
                </div>
                <div>
                  <span className="role-badge">{role.badge}</span>
                  <p className="timeline-date">{role.period}</p>
                  <h3>{role.role}</h3>
                  <h4>{role.company} | {role.location}</h4>
                  <p className="role-focus">{role.focus}</p>
                </div>
                <div className="role-summary">
                  <p>{role.summary}</p>
                  <div className="impact-list">
                    {role.impact.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="education section-pad" id="education">
          <div className="section-index" data-reveal>
            <span>03</span> Education
          </div>
          <div className="section-heading education-heading" data-reveal>
            <p>Academic Foundation</p>
            <h2>Data analytics, geoinformatics, and spatial reasoning built through a rising academic journey.</h2>
          </div>
          <div className="education-grid">
            {portfolio.education.map((education, index) => (
              <article className={index === 0 ? "education-card education-card--primary" : "education-card"} data-reveal key={education.degree}>
                <div className="education-card-top">
                  <span className="role-badge"><FiBookOpen /> {education.type}</span>
                  <p className="timeline-date">{education.period}</p>
                </div>
                <h3>{education.degree}</h3>
                {"specialization" in education && <p className="education-specialization">{education.specialization}</p>}
                <div className="education-meta">
                  <p>{education.institution}</p>
                  {"formerly" in education && <span>{education.formerly}</span>}
                  {"affiliation" in education && <span>{education.affiliation}</span>}
                  <span>{education.location}</span>
                </div>
                {"cgpa" in education && (
                  <div className="cgpa-chip">
                    <span>CGPA</span>
                    <strong>{education.cgpa}</strong>
                  </div>
                )}
                {"semesters" in education && (
                  <div className="academic-progress" aria-label="Semester Performance: Sem 1 7.15 out of 10, Sem 2 8.85 out of 10, Sem 3 9.25 out of 10, Sem 4 10.00 / 10.00">
                    <div className="progress-head">
                      <span>Academic Progress</span>
                      <strong>+2.85 points</strong>
                    </div>
                    <div className="semester-line" role="list">
                      {education.semesters?.map((semester, semesterIndex) => (
                        <div
                          className={semesterIndex === (education.semesters?.length ?? 0) - 1 ? "semester-node semester-node--final" : "semester-node"}
                          role="listitem"
                          key={semester.label}
                          style={{ "--score": semester.value } as { [key: string]: number }}
                          tabIndex={0}
                          aria-label={`${semester.label}: ${semester.score}${semester.score.includes("/") ? "" : " out of 10"}`}
                        >
                          <strong>{semester.score}</strong>
                          <span>{semester.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="tag-row education-tags">
                  {education.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="certifications section-pad" id="certifications">
          <div className="section-index" data-reveal>
            <span>04</span> Certifications
          </div>
          <div className="section-heading certification-heading" data-reveal>
            <p>Verified Learning</p>
            <h2>Cloud, analytics, and developer-tool credentials that strengthen production engineering work.</h2>
          </div>
          <div className="certification-grid">
            {portfolio.certifications.map((certificate, index) => (
              <article className={`certification-card certification-card--${certificate.icon}`} data-reveal key={`${certificate.provider}-${certificate.title}`}>
                <div className="certification-icon" aria-hidden="true">
                  {certificate.icon === "cloud" ? <FiCloud /> : <FiCode />}
                </div>
                <span className="certificate-index">0{index + 1}</span>
                <p className="paper-project">{certificate.provider}</p>
                <h3>{certificate.title}</h3>
                <span className="certificate-category">{certificate.category}</span>
                <p>{certificate.description}</p>
                {"link" in certificate && certificate.link ? (
                  <a href={certificate.link} target="_blank" rel="noopener noreferrer" data-magnetic>
                    View Credential <FiArrowUpRight />
                  </a>
                ) : (
                  <small>
                    <FiAward /> Authorized by Google · Offered through Coursera
                  </small>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="research section-pad" id="research">
          <div className="section-index" data-reveal>
            <span>05</span> Research & Publications
          </div>
          <div className="research-hero" data-reveal>
            <p>3 research papers accepted at international conferences</p>
            <h2>Remote sensing, climate justice, and AI research with visible leadership impact.</h2>
          </div>
          <div className="publication-timeline">
            {portfolio.publications.map((paper, index) => (
              <article className="paper-card priority-paper" key={paper.title} data-reveal>
                <div className="paper-index">0{index + 1}</div>
                <div>
                  <span className="paper-status">{paper.status}</span>
                  <p className="paper-venue">{paper.venue} | {paper.conference}</p>
                  <p className="paper-project">{paper.project}</p>
                  <h3>{paper.title}</h3>
                  <p>{paper.description}</p>
                  {"proof" in paper && paper.proof && (
                    <a className="paper-proof" href={paper.proof} target="_blank" rel="noreferrer">
                      LinkedIn achievement proof <FiArrowUpRight />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="skills section-pad" id="skills">
          <div className="section-index" data-reveal>
            <span>06</span> Technical Competencies
          </div>
          <div className="skills-grid">
            <div data-reveal>
              <p className="eyebrow">Core Technical Expertise</p>
              <h2>AI, agentic systems, geospatial intelligence, and research leadership.</h2>
              <div className="notification-stack">
                {portfolio.skillNotifications.map((note) => (
                  <article className="skill-toast" key={note.title}>
                    <i />
                    <div>
                      <h3>{note.title}</h3>
                      <p>{note.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <SkillBubbles />
          </div>
        </section>

        <section className="work section-pad" id="work">
          <div className="section-index" data-reveal>
            <span>07</span> Selected Projects
          </div>
          <div className="section-heading work-heading" data-reveal>
            <p>Selected Projects / 2025-2026</p>
            <h2>Systems built for the real world.</h2>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard project={project} index={index} key={project.id || project.title} />
            ))}
          </div>
          <div className="project-archive-cta" data-reveal>
            <p>Explore the full project archive</p>
            <h3>{portfolio.projects.length} projects across AI, ML, geospatial intelligence, climate risk, data analytics, and applied research.</h3>
            <a
              href="/projects"
              onClick={(event) => {
                event.preventDefault();
                navigate("/projects");
              }}
              data-magnetic
            >
              View All Projects <FiArrowUpRight />
            </a>
          </div>
        </section>

        <section className="achievements section-pad">
          <div className="section-index" data-reveal>
            <span>08</span> Key Achievements
          </div>
          <div className="achievement-showcase" data-reveal>
            <p>Research & Professional Milestones</p>
            <h2>Major accomplishments across AI engineering, research publication, and leadership.</h2>
          </div>
          <div className="achievement-grid">
            {portfolio.achievements.map((achievement, index) => (
              <article data-reveal key={achievement.label}>
                <span>0{index + 1}</span>
                <strong>{achievement.value}</strong>
                <p>{achievement.label}</p>
                <small>{achievement.detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="contact-orbit" aria-hidden="true" />
          <div className="contact-grid">
            <div>
              <p className="eyebrow" data-reveal>
                Have a problem worth mapping?
              </p>
              <h2 data-reveal>
                LET&apos;S BUILD
                <br />
                <span>SOMETHING USEFUL.</span>
              </h2>
              <a className="contact-email" href={`mailto:${portfolio.email}`} data-reveal data-magnetic>
                <FiMail /> {portfolio.email} <FiArrowUpRight />
              </a>
            </div>
            <ContactForm />
          </div>
          <footer>
            <p>© {new Date().getFullYear()} Rahul Debnath</p>
            <div>
              <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={portfolio.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href="#top">Back to top ↑</a>
            </div>
          </footer>
        </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
