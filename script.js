// GitHub API integration and micro-animations

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display projects from GitHub
    fetchProjects();

    // Intersection Observer for scroll animations
    setupScrollAnimations();
});

async function fetchProjects() {
    const container = document.getElementById('projects-container');
    const username = 'Lazy-Pir8';
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const allRepos = await response.json();
        
        // Filter out the portfolio repo itself and forks
        const reposToDisplay = allRepos
            .filter(repo => !repo.fork && repo.name !== 'Lazy-Pir8.github.io' && repo.description)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6);
            
        // If we don't have enough with descriptions, just get the first 6 non-forks
        const displayList = reposToDisplay.length > 0 ? reposToDisplay : allRepos.filter(r => !r.fork && r.name !== 'Lazy-Pir8.github.io').slice(0, 6);
        
        container.innerHTML = '';
        
        displayList.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Format language
            const langHtml = repo.language ? `<li>${repo.language}</li>` : '<li>Code</li>';
            
            card.innerHTML = `
                <div class="project-header">
                    <div class="folder-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" aria-label="GitHub Link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                        ${repo.homepage ? `
                        <a href="${repo.homepage}" target="_blank" aria-label="Live Demo" style="margin-left: 10px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>` : ''}
                    </div>
                </div>
                <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
                <p class="project-description">${repo.description || 'A cool project by Harsh Sahu.'}</p>
                <ul class="project-tech">
                    ${langHtml}
                </ul>
            `;
            
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        container.innerHTML = '<p>Failed to load projects. Please visit my GitHub profile directly.</p>';
    }
}

function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}
