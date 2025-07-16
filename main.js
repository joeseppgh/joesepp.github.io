import { posts } from "./posts.js";

/* Utility: extract YYYY-MM-DD, title-slug from file name */
function parseFilename(filename) {
  const [, date, slug] = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/) || [];
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  return { date, title };
}

/* Fetch first meaningful line that starts with '#' for the description.
   Also look for a line starting with 'tag:'. */
async function getMeta(file) {
  const res = await fetch(`posts/${file}`);
  const text = await res.text();
  const lines = text.split("\n");

  const descLine = lines.find((l) => l.trim().startsWith("#")) || "";
  const description = descLine.replace(/^#+\s*/, "");

  const tagLine =
    lines.find((l) => l.toLowerCase().startsWith("tag:")) || "tag: misc";
  const tag = tagLine.split(":")[1].trim();

  return { description, tag };
}

/* Build a card and inject it */
async function makeCard(file) {
  const { date, title } = parseFilename(file);
  const { description, tag } = await getMeta(file);

  const card = document.createElement("article");
  card.className = "blog-post";
  card.innerHTML = `
    <div class="title">
      <h2>${title}</h2><br/><span class='date'>${date}</span>
    </div>

    <div class="content">
      <span class="description">${description}</span>
      <button data-file="${file}">Read more →</button>
    </div>

    <div class="footer"><div class="tag">${tag}</div></div>
  `;

  card
    .querySelector("button")
    .addEventListener("click", (e) =>
      window.location.assign(`post.html?file=${e.target.dataset.file}`),
    );

  return card;
}

/* ------------ bootstrap ------------ */
(async () => {
  const container = document.getElementById("container");

  for (const file of [...posts].sort((a, b) => b.localeCompare(a))) {
    const card = await makeCard(file);
    container.append(card);
  }
})();
