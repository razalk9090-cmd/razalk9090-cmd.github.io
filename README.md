# Razal K — Portfolio

Personal portfolio of Razal K: marketing & sales, AI automation and entrepreneurship.

A one-page site built with plain HTML, CSS and JavaScript. There is no framework and no build step.

```
index.html               page content
css/style.css            all styling (colours and fonts are in :root at the top)
js/main.js               menu, scroll effects, skills strip, email links, print CV
assets/
  profile-cutout.webp    portrait with the background removed (hero)
  profile.jpg            portrait used for link previews
  favicon.svg            browser tab icon
  logo.svg               logo (badge + wordmark)
```

## Run locally

Open the folder in VS Code and use the **Live Server** extension (right-click `index.html` → **Open with Live Server**).

## Deploy

The site is hosted with GitHub Pages. Push to the `main` branch and the live site updates within a minute or two.

## Edit

- **Text**: everything is in `index.html`, section by section (Hero, Work, Skills, Education, Resume, Contact).
- **Colours**: change the variables at the top of `css/style.css` (`--bg` is the background, `--accent` the olive green).
- **Photo**: replace `assets/profile-cutout.webp` with a portrait that has a transparent background.
