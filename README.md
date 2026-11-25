# andAgainSoftware

The publisher site for andAgainSoftware: games, tools and websites by Mat Harvey in Perth, Western Australia.

Live at https://mathew-harvey.github.io/andAgainSoftware/

| Page | File | What it is |
| --- | --- | --- |
| Home | `index.html` | The publisher page. All seven projects, laid out like the first issue of a comic. |
| WebFPV | `webfpv/index.html` | The launch page for WebFPV: free in a browser, and on Steam from 27 November 2026 for USD 9.99. |
| Not found | `404.html` | Shown by GitHub Pages for any address that has no page. |

## How it is built

Plain HTML, CSS and JavaScript. There is no build step, no framework and no package to install. To change the site,
edit the files and push. `.nojekyll` tells GitHub Pages to serve the files as they are.

GitHub Pages publishes the `gh-pages` branch, which is kept at the same commit as `main`. After a change, push both:

```
git push origin main
git push origin main:gh-pages
```

To publish straight from `main` instead, open the repository's Settings, then Pages, choose "Deploy from a branch"
with `main` and `/ (root)`, and delete the `gh-pages` branch.

```
index.html              home
webfpv/index.html       the WebFPV page
404.html                the page for a missing address
favicon.png             the browser tab icon
apple-touch-icon.png    the icon a phone uses for a home screen shortcut
assets/css/home.css     styles for the home page
assets/css/webfpv.css   styles for the WebFPV page
assets/css/fonts.css    the three typefaces, served from this site
assets/fonts/           the font files and their licence
assets/js/site.js       the one script, shared by both pages
assets/media/           pictures and video
assets/og-*.jpg         the pictures shown when a page is shared
```

Every path is relative, so the site works from this address, from a domain of its own, or from a folder on a disk.

## Preview it on your own computer

The pages load video, so open them through a local web server instead of straight from the folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/ in a browser.

## The launch switch

WebFPV's Steam launch is one line near the top of `assets/js/site.js`:

```js
var LAUNCH = new Date(2026, 10, 27).getTime();
```

That is midnight on 27 November 2026 in the visitor's own time zone (months count from 0, so 10 is November). Before
that moment the pages show the countdown and "Wishlist on Steam". After it they show "Out now" and "Buy on Steam".
Nothing needs to be published on the day. If Steam unlocks at a different time, change that line.

The wording that changes is in the `TEXT` table just below it, as pairs of before and after. In the HTML, an element
with `data-t="key"` takes its text from that table, an element with `data-when="before"` or `data-when="after"` is
shown in one state only, and `data-cd` marks the countdown digits. The HTML itself holds the wording from before
launch, so the page still reads correctly with JavaScript off.

The page descriptions in each `<head>` (the text a search result or a shared link shows) do not switch by themselves.
They say "on Steam on 27 November", so update them after launch.

## Motion and video

The short clips are silent loops. They play only while they are on screen, and the "Pause motion" button in the top
bar stops all of them and remembers the choice. Motion starts paused for anyone whose system asks for reduced motion
or reduced data. The WebFPV trailer loads nothing until someone presses play, then plays with sound and controls.

New clips should be H.264 MP4 with a poster picture, and written like the existing ones:

```html
<video src="assets/media/name.mp4" poster="assets/media/name-poster.jpg" muted loop playsinline preload="none"></video>
```

## Things to change later

- **A domain of its own.** The `og:url` and `og:image` lines in the `<head>` of both pages hold the full github.io
  address, because shared links need a full address. Change them when the site moves.
- **A mailing list.** The "What's next" card on the home page stands where a sign up form will go once there is a
  mailing list tool to send it to.
- **Contact.** There is no contact address on the site yet.
- **Steam claims.** The "Only on Steam" list on the WebFPV page describes the Steam build. Check it against the
  store page before launch day, and remove anything that is not shipping.

## Credits

- Typefaces: Anton, Barlow and Barlow Condensed, under the SIL Open Font License 1.1 (`assets/fonts/OFL.txt`).
- Pictures and footage come from each project and stay with their owners: West Coast Multirotor Club and Extreme
  Limit Films for theirs, Mat Harvey for the rest.
- The partner and supporter marks on the WebFPV page (`assets/media/partners/`) belong to those companies and are
  shown the way webfpv.org shows them: one colour, with a link to each.
- Steam and the Steam logo are trademarks of Valve Corporation.

This repository has no licence file. The fonts keep their own licence.
