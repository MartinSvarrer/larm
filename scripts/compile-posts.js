const MarkdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');

const md = new MarkdownIt('commonmark', {
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) { }
    }
    // use external default escaping
    return '';
  }
});

const htmlTemplate = fs.readFileSync('templates/post.html', { encoding: 'utf8' });

const posts = fs.readdirSync('posts/');

posts.forEach(async (nameOfPost) => {
  // Read metadata file
  const pathToMetadata = path.resolve('posts', nameOfPost, 'metadata.json');
  const metadataContent = await fs.promises.readFile(pathToMetadata, { encoding: 'utf8' });
  const metadata = JSON.parse(metadataContent);

  // Read and render markdown file
  const pathToMdPost = path.resolve('posts', nameOfPost, nameOfPost + '.md');
  const markdownContent = await fs.promises.readFile(pathToMdPost, { encoding: 'utf8' });
  const postHtml = md.render(markdownContent);

  // Render post template with post and metadata content
  const htmlContent = htmlTemplate
    .replace(/{{title}}/g, metadata.title)
    .replace(/{{content}}/, postHtml);

  // Write finished blog post
  await fs.promises.rmdir('public/posts', { recursive: true });
  await fs.promises.mkdir(`public/posts/${nameOfPost}`, { recursive: true });
  await fs.promises.writeFile(`public/posts/${nameOfPost}/index.html`, htmlContent);
});
