let FETCHLIMIT = Number(localStorage.getItem("fetchLimit")) || 21;
console.log(FETCHLIMIT);
const searchInput = document.getElementById('searchInput');
document.addEventListener('DOMContentLoaded', async function() {
    
    async function updateSearchEngines() {
        try {
            if (typeof browser !== 'undefined' && browser.search) {
                // Firefox
                const results = await browser.search.get();
                const defaultEngine = results.find(engine => engine.isDefault);
                
                if (defaultEngine) {
                    console.log(`Default search engine: ${defaultEngine.name}`);
                    searchInput.placeholder = `Search with ${defaultEngine.name}`;
                    localStorage.setItem('defaultSearchEngine', JSON.stringify(defaultEngine));
                    localStorage.setItem('searchEngineUpdateTime', new Date().getTime());
                }
            } else if (typeof chrome !== 'undefined' && chrome.search) {
                // Chrome - simple search placeholder
                searchInput.placeholder = 'Search';
                localStorage.setItem('defaultSearchEngine', JSON.stringify({ name: '' }));
                localStorage.setItem('searchEngineUpdateTime', new Date().getTime());
            } else {
                // Fallback
                searchInput.placeholder = 'Search';
                localStorage.setItem('defaultSearchEngine', JSON.stringify({ name: '' }));
                localStorage.setItem('searchEngineUpdateTime', new Date().getTime());
            }
        } catch (error) {
            console.error('Failed to get search engines:', error);
            searchInput.placeholder = 'Search';
        }
    }

    // Constants for time intervals
    const DEFAULT_INTERVAL = 15;

    // Get interval from localStorage with validation
    function getStoredInterval() {
        const stored = localStorage.getItem("saveTime");
        const parsed = parseInt(stored, 10);
        return (!isNaN(parsed) && parsed > 0) ? parsed : DEFAULT_INTERVAL;
    }

    let intervalMinutes = getStoredInterval();
    
    // Check if we need to update search engines
    const lastUpdate = localStorage.getItem('searchEngineUpdateTime');
    const now = new Date().getTime();
    
    if (!lastUpdate || now - parseInt(lastUpdate) > 30 * 60 * 1000) {
        await updateSearchEngines();
    } else {
        // Use cached engine only for Firefox
        const cachedEngine = JSON.parse(localStorage.getItem('defaultSearchEngine'));
        if (cachedEngine && cachedEngine.name && typeof browser !== 'undefined') {
            searchInput.placeholder = `Search with ${cachedEngine.name}`;
        } else {
            searchInput.placeholder = 'Search';
        }
    }


    setInterval(updateSearchEngines, parseInt(intervalMinutes, 10) * 60 * 1000);

    const storiesContainer = document.getElementById('stories');

    async function fetchTopStories() {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
        const topStoriesIds = await response.json();
        return topStoriesIds.slice(0, FETCHLIMIT);
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
        storyElement.className = "card card-lg bg-base-100 p-6 transition duration-200 border border-base-300 hover:border-primary flex flex-col h-full";
    
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
        storiesContainer.textContent = '';
        
        // Add skeleton cards
        for (let i = 0; i < FETCHLIMIT; i++) {
            storiesContainer.appendChild(createSkeletonCard());
        }
    
        let topStories = JSON.parse(localStorage.getItem("topStories"));
        const cacheTime = localStorage.getItem("cacheTime");
        const now = new Date().getTime();
        
        let fetchInterval = localStorage.getItem("saveTime") ??  15;

        if (!topStories || !cacheTime || now - cacheTime > fetchInterval * 60 * 1000) { 
            const topStoryIds = await fetchTopStories();
            topStories = [];
            for (const id of topStoryIds) {
            const story = await fetchStory(id);
            topStories.push(story);
            }
            localStorage.setItem("topStories", JSON.stringify(topStories));
            localStorage.setItem("cacheTime", now);
        }
    
        storiesContainer.textContent = ''; 
        topStories.forEach((story) => displayStory(story));
    }
    
    displayTopStories();
});

// Handle search form submission
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value;
    
    try {
        if (typeof chrome !== 'undefined' && chrome.search) {
            // Chrome
            await chrome.search.query({
                text: query,
                disposition: 'CURRENT_TAB'  // Forces search in current tab
            });
        } else if (typeof browser !== 'undefined' && browser.search) {
            // Firefox
            await browser.search.search({
                query: query
            });
        } else {
            // Fallback
            window.location.href = `https://google.com/search?q=${encodeURIComponent(query)}`;
        }
    } catch (error) {
        console.error('Search failed:', error);
        window.location.href = `https://google.com/search?q=${encodeURIComponent(query)}`;
    }
});