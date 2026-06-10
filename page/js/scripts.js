let refreshIntervalId = null;

function getStoredFetchLimit() {
	const rawFetchLimit = localStorage.getItem("fetchLimit");
	const parsedFetchLimit = parseInt(rawFetchLimit, 10);
	return !isNaN(parsedFetchLimit) && parsedFetchLimit > 0 && parsedFetchLimit <= 50 ? parsedFetchLimit : 21;
}

let FETCHLIMIT = getStoredFetchLimit();
const searchInput = document.getElementById("searchInput");

document.addEventListener("DOMContentLoaded", async function () {
	async function updateSearchEngines() {
		try {
			if (typeof browser !== "undefined" && browser.search) {
				// Firefox
				const results = await browser.search.get();
				const defaultEngine = results.find((engine) => engine.isDefault);

				if (defaultEngine) {
					console.log(`Default search engine: ${defaultEngine.name}`);
					searchInput.placeholder = `Search with ${defaultEngine.name}`;
					localStorage.setItem(
						"defaultSearchEngine",
						JSON.stringify(defaultEngine)
					);
					localStorage.setItem("searchEngineUpdateTime", new Date().getTime());
				}
			} else if (typeof chrome !== "undefined" && chrome.search) {
				// Chrome - simple search placeholder
				searchInput.placeholder = "Search";
				localStorage.setItem(
					"defaultSearchEngine",
					JSON.stringify({ name: "" })
				);
				localStorage.setItem("searchEngineUpdateTime", new Date().getTime());
			} else {
				// Fallback
				searchInput.placeholder = "Search";
				localStorage.setItem(
					"defaultSearchEngine",
					JSON.stringify({ name: "" })
				);
				localStorage.setItem("searchEngineUpdateTime", new Date().getTime());
			}
		} catch (error) {
			console.error("Failed to get search engines:", error);
			searchInput.placeholder = "Search";
		}
	}

	// Constants for time intervals
	const DEFAULT_INTERVAL = 15;

	// Get interval from localStorage with validation
	function getStoredInterval() {
		const stored = localStorage.getItem("saveTime");
		const parsed = parseInt(stored, 10);
		return !isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_INTERVAL;
	}

	// Check if we need to update search engines
	const lastUpdate = localStorage.getItem("searchEngineUpdateTime");
	const now = new Date().getTime();

	if (!lastUpdate || now - parseInt(lastUpdate, 10) > 30 * 60 * 1000) {
		await updateSearchEngines();
	} else {
		// Use cached engine only for Firefox
		const cachedEngine = JSON.parse(
			localStorage.getItem("defaultSearchEngine")
		);
		if (cachedEngine && cachedEngine.name && typeof browser !== "undefined") {
			searchInput.placeholder = `Search with ${cachedEngine.name}`;
		} else {
			searchInput.placeholder = "Search";
		}
	}

	async function fetchTopStories() {
		const response = await fetch(
			"https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
		);
		if (!response.ok) throw new Error(`HTTP error ${response.status}`);
		const topStoriesIds = await response.json();
		return topStoriesIds.slice(0, FETCHLIMIT);
	}

	async function fetchStory(id) {
		try {
			const response = await fetch(
				`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
			);
			if (!response.ok) throw new Error(`HTTP error ${response.status}`);
			return await response.json();
		} catch (error) {
			console.error(`Failed to fetch story ${id}:`, error);
			return null;
		}
	}

	function getDomain(url) {
		try {
			return new URL(url).hostname.replace("www.", "");
		} catch {
			return "Unknown";
		}
	}

	function displayStory(story) {
		if (!story) return;

		const storyElement = document.createElement("div");
		storyElement.className =
			"card card-lg bg-base-100 p-6 transition-all duration-300 border border-base-300 hover:border-primary hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl flex flex-col h-full";

		const hasUrl = !!story.url;
		const storyUrl = hasUrl ? story.url : `https://news.ycombinator.com/item?id=${story.id}`;
		const domainName = hasUrl ? getDomain(story.url) : "Hacker News";

		const sourceElement = document.createElement("p");
		sourceElement.className = "text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5 select-none";
		const sourceLink = document.createElement("a");
		sourceLink.href = storyUrl;
		sourceLink.textContent = domainName;
		sourceLink.className = "hover:underline";
		sourceElement.appendChild(sourceLink);

		const titleElement = document.createElement("h2");
		titleElement.className = "text-xl font-bold text-base-content mb-4 line-clamp-3 leading-snug";
		const titleLink = document.createElement("a");
		titleLink.href = storyUrl;
		titleLink.textContent = story.title;
		titleLink.className = "hover:text-primary transition-colors duration-200";
		titleElement.appendChild(titleLink);

		const footerElement = document.createElement("div");
		footerElement.className =
			"mt-auto pt-4 border-t border-base-300 text-xs text-secondary flex justify-between items-center gap-2 flex-wrap";

		const upvoteElement = document.createElement("div");
		upvoteElement.className = "flex items-center gap-1.5 text-secondary font-medium select-none";
		upvoteElement.innerHTML = `
			<svg class="w-3.5 h-3.5 text-primary fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M4 14h6v8h4v-8h6L12 4 4 14z"/>
			</svg>
			<span>${story.score || 0}</span>
		`;

		const authorElement = document.createElement("div");
		authorElement.className = "text-secondary/70 flex items-center gap-1 select-none font-medium";
		authorElement.innerHTML = `
			<svg class="w-3.5 h-3.5 opacity-60 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
			</svg>
			<span>by ${story.by || "unknown"}</span>
		`;

		const commentsElement = document.createElement("div");
		commentsElement.className = "flex items-center gap-1.5 font-medium";
		const commentsLink = document.createElement("a");
		commentsLink.href = `https://news.ycombinator.com/item?id=${story.id}`;
		commentsLink.className = "hover:text-primary transition-colors duration-200 flex items-center gap-1.5 text-secondary";
		commentsLink.innerHTML = `
			<svg class="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
			</svg>
			<span>${story.descendants || 0}</span>
		`;
		commentsElement.appendChild(commentsLink);

		footerElement.appendChild(upvoteElement);
		footerElement.appendChild(commentsElement);
		footerElement.appendChild(authorElement);

		storyElement.appendChild(sourceElement);
		storyElement.appendChild(titleElement);
		storyElement.appendChild(footerElement);

		document.getElementById("stories").appendChild(storyElement);
	}

	function createSkeletonCard() {
		const card = document.createElement("div");
		card.className =
			"card card-lg bg-base-100 p-6 border border-base-300 flex flex-col h-full";

		// Source skeleton
		const sourceSkeleton = document.createElement("div");
		sourceSkeleton.className = "skeleton h-4 w-24 mb-1";

		// Title skeleton
		const titleSkeleton1 = document.createElement("div");
		titleSkeleton1.className = "skeleton h-8 w-100";

		const titleSkeleton2 = document.createElement("div");
		titleSkeleton2.className = "skeleton h-8 w-53 mb-4";

		// Footer skeleton
		const footer = document.createElement("div");
		footer.className =
			"mt-auto pt-4 border-t border-base-300 flex justify-between items-center";

		const footerItem1 = document.createElement("div");
		footerItem1.className = "skeleton h-4 w-30";

		const footerItem2 = document.createElement("div");
		footerItem2.className = "skeleton h-4 w-20";

		const footerItem3 = document.createElement("div");
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
		storiesContainer.textContent = "";

		// Add skeleton cards
		for (let i = 0; i < FETCHLIMIT; i++) {
			storiesContainer.appendChild(createSkeletonCard());
		}

		let topStories = [];
		try {
			topStories = JSON.parse(localStorage.getItem("topStories")) || [];
		} catch (e) {
			console.error("Failed to parse cached top stories:", e);
		}

		const cacheTime = localStorage.getItem("cacheTime");
		const now = new Date().getTime();
		const fetchInterval = getStoredInterval();

		if (
			!topStories ||
			topStories.length === 0 ||
			!cacheTime ||
			now - cacheTime > fetchInterval * 60 * 1000
		) {
			try {
				const topStoryIds = await fetchTopStories();
				
				// Concurrently fetch all stories fresh from the API
				const storyPromises = topStoryIds.map((id) => fetchStory(id));
				
				const fetchedStories = await Promise.all(storyPromises);
				const newTopStories = fetchedStories.filter(story => story !== null);
				
				topStories = newTopStories;
				localStorage.setItem("topStories", JSON.stringify(newTopStories));
				localStorage.setItem("cacheTime", now);
			} catch (error) {
				console.error("Failed to load top stories from API:", error);
			}
		}

		storiesContainer.textContent = "";
		if (topStories && topStories.length > 0) {
			topStories.forEach((story) => {
				if (story) {
					displayStory(story);
				}
			});
		} else {
			const errorMsg = document.createElement("div");
			errorMsg.className = "col-span-full text-center text-secondary py-10";
			errorMsg.textContent = "Could not load stories. Please check your internet connection.";
			storiesContainer.appendChild(errorMsg);
		}
	}

	function startStoriesRefresh() {
		if (refreshIntervalId) {
			clearInterval(refreshIntervalId);
		}
		const intervalMinutes = getStoredInterval();
		refreshIntervalId = setInterval(displayTopStories, intervalMinutes * 60 * 1000);
	}

	// Dynamic listener for settings changes
	window.addEventListener("settingsUpdated", () => {
		FETCHLIMIT = getStoredFetchLimit();
		startStoriesRefresh();
		displayTopStories();
	});

	displayTopStories();
	startStoriesRefresh();
});

// Handle search form submission
document.getElementById("searchForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const query = searchInput.value;

	try {
		if (typeof chrome !== "undefined" && chrome.search) {
			// Chrome
			await chrome.search.query({
				text: query,
				disposition: "CURRENT_TAB", // Forces search in current tab
			});
		} else if (typeof browser !== "undefined" && browser.search) {
			// Firefox
			await browser.search.search({
				query: query,
			});
		} else {
			// Fallback
			window.location.href = `https://google.com/search?q=${encodeURIComponent(
				query
			)}`;
		}
	} catch (error) {
		console.error("Search failed:", error);
		window.location.href = `https://google.com/search?q=${encodeURIComponent(
			query
		)}`;
	}
});

