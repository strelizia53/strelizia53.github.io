import {
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaDownload,
  FaPython,
  FaAws,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiExpress,
  SiMongodb,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiMysql,
} from "react-icons/si";

export default function AboutPage() {
  const skills = [
    { name: "JavaScript (ES6+)", icon: <FaJs size={26} /> },
    { name: "TypeScript", icon: <SiTypescript size={26} /> },
    { name: "React", icon: <FaReact size={26} /> },
    { name: "Next.js", icon: <SiNextdotjs size={26} /> },
    { name: "Node.js", icon: <FaNodeJs size={26} /> },
    { name: "Express", icon: <SiExpress size={26} /> },
    { name: "MongoDB", icon: <SiMongodb size={26} /> },
    { name: "Firebase", icon: <SiFirebase size={26} /> },
    { name: "Python", icon: <FaPython size={26} /> },
    { name: "Flask", icon: <SiFlask size={26} /> },
    { name: "Flutter", icon: <SiFlutter size={26} /> },
    { name: "MySQL", icon: <SiMysql size={26} /> },
    { name: "Git & GitHub", icon: <FaGitAlt size={26} /> },
    { name: "AWS", icon: <FaAws size={26} /> },
  ];

  return (
    <section className="container fade-in">
      {/* Hero */}
      <div className="about-hero">
        <h1>About Me</h1>
        <p>
          I&apos;m a full-stack developer passionate about building clean, scalable,
          and user-focused web applications. I enjoy learning new technologies and
          improving my craft one project at a time.
        </p>
      </div>

      {/* CV Download */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-3xl)" }}>
        <a href="/cv.pdf" download className="cv-button">
          <FaDownload size={16} />
          Download CV
        </a>
      </div>

      <div className="divider" />

      {/* Skills */}
      <div className="section">
        <h2 className="section-heading">Skills &amp; Technologies</h2>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <h3>{skill.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Experience */}
      <div className="section">
        <h2 className="section-heading">Experience</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">2024 &ndash; Present</div>
            <div className="timeline-content">
              <h3>Freelance Full-Stack Developer</h3>
              <p className="timeline-org">Self-employed</p>
              <p>
                Designing and building full-stack web applications for clients —
                from scoping and UI design to deployment and maintenance. Focus on
                React, Next.js, and Node.js ecosystems.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">2023 &ndash; 2024</div>
            <div className="timeline-content">
              <h3>Personal Projects &amp; Open Source</h3>
              <p className="timeline-org">Independent</p>
              <p>
                Built multiple production-grade projects exploring full-stack
                development, REST APIs, authentication flows, and database design.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Education */}
      <div className="section">
        <h2 className="section-heading">Education</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-date">2022 &ndash; Present</div>
            <div className="timeline-content">
              <h3>Computer Science</h3>
              <p className="timeline-org">University</p>
              <p>
                Studying core CS fundamentals — algorithms, data structures,
                operating systems, and software engineering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
