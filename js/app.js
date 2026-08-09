/* ================================================
   Y2K BLOG — APP.JS
   Tab switching, markdown loading, gallery, etc.
   ================================================ */

(function () {
  "use strict";

  /* ---- Apply config ---- */
  function applyConfig() {
    const c = BLOG_CONFIG;
    document.title = `✦ ${c.siteName} ✦`;

    const titleEl = document.querySelector(".title-text");
    if (titleEl) titleEl.textContent = c.siteName;

    const taglineEl = document.querySelector(".site-tagline");
    if (taglineEl) taglineEl.textContent = c.tagline;

    const footerEl = document.getElementById("footer-name");
    if (footerEl) footerEl.textContent = c.footerName;

    // Now playing
    const np = c.nowPlaying;
    const npTrack = document.querySelector(".np-track");
    const npArtist = document.querySelector(".np-artist");
    if (npTrack) npTrack.textContent = np.track;
    if (npArtist) npArtist.textContent = np.artist;

    // Links widget
    const linksEl = document.getElementById("links-widget");
    if (linksEl && c.links.length) {
      linksEl.innerHTML = c.links
        .map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
        .join("");
    }

    // Stats
    const statPosts = document.getElementById("stat-posts");
    const statPhotos = document.getElementById("stat-photos");
    if (statPosts) statPosts.textContent = c.posts.length;
    if (statPhotos) statPhotos.textContent = c.photos.length;
  }

  /* ---- Tab switching ---- */
  function initTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        switchTab(target);
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  function switchTab(tabId) {
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById(`tab-${tabId}`);
    if (pane) pane.classList.add("active");
  }

  /* ---- Markdown fetching ---- */
  async function fetchMarkdown(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      return null;
    }
  }

  function renderMarkdown(md) {
    if (typeof marked === "undefined") return `<p>${md}</p>`;
    // Configure marked for safety
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    return marked.parse(md);
  }

  /* ---- Load home tab content ---- */
  async function loadHome() {
    const el = document.getElementById("home-content");
    if (!el) return;

    // Try to load home.md
    const md = await fetchMarkdown("posts/home.md");
    if (md) {
      el.innerHTML = renderMarkdown(md);
    } else {
      el.innerHTML = `
        <p>✦ welcome!! ✦</p>
        <p>this is your homepage text. create a file at <code>posts/home.md</code> to customise this section!</p>
      `;
    }

    // Recent posts (featured or latest 3)
    await renderRecentPosts();
  }

  /* ---- Recent posts on home ---- */
  async function renderRecentPosts() {
    const container = document.getElementById("recent-posts");
    if (!container) return;

    const posts = BLOG_CONFIG.posts;
    const featured = posts.filter(p => p.featured).length
      ? posts.filter(p => p.featured)
      : posts.slice(0, 3);

    if (!featured.length) return;

    // Header
    const h = document.createElement("div");
    h.className = "tab-header";
    h.textContent = "✦ RECENT POSTS ✦";
    container.appendChild(h);

    for (const post of featured) {
      const card = await buildPostCard(post);
      container.appendChild(card);
    }
  }

  /* ---- Load all posts tab ---- */
  async function loadPosts() {
    const grid = document.getElementById("posts-grid");
    if (!grid) return;

    const posts = [...BLOG_CONFIG.posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!posts.length) {
      grid.innerHTML = `<div class="empty-state"><span>📝</span>no posts yet! add some in config.js</div>`;
      return;
    }

    grid.innerHTML = `<div class="loading">loading posts...</div>`;
    grid.innerHTML = "";

    for (const post of posts) {
      const card = await buildPostCard(post);
      grid.appendChild(card);
    }
  }

  /* ---- Build a post card element ---- */
  async function buildPostCard(post) {
    const card = document.createElement("div");
    card.className = "post-card";

    // Try to grab excerpt from markdown
    let excerpt = "Click to read more...";
    const md = await fetchMarkdown(`posts/${post.file}`);
    if (md) {
      // Strip markdown syntax for excerpt
      const plain = md
        .replace(/^#+\s.+$/gm, "")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_~`>#]/g, "")
        .replace(/\n+/g, " ")
        .trim();
      excerpt = plain.slice(0, 180) + (plain.length > 180 ? "..." : "");
    }

    const tagsHtml = post.tags && post.tags.length
      ? `<div class="post-card-tags">${post.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
      : "";

    card.innerHTML = `
      <div class="post-card-header">
        <span class="post-card-title">${esc(post.title)}</span>
        <span class="post-card-date">${formatDate(post.date)}</span>
      </div>
      <div class="post-card-body">
        <p class="post-card-excerpt">${esc(excerpt)}</p>
        ${tagsHtml}
        <span class="read-more">[ read more → ]</span>
      </div>
    `;

    card.addEventListener("click", () => openPost(post, md));
    return card;
  }

  /* ---- Open single post ---- */
  function openPost(post, md) {
    // Switch to post-view tab (without changing sidebar active state)
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById("tab-post-view");
    if (pane) pane.classList.add("active");

    const content = document.getElementById("post-view-content");
    if (!content) return;

    const tagsHtml = post.tags && post.tags.length
      ? post.tags.map(t => `<span class="tag">${esc(t)}</span>`).join(" ")
      : "";

    const renderedMd = md ? renderMarkdown(md) : "<p>Could not load post content.</p>";

    content.innerHTML = `
      <h1>${esc(post.title)}</h1>
      <div class="post-meta">
        ✦ ${formatDate(post.date)} &nbsp;|&nbsp; ${tagsHtml || "no tags"}
      </div>
      ${renderedMd}
    `;

    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---- Back button ---- */
  function initBackBtn() {
    const btn = document.getElementById("back-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      switchTab("posts");
      // restore active tab button
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.tab === "posts");
      });
    });
  }

  /* ---- Photo gallery ---- */
  function loadPhotos() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    const photos = BLOG_CONFIG.photos;

    if (!photos.length) {
      grid.innerHTML = `<div class="empty-state"><span>📷</span>no photos yet! add some in config.js</div>`;
      return;
    }

    grid.innerHTML = "";

    photos.forEach(photo => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || "";
      img.loading = "lazy";

      const cap = document.createElement("div");
      cap.className = "gallery-caption";
      cap.textContent = photo.caption || "";

      item.appendChild(img);
      item.appendChild(cap);

      item.addEventListener("click", () => openLightbox(photo.src, photo.caption || ""));
      grid.appendChild(item);
    });
  }

  /* ---- Lightbox ---- */
  function initLightbox() {
    // Build lightbox element
    const lb = document.createElement("div");
    lb.id = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");

    const closeBtn = document.createElement("button");
    closeBtn.id = "lightbox-close";
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", "Close lightbox");

    const img = document.createElement("img");
    img.alt = "";

    const caption = document.createElement("div");
    caption.id = "lightbox-caption";

    lb.appendChild(closeBtn);
    lb.appendChild(img);
    lb.appendChild(caption);
    document.body.appendChild(lb);

    closeBtn.addEventListener("click", closeLightbox);
    lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(src, cap) {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.querySelector("img").src = src;
    lb.querySelector("#lightbox-caption").textContent = cap;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (!lb) return;
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---- About page ---- */
  async function loadAbout() {
    const el = document.getElementById("about-content");
    if (!el) return;
    const md = await fetchMarkdown("posts/about.md");
    if (md) {
      el.innerHTML = renderMarkdown(md);
    } else {
      el.innerHTML = `
        <h1>about this site ✦</h1>
        <p>create a file at <code>posts/about.md</code> to fill in this page!</p>
        <p>you can write anything here — who you are, what this blog is about, your interests, etc.</p>
      `;
    }
  }

  /* ---- Helpers ---- */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(str) {
    try {
      return new Date(str + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      });
    } catch {
      return str;
    }
  }

  /* ---- INIT ---- */
  document.addEventListener("DOMContentLoaded", async () => {
    applyConfig();
    initTabs();
    initBackBtn();
    initLightbox();

    // Load all content upfront
    await loadHome();
    await loadPosts();
    loadPhotos();
    await loadAbout();
  });

})();
