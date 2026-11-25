/**
 * Resume Data (Single Source of Truth for index.html)
 * ---------------------------------------------------
 * How to edit:
 * - Add, edit, or reorder entries directly in the arrays below.
 * - Use **bold** inside descriptions or bullets for bold text.
 * - Set `hidden: true` on any skill group, internship, or project to hide it without deleting it.
 * - Metric card types supported in both `internships` and `projects`:
 *     1) Stat card:  { type: "stat", label: "Label", value: "50+", sub: "Optional subtitle" }
 *     2) Bar chart:  { type: "bar", label: "SSIM", trend: "up" | "down", color: "rgba(9,132,227,0.8)",
 *                      items: [{ label: "Base", value: 0.179 }, { label: "Opt.", value: 0.291 }] }
 *     3) Donut chart:{ type: "donut", label: "Score", value: 92, max: 100, display: "92%", color: "#00b894" }
 */
window.RESUME_DATA = {
    meta: {
        title: "SunGamePlay | Data Scientist",
        navLogo: "SGP",
        footer: "© 2026 SunGamePlay"
    },

    header: {
        tagline: "Data Science • Artificial Intelligence",
        name: "SunGamePlay",
        socials: [
            {
                label: "GitHub Profile",
                url: "https://github.com/SunGamePlay",
                icon: "fab fa-github"
            }
            // Example: uncomment to add LinkedIn or Email
            // { label: "LinkedIn", url: "https://www.linkedin.com/in/ysamo/", icon: "fab fa-linkedin" },
            // { label: "Email", url: "mailto:example@gmail.com", icon: "fas fa-envelope" }
        ]
    },

    nav: [
        { label: "Home", href: "#home" },
        { label: "Skills", href: "#skills" },
        { label: "Internship", href: "#internship" },
        { label: "Projects", href: "#projects" }
    ],

    skillsSection: {
        id: "skills",
        title: "Technical Arsenal",
        icon: "fas fa-terminal",

        // Top grid cards (reordering won't break icon colors because each card declares its own iconColor)
        categories: [
            {
                title: "Engineering Core",
                icon: "fas fa-code",
                iconColor: "var(--accent-cyan)",
                items: ["Python", "R", "SQL", "Java", "C++", "TypeScript", "JavaScript", "HTML/CSS"]
            },
            {
                title: "Data Science + AI",
                icon: "fas fa-brain",
                iconColor: "var(--accent-pink)",
                items: ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy"]
            },
            {
                title: "Internet Computing",
                icon: "fas fa-chart-pie",
                iconColor: "var(--accent-green)",
                items: ["React.js", "Node.js", "Express", "Spring Boot", "Socket.IO", "Maven", "jQuery"]
            },
            {
                title: "Databases & Tools",
                icon: "fas fa-database",
                iconColor: "var(--accent-purple)",
                items: ["MapDB", "Jupyter", "Tableau", "Matplotlib", "Seaborn", "GGPlot", "Excel"]
            }
        ],

        languages: {
            title: "Languages",
            icon: "fas fa-globe",
            iconColor: "var(--text-main)",
            maxLevel: 5,
            items: [
                { name: "English", level: 5 },
                { name: "Cantonese", level: 5 },
                { name: "Mandarin", level: 5 }
            ]
        },

        // Bottom dual row
        traits: {
            title: "Professional Traits",
            icon: "fas fa-users",
            iconColor: "var(--accent-cyan)",
            items: ["Problem-Solving", "Communication", "Team Collaboration"]
        },

        certifications: {
            title: "Certified",
            icon: "fas fa-certificate",
            iconColor: "var(--accent-yellow)",
            items: [
                "Student SOC Program Foundations"
            ]
        }
    },

    internshipsSection: {
        id: "internship",
        title: "Internship Experiences",
        icon: "fas fa-briefcase",
        items: [
            {
                title: "Data Analyst @ Quest ION IT (HK)",
                tags: ["Python", "pandas", "openpyxl"],
                shortDesc: "Identified bottlenecks in employee data handling and engineered custom automation scripts using **Python, pandas, and openpyxl**. This initiative transformed the validation workflow, replacing repetitive manual entry with precise, automated data cleaning pipelines.",
                metrics: [
                    { type: "stat", label: "Impact Scale", value: "50+", sub: "Staffs" }
                ]
            }
            // Example: add a new internship here (or set hidden: true while drafting)
            // {
            //     hidden: true,
            //     title: "Programme Trainee @ Hong Kong Productivity Council",
            //     tags: ["Python", "n8n", "AI Agents"],
            //     shortDesc: "Engineered an **automated Multi-AI-Agent pipeline** for document processing and translation.",
            //     details: [
            //         "**Bullet point 1** describing your work."
            //     ],
            //     metrics: [
            //         { type: "stat", label: "Status", value: "2026", sub: "Ongoing" }
            //     ]
            // }
        ]
    },

    projectsSection: {
        id: "projects",
        title: "Project Experiences",
        icon: "fas fa-project-diagram",
        items: [
            {
                title: "Optimized Diffusion Inpainting",
                tags: ["Python", "PyTorch"],
                shortDesc: "Engineered a diffusion pipeline as stated in the paper \"TD-Paint: Faster Diffusion Inpainting Through Time-aware Pixel Conditioning\" in Asian Face Image Dataset with **360,000 face images by 2019 individuals**. Modified the pipeline by adding a regulation term to enhance model's performance.",
                metrics: [
                    {
                        type: "bar",
                        label: "SSIM",
                        trend: "up",
                        color: "rgba(9,132,227,0.8)",
                        items: [
                            { label: "Base", value: 0.179 },
                            { label: "Opt.", value: 0.291 }
                        ]
                    },
                    {
                        type: "bar",
                        label: "LPIPS",
                        trend: "down",
                        color: "rgba(214,48,49,0.8)",
                        items: [
                            { label: "Base", value: 0.786 },
                            { label: "Opt.", value: 0.543 }
                        ]
                    }
                ]
            },
            {
                title: "NER Tagging Model",
                tags: ["Python", "Pytorch"],
                shortDesc: "Developed and trained a Named Entity Recognition (NER) model utilizing a dataset of **40,000 labeled sentences**. The model was successfully deployed to predict tags for 5,000 unseen sentences, demonstrating high precision in entity extraction tasks.",
                metrics: [
                    {
                        type: "donut",
                        label: "Project Score",
                        value: 92,
                        max: 100,
                        display: "92%",
                        color: "#00b894"
                    },
                    {
                        type: "stat",
                        label: "Validation F1 Score",
                        value: "0.82"
                    }
                ]
            },
            {
                title: "Multiplayer Game Project",
                tags: ["HTML", "CSS", "JavaScript", "jQuery", "Node.js", "Express", "Socket.IO"],
                shortDesc: "Developed an **Overcooked like cooperative game** that allow the players to prepare meals via preparation of ingredients, cooking and serving.",
                details: [
                    "**Architected a full-stack, real-time cooperative game** for two players using Node.js, Express, and Socket.IO, enabling seamless bi-directional synchronization of game states and low-latency interactions.",
                    "**Engineered a server-side physics engine** utilizing AABB collision detection to centralize game authority.",
                    "**Implemented a secure authentication pipeline** featuring Argon2 cryptographic hashing for password protection and express-session for persistent user state management and auto-login capabilities.",
                    "**Developed a high-performance 2D rendering engine with HTML5 Canvas**, optimizing sprite sheet animations and dynamic UI components to ensure smooth 60 FPS gameplay.",
                    "**Designed a modular entity-component system** to handle complex kitchen mechanics, including state-dependent ingredient merging, chopping boards, and fridge.",
                    "**Created a persistent statistics** using a JSON-based database to track cooperative performance metrics."
                ],
                metrics: [
                    { type: "stat", label: "Server Tick Rate", value: "60Hz", sub: "Real-time Sync" },
                    { type: "stat", label: "Concurrency", value: "2P", sub: "Co-op Engine" }
                ]
            },
            {
                title: "Search Engine Project",
                tags: ["Java", "MapDB", "Spring Boot"],
                shortDesc: "Developed a **full-scale search engine** featuring a custom crawler, an intelligent indexing pipeline, and a web-based query interface.",
                details: [
                    "**Architected a high-performance search engine** from the ground up, featuring a BFS crawler capable of fetching 300 pages in under 100 seconds.",
                    "**Engineered a robust indexing pipeline** utilizing Porter’s Stemming algorithm and stop-word removal to optimize search precision.",
                    "**Implemented advanced retrieval algorithms**, including TF-IDF weighting and Cosine Similarity for document ranking.",
                    "**Enhanced search relevance** by integrating PageRank and title-boosting heuristics.",
                    "**Developed a full-stack web interface** using Spring Boot, enabling users to perform Boolean queries (including negative constraints) and visualize rich metadata such as link structures and keyword frequency.",
                    "**Optimized storage and retrieval** by leveraging MapDB for inverted file indexing with positional support for efficient phrase matching."
                ],
                metrics: [
                    { type: "stat", label: "Index Capacity", value: "300", sub: "Pages Indexed" }
                ]
            },
            {
                title: "PATH: Personalized Academic Track Helper",
                titleLink: {
                    url: "https://github.com/SunGamePlay/HKUST-CTDL1902-2026-Spring-Group4-Portfolio/tree/main",
                    icon: "fab fa-github",
                    title: "View GitHub Repository"
                },
                tags: ["Vibe Coding", "Prompt Engineering", "Socio-Technical Analysis", "Google AI Studio"],
                shortDesc: "Developed **PATH (Personalized Academic Track Helper)**, a rapid-engineered, no-code AI course advisory prototype for **CTDL1902 (2026 Spring)**. Built via **Google AI Studio** using advanced **Prompt Engineering**, the system matches HKUST students with ideal Common Core courses based on personalized, MBTI-style cognitive profiles and ethical considerations.",
                details: [
                    "**Spearheaded vibe-coded prototype development** of a three-layer AI academic advisor (Knowledge Base, User Persona, and Advisory Engine) utilizing rapid-turnaround no-code tools.",
                    "**Formulated context-rich system instructions** in Google AI Studio to precisely define the AI's persona, academic rules, and reasoning constraints.",
                    "**Engineered structured few-shot prompts** to digest qualitative HKUST peer-review sentiments from USTSPACE and synthesize objective recommendations.",
                    "**Designed a 10-question, MBTI-style cognitive survey** to map students' learning preferences into clean JSON schemas for direct system-prompt injection.",
                    "**Conducted comprehensive socio-technical evaluations** on AI limitations, detailing the impacts of Stochastic Parrots, the Meshing Hypothesis, and Digital Redlining."
                ],
                links: [
                    {
                        label: "GitHub Repo",
                        url: "https://github.com/SunGamePlay/HKUST-CTDL1902-2026-Spring-Group4-Portfolio/tree/main",
                        icon: "fab fa-github",
                        title: "View Repository on GitHub"
                    }
                ],
                metrics: [
                    { type: "stat", label: "Course Pool", value: "16", sub: "Common Cores" },
                    { type: "stat", label: "Survey Size", value: "10 Qs", sub: "MBTI-style" }
                ]
            }
        ]
    }
};
