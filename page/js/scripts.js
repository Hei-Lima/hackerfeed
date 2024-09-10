document.addEventListener('DOMContentLoaded', function() {
    const storiesContainer = document.getElementById('stories');

    // Function to fetch IDs of top stories
    async function fetchTopStories() {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const topStoriesIds = await response.json();
        return topStoriesIds.slice(0, 9); // Get only the top 10 stories
    }

    // Function to fetch details of a story
    async function fetchStory(id) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        return response.json();
    }

    // Function to display a story
    function displayStory(story) {
        const storyElement = document.createElement('div');
        storyElement.className = 'story-container';

        const titleElement = document.createElement('h2');
        const titleLink = document.createElement('a');
        titleLink.href = story.url;
        titleLink.target = '_blank';
        titleLink.textContent = story.title;
        titleElement.appendChild(titleLink);

        const authorElement = document.createElement('p');
        authorElement.textContent = `by ${story.by}`;

        const commentsElement = document.createElement('p');
        commentsElement.textContent = `${story.descendants} comments`;

        storyElement.appendChild(titleElement);
        storyElement.appendChild(authorElement);
        storyElement.appendChild(commentsElement);

        storiesContainer.appendChild(storyElement);
    }

    // Main function to fetch and display stories
    async function displayTopStories() {
        let topStories = JSON.parse(localStorage.getItem('topStories'));
        const cacheTime = localStorage.getItem('cacheTime');
        const now = new Date().getTime();

        // Check if data is in cache and not outdated (1 hour)
        if (!topStories || !cacheTime || now - cacheTime > 3600000) {
            const topStoryIds = await fetchTopStories();
            topStories = [];
            for (const id of topStoryIds) {
                const story = await fetchStory(id);
                topStories.push(story);
            }
            localStorage.setItem('topStories', JSON.stringify(topStories));
            localStorage.setItem('cacheTime', now);
        }

        // Display stories from the cache
        topStories.forEach(story => displayStory(story));
    }

    displayTopStories();

    // Detect system theme and apply it
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const applySystemTheme = () => {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        html.setAttribute('data-theme', systemTheme);
        themeToggle.checked = systemTheme === 'dark';
    };

    applySystemTheme(); // Apply system theme on load

    // Listen for changes in system theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
        }
    });
});