function getFileFromQuery() {
  const params = new URLSearchParams(location.search);
  return params.get("file");
}

async function loadPost() {
  const file = getFileFromQuery();
  if (!file) {
    document.getElementById("post").textContent = "No post specified.";
    return;
  }

  const res = await fetch(`posts/${file}`);
  if (!res.ok) {
    document.getElementById("post").textContent = "Post not found.";
    return;
  }

  const md = await res.text();

  // Calculate word count and read time
  const wordCount = md
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const readTimeMinutes = Math.ceil(wordCount / 225);
  const readTimeString = `read time: ~${readTimeMinutes} min`;

  const md_final = md.replace(/{{readtime}}/g, readTimeString);

  const html = marked.parse(md_final);

  const [, , slug] = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/) || [];
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  document.getElementById("post").innerHTML = `<h1>${title}</h1>${html}`;
}

loadPost();
