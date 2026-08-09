# ✦ MY LITTLE CORNER — Y2K Blog

A sleek Y2K-aesthetic static blog that runs entirely on GitHub Pages. No build step, no framework — just HTML, CSS, and vanilla JS. Posts are written in Markdown.

---

## 📁 File Structure

```
blog/
├── index.html          ← main site shell
├── .nojekyll           ← tells GitHub Pages not to use Jekyll
├── _config.yml         ← GitHub Pages config
├── css/
│   └── style.css       ← all styles
├── js/
│   ├── config.js       ← ← ← EDIT THIS to add posts, photos, links
│   ├── app.js          ← site logic (tabs, markdown, gallery)
│   └── marked.min.js   ← markdown parser (don't edit)
├── posts/
│   ├── home.md         ← home tab welcome text
│   ├── about.md        ← about page content
│   ├── hello-world.md  ← sample post
│   └── second-post.md  ← sample post
└── images/
    ├── avatar.gif      ← sidebar avatar (optional)
    ├── photo1.jpg      ← gallery photos
    └── ...
```

---

## ✏️ Adding a Post

1. Create a `.md` file in the `/posts/` folder:

```markdown
# my post title

hello!! this is my post content.

## a section

you can use all standard markdown here.

![an image](images/myimage.jpg)
```

2. Register it in `js/config.js`:

```js
posts: [
  {
    file:     "my-new-post.md",   // filename in /posts/
    title:    "my post title",    // shown on the card
    date:     "2025-03-01",       // YYYY-MM-DD
    tags:     ["life", "misc"],   // optional tags
    featured: true,               // show on home tab?
  },
  // ...
],
```

---

## 📷 Adding Photos

1. Drop your image into `/images/`
2. Add it in `js/config.js`:

```js
photos: [
  { src: "images/myphoto.jpg", caption: "my caption" },
  // ...
],
```

---

## 🎨 Customising

All the easy stuff lives in `js/config.js`:

| Setting | What it does |
|---|---|
| `siteName` | The big title in the header |
| `tagline` | Subtitle below the title |
| `nowPlaying` | Track + artist in the sidebar widget |
| `links` | Sidebar link list |
| `posts` | Your blog posts |
| `photos` | Your gallery photos |

For deeper styling, edit `css/style.css`. Colors are CSS variables at the top of the file:

```css
:root {
  --pink:   #FF2D78;
  --blue:   #00CFFF;
  --yellow: #FFE600;
  --purple: #1A0035;
  --lime:   #39FF14;
}
```

---

## 🚀 Deploying to GitHub Pages

1. Push the entire `blog/` folder contents to a GitHub repository (the files should be at the root, not inside a `blog/` subfolder)
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. Your site will be live at `https://yourusername.github.io/reponame`

> **Note:** Because the site fetches `.md` files via JavaScript, you **must** visit it over HTTP(S) — opening `index.html` directly from your filesystem won't load posts (browsers block local file fetches). Use GitHub Pages or a local server (`npx serve .` or `python3 -m http.server`).

---

## 🖼️ Sidebar Avatar

Drop a file named `avatar.gif` (or `.png`, `.jpg`) into `/images/` and update the `src` in `index.html`:

```html
<img src="images/avatar.gif" alt="Avatar" class="avatar" ... />
```

Animated GIFs work great for that authentic neocities feel ✦

---

made with ♥
