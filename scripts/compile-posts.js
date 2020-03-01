const MarkdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');
const readingTime = require('reading-time');

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

async function compileTemplates() {
  const postTemplate = fs.readFileSync('templates/post.html', { encoding: 'utf8' });
  const teaserTemplate = fs.readFileSync('templates/teaser.html', { encoding: 'utf8' });
  const homeTemplate = fs.readFileSync('templates/home.html', { encoding: 'utf8' });

  const teasers = [];
  const posts = fs.readdirSync('posts/');
  await fs.promises.rmdir('public/posts', { recursive: true });

  for (const nameOfPost of posts) {
    // Read metadata file
    const pathToMetadata = path.resolve('posts', nameOfPost, 'metadata.json');
    const metadataContent = await fs.promises.readFile(pathToMetadata, { encoding: 'utf8' });
    const metadata = JSON.parse(metadataContent);

    // Read and render markdown file
    const pathToMdPost = path.resolve('posts', nameOfPost, nameOfPost + '.md');
    const markdownContent = await fs.promises.readFile(pathToMdPost, { encoding: 'utf8' });
    const postHtml = md.render(markdownContent);

    // Generate time-to-read info and other stats
    const stats = readingTime(markdownContent);
    const date = new Date(metadata.date);
    const dateString = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)

    // Render post template with post and metadata content
    const postContent = postTemplate
      .replace(/{{title}}/g, metadata.title)
      .replace(/{{stats}}/, `${dateString} - ${stats.text}`)
      .replace(/{{content}}/, postHtml);

    // Create teaser
    const teaserContent = teaserTemplate
      .replace(/{{link}}/, `posts/${nameOfPost}`)
      .replace(/{{title}}/, metadata.title)
      .replace(/{{date}}/, dateString)
      .replace(/{{description}}/, metadata.description);

    teasers.push([date.getTime(), teaserContent]);

    // Write finished blog post
    await fs.promises.mkdir(`public/posts/${nameOfPost}`, { recursive: true });
    await fs.promises.writeFile(`public/posts/${nameOfPost}/index.html`, postContent);

    // Copy assets
    const pathToAssets = path.resolve('posts', nameOfPost, 'assets');
    const publicAssetsPath = path.resolve(`public/posts/${nameOfPost}/assets`);
    await fs.promises.mkdir(publicAssetsPath);
    const assets = await fs.promises.readdir(pathToAssets);

    for (const asset of assets) {
      await fs.promises.copyFile(
        path.resolve(pathToAssets, asset),
        path.resolve(publicAssetsPath, asset),
      );
    }

  }

  // Sort all teasers by date and insert on home page
  const sortedTeasers = teasers.sort((t1, t2) => t2[0] - t1[0]).map(t => t[1]);
  const homeContent = homeTemplate
    .replace(/{{articles}}/, sortedTeasers.join('\n'));

  await fs.promises.writeFile(`public/index.html`, homeContent);
}

compileTemplates();
