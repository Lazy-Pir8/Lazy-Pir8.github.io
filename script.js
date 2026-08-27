document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const bodyElement = document.body;
    const themeIcon = document.getElementById('theme-icon');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    bodyElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = bodyElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        bodyElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            // Sun icon for dark mode (to switch to light)
            themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        } else {
            // Moon icon for light mode (to switch to dark)
            themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        }
    }

    // Add random rotation to skill tags for the handmade feel
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.style.setProperty('--random', Math.random());
    });
    
    // Fetch detailed repos from GitHub
    fetchDetailedProjects();

    // Doodle Pad Logic
    const canvas = document.getElementById('doodle-pad');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        function resizeCanvas() {
            canvas.width = document.documentElement.scrollWidth;
            canvas.height = document.documentElement.scrollHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        // Add a small delay for initial resize to ensure DOM is fully loaded
        setTimeout(resizeCanvas, 100);

        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('a, button, input, .theme-toggle')) return;
            isDrawing = true;
            lastX = e.pageX;
            lastY = e.pageY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.pageX, e.pageY);
            
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(59, 130, 246, 0.8)';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            lastX = e.pageX;
            lastY = e.pageY;
        });

        document.addEventListener('mouseup', () => isDrawing = false);

        // Fade out drawings over time
        setInterval(() => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'; // Lower opacity = slower fade
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
        }, 100);
    }

    // Fetch detailed repos from GitHub
    fetchDetailedProjects();
});

let isExpanded = false;
let allReposData = [];

async function fetchDetailedProjects() {
    const container = document.getElementById('projects-container');
    const username = 'Lazy-Pir8';
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) return; // Silent fail, keep hardcoded HTML fallback
        
        const allRepos = await response.json();
        
        // Filter out fork and portfolio
        allReposData = allRepos
            .filter(repo => !repo.fork && repo.name !== 'Lazy-Pir8.github.io')
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
            
        if (allReposData.length > 0) {
            renderProjects(8);
            
            if (allReposData.length > 8) {
                const btn = document.getElementById('show-more-btn');
                if (btn) {
                    btn.style.display = 'inline-block';
                    btn.addEventListener('click', () => {
                        isExpanded = !isExpanded;
                        if (isExpanded) {
                            renderProjects(allReposData.length);
                            btn.textContent = 'Show Less';
                        } else {
                            renderProjects(8);
                            btn.textContent = 'Show All Repos';
                            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                }
            }
        }
        
        // Automate Languages & Skills
        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer) {
            // Keep robust manual tools, then add dynamic ones
            const languages = new Set(['Antigravity', 'Docker', 'AWS', 'PostgreSQL', 'Machine Learning']);
            allReposData.forEach(repo => {
                if (repo.language) {
                    languages.add(repo.language);
                }
            });
            
            skillsContainer.innerHTML = '';
            languages.forEach(lang => {
                const span = document.createElement('span');
                span.className = 'skill-tag';
                span.textContent = lang;
                skillsContainer.appendChild(span);
            });
        }
        
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

function renderProjects(limit) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    const reposToDisplay = allReposData.slice(0, limit);
    
    reposToDisplay.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <h3>${repo.name.replace(/-/g, ' ')}</h3>
            <p>${repo.description || 'A piece of software crafted with code and logic.'}</p>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="btn">GitHub</a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn">Live</a>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}
