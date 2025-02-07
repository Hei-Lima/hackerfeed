document.addEventListener('DOMContentLoaded', function() {
    const storiesContainer = document.getElementById('stories');

    async function fetchTopStories() {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const topStoriesIds = await response.json();
        return topStoriesIds.slice(0, 21);
    }

    async function fetchStory(id) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        return response.json();
    }

    function getDomain(url) {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return "Unknown";
        }
    }
    
    function displayStory(story) {
        const storyElement = document.createElement("div");
        storyElement.className = "card card-lg bg-base-100 p-6 transition duration-200 hover:bg-base-300 border border-base-300 hover:border-base-100 flex flex-col h-full";
    
        const sourceElement = document.createElement("p");
        sourceElement.className = "text-sm text-base mb-1";
        const sourceLink = document.createElement("a");
        sourceLink.href = story.url;
        sourceLink.textContent = getDomain(story.url);
        sourceLink.className = "hover:underline";
        sourceElement.appendChild(sourceLink);
    
        const titleElement = document.createElement("h2");
        titleElement.className = "text-xl font-bold text-base mb-4";
        const titleLink = document.createElement("a");
        titleLink.href = story.url;
        titleLink.textContent = story.title;
        titleLink.className = "hover:underline";
        titleElement.appendChild(titleLink);
    
        const footerElement = document.createElement("div");
        footerElement.className = "mt-auto pt-4 border-t border-base-300 text-sm text-secondary flex justify-between items-center";
    
        const upvoteElement = document.createElement("span");
        upvoteElement.className = "font-semibold";
        upvoteElement.textContent = `${story.score} upvotes`;
    
        const authorElement = document.createElement("span");
        authorElement.textContent = `by ${story.by}`;
    
        const commentsElement = document.createElement("span");
        const commentsLink = document.createElement("a");
        commentsLink.href = `https://news.ycombinator.com/item?id=${story.id}`;
        commentsLink.textContent = `${story.descendants} comments`;
        commentsLink.className = "hover:underline";
        commentsElement.appendChild(commentsLink);
    
        footerElement.appendChild(upvoteElement);
        footerElement.appendChild(commentsElement);
        footerElement.appendChild(authorElement);
    
        storyElement.appendChild(sourceElement);
        storyElement.appendChild(titleElement);
        storyElement.appendChild(footerElement); // Agora sempre no fundo
    
        document.getElementById("stories").appendChild(storyElement);
    }
    
    function createSkeletonCard() {
        const card = document.createElement('div');
        card.className = "card card-lg bg-base-100 p-6 border border-base-300 flex flex-col h-full";
        
        // Source skeleton
        const sourceSkeleton = document.createElement('div');
        sourceSkeleton.className = "skeleton h-4 w-24 mb-1";
        
        // Title skeleton
        const titleSkeleton1 = document.createElement('div');
        titleSkeleton1.className = "skeleton h-8 w-100";
        
        const titleSkeleton2 = document.createElement('div');
        titleSkeleton2.className = "skeleton h-8 w-53 mb-4";
        
        // Footer skeleton
        const footer = document.createElement('div');
        footer.className = "mt-auto pt-4 border-t border-base-300 flex justify-between items-center";
        
        const footerItem1 = document.createElement('div');
        footerItem1.className = "skeleton h-4 w-30";
        
        const footerItem2 = document.createElement('div');
        footerItem2.className = "skeleton h-4 w-20";
        
        const footerItem3 = document.createElement('div');
        footerItem3.className = "skeleton h-4 w-20";
        
        footer.appendChild(footerItem1);
        footer.appendChild(footerItem2);
        footer.appendChild(footerItem3);
        
        card.appendChild(sourceSkeleton);
        card.appendChild(titleSkeleton1);
        card.appendChild(titleSkeleton2);
        card.appendChild(footer);
        
        return card;
    }

    async function displayTopStories() {
        const storiesContainer = document.getElementById("stories");
        storiesContainer.textContent = ''; // Clear safely
        
        // Add skeleton cards
        for (let i = 0; i < 21; i++) {
            storiesContainer.appendChild(createSkeletonCard());
        }
    
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
    
        storiesContainer.textContent = ''; // Clear safely
        topStories.forEach((story) => displayStory(story));
    }
    
    displayTopStories();
    

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
        localStorage.setItem('theme', theme);
    }

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(getPreferredTheme());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    });
});