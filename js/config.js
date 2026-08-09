/* ================================================
   BLOG CONFIG — Edit this file to customise your site!
   ================================================ */

const BLOG_CONFIG = {

  /* ---- SITE INFO ---- */
  siteName:   "MY LITTLE CORNER",
  tagline:    "// thoughts, photos & things i like //",
  footerName: "MY LITTLE CORNER",

  /* ---- NOW PLAYING WIDGET ---- */
  nowPlaying: {
    track:  "Song Title",
    artist: "Artist Name"
  },

  /* ---- SIDEBAR LINKS ---- */
  links: [
    { label: "GitHub",    url: "https://github.com/yourusername" },
    { label: "Neocities", url: "https://neocities.org" },
    { label: "Tumblr",    url: "https://tumblr.com" },
    { label: "Last.fm",   url: "https://last.fm" },
  ],

  /* ---- POSTS ----
     Add each post as an object below.
     The 'file' path is relative to the /posts/ folder.
     Tags are optional.
     featured: true → shows on the home tab.
  ---- */
  posts: [
    {
      file:     "hello-world.md",
      title:    "hello world ♥",
      date:     "2025-01-01",
      tags:     ["intro", "life"],
      featured: true,
    },
    {
      file:     "second-post.md",
      title:    "my second post",
      date:     "2025-01-15",
      tags:     ["thoughts"],
      featured: false,
    },
    // Add more posts here ↓
    // {
    //   file:     "my-new-post.md",
    //   title:    "my new post title",
    //   date:     "2025-02-01",
    //   tags:     ["life", "misc"],
    //   featured: false,
    // },
  ],

  /* ---- PHOTOS ----
     Put your images in the /images/ folder
     then list them here.
     caption is optional.
  ---- */
  photos: [
    { src: "images/photo1.jpg", caption: "a caption here" },
    { src: "images/photo2.jpg", caption: "another photo" },
    { src: "images/photo3.jpg", caption: "pretty things" },
    // Add more photos here ↓
    // { src: "images/myphoto.jpg", caption: "my caption" },
  ],

};
