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
      <div className="about-hero">
        <h1>About Me</h1>
        <p>
          I’m an entry-level full-stack developer passionate about building
          clean, scalable, and user-focused web applications. I enjoy learning
          new technologies and improving my craft one project at a time.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "34px" }}>
        <a href="/cv.pdf" download className="cv-button">
          <FaDownload size={18} /> Download CV
        </a>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Skills</h2>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill.name} className="skill-card">
            <div className="skill-icon">{skill.icon}</div>
            <h3>{skill.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
