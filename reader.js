/* Query-string helper */
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
  const html = marked.parse(md);

  /* prepend H1 based on filename */
  const [, , slug] = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/) || [];
  const title = slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  document.getElementById("post").innerHTML = `<h1>${title}</h1>\n${html}`;
}

loadPost();
