// ==UserScript==
// @name     Enhanced Dark Mode - Search Engines Special
// @match    *://*.bing.com/*
// @match    *://*.google.com/*
// @match    *://*.baidu.com/*
// @match    *://*.bilibili.com/*
// @match    *://*.youtube.com/*
// @version  1.3
// @description Provides enhanced dark mode coverage for search engines and video sites, protecting video areas from turning black
// ==/UserScript==

(function() {
    // Create style
    const style = document.createElement('style');
    style.textContent = `
        /* Global dark mode - stronger override */
        body.dark-mode,
        body.dark-mode > *,
        body.dark-mode div:not([class*="player"]):not([class*="video"]):not([class*="bilibili-player"]):not([class*="bpx-player"]):not([id*="player"]):not([id*="video"]),
        body.dark-mode p, 
        body.dark-mode span:not([class*="player"]):not([class*="video"]),
        body.dark-mode li,
        body.dark-mode input, 
        body.dark-mode button:not([class*="player"]):not([class*="video"]),
        body.dark-mode header,
        body.dark-mode nav,
        body.dark-mode footer,
        body.dark-mode section:not([class*="player"]):not([class*="video"]),
        body.dark-mode article,
        body.dark-mode aside,
        body.dark-mode form,
        body.dark-mode canvas:not([class*="player"]):not([class*="video"]) {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
            border-color: #333 !important;
            box-shadow: none !important;
        }
        
        /* Protect video player areas - higher priority */
        body.dark-mode video,
        body.dark-mode iframe[src*="youtube"],
        body.dark-mode iframe[src*="bilibili"],
        body.dark-mode iframe[src*="video"],
        body.dark-mode iframe[src*="player"],
        body.dark-mode [class*="player"],
        body.dark-mode [class*="Player"],
        body.dark-mode [class*="PLAYER"],
        body.dark-mode [class*="video"],
        body.dark-mode [class*="Video"],
        body.dark-mode [class*="VIDEO"],
        body.dark-mode [class*="video-container"],
        body.dark-mode [class*="bilibili-player"],
        body.dark-mode [class*="bpx-player"],
        body.dark-mode [class*="bpx-player-container"],
        body.dark-mode [class*="bpx-player-primary"],
        body.dark-mode [class*="bpx-player-video-wrap"],
        body.dark-mode [id*="player"],
        body.dark-mode [id*="Player"],
        body.dark-mode [id*="PLAYER"],
        body.dark-mode [id*="video"],
        body.dark-mode [id*="Video"],
        body.dark-mode [id*="VIDEO"],
        body.dark-mode [class*="ytp-"],
        body.dark-mode .video-container,
        body.dark-mode .player-container,
        body.dark-mode .video-player,
        body.dark-mode .html5-video-container,
        body.dark-mode .html5-video-player,
        body.dark-mode #movie_player,
        body.dark-mode #player,
        body.dark-mode #ytd-player,
        body.dark-mode #player-container,
        body.dark-mode #bilibili-player,
        body.dark-mode #bofqi,
        body.dark-mode #bilibili-player-video-wrap,
        body.dark-mode #playerWrap,
        body.dark-mode #bilibiliPlayer {
            filter: none !important;
            background-color: transparent !important;
            border-color: initial !important;
            color: initial !important;
            box-shadow: initial !important;
        }
        
        /* Don't apply dark mode to main content areas in video sites */
        body.dark-mode.bilibili-video-page #app,
        body.dark-mode.bilibili-video-page .v-wrap,
        body.dark-mode.bilibili-video-page #bofqi,
        body.dark-mode.youtube-video-page #content,
        body.dark-mode.youtube-video-page #page-manager,
        body.dark-mode.youtube-video-page #player-container {
            background-color: initial !important;
            color: initial !important;
            filter: none !important;
        }
        
        /* Search results and list items */
        body.dark-mode .b_algo, 
        body.dark-mode .b_ans,
        body.dark-mode #b_results > li,
        body.dark-mode .b_searchbox {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }
        
        /* Links and headings */
        body.dark-mode a:not([class*="player"]):not([class*="video"]),
        body.dark-mode h1:not([class*="player"]):not([class*="video"]), 
        body.dark-mode h2:not([class*="player"]):not([class*="video"]), 
        body.dark-mode h3:not([class*="player"]):not([class*="video"]) {
            color: #5c9ae4 !important;
        }
        
        body.dark-mode a:visited:not([class*="player"]):not([class*="video"]) {
            color: #bb86fc !important;
        }
        
        /* Special areas */
        body.dark-mode .b_searchboxForm,
        body.dark-mode #b_header {
            background-color: #1a1a1a !important;
        }
        
        /* Search box */
        body.dark-mode input[type="search"],
        body.dark-mode input[type="text"] {
            background-color: #333 !important;
            color: #fff !important;
        }
        
        /* Buttons */
        body.dark-mode button:not([class*="player"]):not([class*="video"]),
        body.dark-mode input[type="submit"] {
            background-color: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
        }
        
        /* Slightly darken images, but exclude video thumbnails and video-related images */
        body.dark-mode img:not([class*="video"]):not([src*="video"]):not([src*="play"]):not([class*="player"]):not([src*="bili"]):not([class*="bili"]):not([src*="youtube"]):not([class*="yt"]) {
            filter: brightness(0.85) !important;
        }
        
        /* Bilibili-specific rules */
        body.dark-mode .bilibili-player,
        body.dark-mode .bilibili-player-video,
        body.dark-mode .bilibili-player-video-wrap,
        body.dark-mode .bilibili-player-video-control,
        body.dark-mode .bpx-player,
        body.dark-mode .bpx-player-container,
        body.dark-mode .bpx-player-video-area,
        body.dark-mode #bilibili-player,
        body.dark-mode #bilibiliPlayer,
        body.dark-mode #bofqi,
        body.dark-mode #playerWrap {
            background-color: transparent !important;
            filter: none !important;
            color: initial !important;
        }
        
        /* YouTube-specific rules */
        body.dark-mode .html5-video-player,
        body.dark-mode .ytp-chrome-bottom,
        body.dark-mode .ytp-chrome-controls,
        body.dark-mode #movie_player,
        body.dark-mode #player,
        body.dark-mode .ytd-player,
        body.dark-mode #ytd-player,
        body.dark-mode .ytd-page-manager,
        body.dark-mode #page-manager {
            background-color: transparent !important;
            filter: none !important;
            color: initial !important;
        }
        
        /* Toggle button style */
        #dark-mode-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        #dark-mode-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
        }
        
        #dark-mode-toggle svg {
            width: 26px;
            height: 26px;
        }
        
        /* Dark mode button style */
        body.dark-mode #dark-mode-toggle {
            background-color: #333333;
        }
        
        .moon-icon {
            display: block;
        }
        
        .sun-icon {
            display: none;
        }
        
        body.dark-mode .moon-icon {
            display: none;
        }
        
        body.dark-mode .sun-icon {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // Create toggle button
    const button = document.createElement('button');
    button.id = 'dark-mode-toggle';
    button.title = 'Toggle Dark/Light Mode';
    button.innerHTML = `
        <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `;
    
    // Add toggle logic
    button.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save user preference to session storage
        try {
            const isDarkMode = document.body.classList.contains('dark-mode');
            sessionStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
        } catch (e) {
            console.error('Unable to save dark mode preference:', e);
        }
    });
    
    // Add button to page
    document.body.appendChild(button);
    
    // Check previous preference setting
    try {
        const savedDarkMode = sessionStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    } catch (e) {
        console.error('Unable to read dark mode preference:', e);
    }
    
    // Special handling for specific websites
    const hostname = window.location.hostname;
    
    // Video website special handling
    if (hostname.includes('bilibili.com')) {
        // Add specific class name for Bilibili to optimize video page
        if (window.location.pathname.includes('/video/')) {
            document.body.classList.add('bilibili-video-page');
        }
        // Adjust button position
        button.style.top = '70px';
        
        // Enhanced protection for Bilibili video area
        const protectBilibiliVideo = () => {
            const playerElements = document.querySelectorAll('[class*="player"], [class*="bpx-player"], #bofqi, #bilibili-player');
            playerElements.forEach(el => {
                el.style.backgroundColor = 'transparent';
                el.style.filter = 'none';
                el.style.color = 'initial';
            });
        };
        
        setInterval(protectBilibiliVideo, 1000); // Continuous monitoring protection
    }
    
    if (hostname.includes('youtube.com')) {
        // Add specific class name for YouTube
        if (window.location.pathname.includes('/watch')) {
            document.body.classList.add('youtube-video-page');
        }
        // Adjust button position
        button.style.top = '70px';
        
        // Enhanced protection for YouTube video area
        const protectYoutubeVideo = () => {
            const playerElements = document.querySelectorAll('.html5-video-player, #movie_player, #player, [class*="ytp-"]');
            playerElements.forEach(el => {
                el.style.backgroundColor = 'transparent';
                el.style.filter = 'none';
                el.style.color = 'initial';
            });
        };
        
        setInterval(protectYoutubeVideo, 1000); // Continuous monitoring protection
    }
    
    // Force check and apply - solve dynamic loading content issues
    const forceCheck = () => {
        if (document.body.classList.contains('dark-mode')) {
            // Find all iframes and try to process, excluding video iframes
            document.querySelectorAll('iframe:not([src*="video"]):not([src*="player"]):not([src*="youtube"]):not([src*="bilibili"])').forEach(iframe => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc.body) {
                        iframeDoc.body.classList.add('dark-mode');
                    }
                } catch(e) {
                    // Cross-origin iframe cannot be accessed
                }
            });
            
            // Force protect all video elements
            const videoElements = document.querySelectorAll('video, [class*="player"], [class*="video"], [id*="player"], [id*="video"]');
            videoElements.forEach(el => {
                el.style.filter = 'none !important';
                el.style.backgroundColor = 'transparent !important';
                el.style.color = 'initial !important';
            });
        }
    };
    
    // Check after page load and content changes
    window.addEventListener('load', forceCheck);
    window.addEventListener('DOMContentLoaded', forceCheck);
    
    // Create observer to monitor DOM changes
    const observer = new MutationObserver(forceCheck);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Periodically force protect video elements (for dynamically loaded videos)
    setInterval(forceCheck, 2000);
})(); 