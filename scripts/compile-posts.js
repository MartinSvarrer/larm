const MarkdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');

const md = new MarkdownIt('commonmark');
const posts = fs.readdirSync('posts/');

posts.forEach(async (nameOfPost) => {
  const pathToMdPost = path.resolve('posts', nameOfPost, nameOfPost + '.md');
  const markdownContent = await fs.promises.readFile(pathToMdPost, { encoding: 'utf8' });
  const htmlContent = md.render(markdownContent);
  await fs.promises.rmdir('public/posts', { recursive: true });
  await fs.promises.mkdir(`public/posts/${nameOfPost}`, { recursive: true });
  await fs.promises.writeFile(`public/posts/${nameOfPost}/index.html`, htmlContent);
});
