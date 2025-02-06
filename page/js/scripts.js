document.addEventListener('DOMContentLoaded', function() {
    const storiesContainer = document.getElementById('stories');

    // Function to fetch IDs of top stories
    async function fetchTopStories() {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const topStoriesIds = await response.json();
        return topStoriesIds.slice(0, 12); // Get only the top 10 stories
    }

    // Function to fetch details of a story
    async function fetchStory(id) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        return response.json();
    }

    // Function to display a story
    function getDomain(url) {
        try {
            return new URL(url).hostname.replace("www.", ""); // Remove 'www.'
        } catch {
            return "Unknown"; // Caso o link seja inválido
        }
    }
    
    function displayStory(story) {
        const storyElement = document.createElement("div");
        storyElement.className = "card card-lg bg-base-100 rounded-lg p-8 transition duration-200 hover:bg-gray-800 hover:border-gray-600";
    
        // Title (larger)
        const titleElement = document.createElement("h2");
        titleElement.className = "text-4xl font-bold text-gray-200 mb-3";
        const titleLink = document.createElement("a");
        titleLink.href = story.url;
        titleLink.target = "_blank";
        titleLink.textContent = story.title;
        titleLink.className = "hover:underline text-gray-100";
        titleElement.appendChild(titleLink);
    
        // Source link
        const sourceElement = document.createElement("p");
        sourceElement.className = "text-base text-gray-400 mb-3";
        const sourceLink = document.createElement("a");
        sourceLink.href = story.url;
        sourceLink.target = "_blank";
        sourceLink.textContent = getDomain(story.url);
        sourceLink.className = "hover:underline";
        sourceElement.appendChild(sourceLink);
    
        // Author and comments
        const metaElement = document.createElement("p");
        metaElement.className = "text-base text-gray-500";
        const commentsLink = document.createElement("a");
        commentsLink.href = `https://news.ycombinator.com/item?id=${story.id}`;
        commentsLink.target = "_blank";
        commentsLink.textContent = `${story.descendants} comments`;
        commentsLink.className = "hover:underline text-gray-400";
        metaElement.innerHTML = `by ${story.by} • `;
        metaElement.appendChild(commentsLink);
    
        storyElement.appendChild(titleElement);
        storyElement.appendChild(sourceElement);
        storyElement.appendChild(metaElement);
    
        document.getElementById("stories").appendChild(storyElement);
    }
    
    // Função principal para buscar e exibir histórias
    async function displayTopStories() {
        let topStories = JSON.parse(localStorage.getItem("topStories"));
        const cacheTime = localStorage.getItem("cacheTime");
        const now = new Date().getTime();
    
        if (!topStories || !cacheTime || now - cacheTime > 0) {
            const topStoryIds = await fetchTopStories();
            topStories = [];
            for (const id of topStoryIds) {
                const story = await fetchStory(id);
                topStories.push(story);
            }
            localStorage.setItem("topStories", JSON.stringify(topStories));
            localStorage.setItem("cacheTime", now);
        }
    
        document.getElementById("stories").innerHTML = "";
        topStories.forEach((story) => displayStory(story));
    }
    
    displayTopStories();
    
    


    // Detect system theme and apply it
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    // Function to apply theme
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
        localStorage.setItem('theme', theme);
    }

    // Function to get user's preferred theme
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply user's preferred theme on load
    applyTheme(getPreferredTheme());

    // Listen for changes in system theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    // Theme toggle functionality
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    });
});