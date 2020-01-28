# Hello world

As this is a tech blog, a hello world post seems appropriate. What better way to start than describing my approach to building my blog from scratch. I decided to not use an existing platform just for the fun of being able to learn some new things while building the blog itself.

Overall my initial goal is to publish this as a static blog on GitHub Pages, with an infrastructure that will help me write my first 10 blog posts.

# Writing experience

I want my blog to be version controlled and saved in plain text. Markdown is a familiar format for me, and comes with all the features I think I need for writing my articles about development. Should I need more features I should be able to migrate from markdown to something else pretty easy, using something like [pandoc](https://pandoc.org/).

CommonMark markdown is to me the easiest choice, as it seems to be a common supported flavor by VS Code, Pandoc, and Github.

Next up I need to use an editor. My only requirement for now is spell-checking, and a minimal of visualization to know my markdown is correctly formatted. For this need Visual Studio Code with [Spell Right](https://marketplace.visualstudio.com/items?itemName=ban.spellright) extension seems to do the trick.

# File structure (source and target)

Each post may consist of:

-  A markdown file
-  Assets related to the article
-  Article metadata

To accommodate this let's create file structure:

- `<name-of-post>`
  - `<name-of-post>.md`
  - `assets/`
  - `metadata.json`

Keeping the name of the post dynamic to match the parent folder, allows me to edit multiple articles and still see what I'm editing.

Each post should be published to provide nice URLs like `/<name-of-post>`.

Should eventually the build output should end up with:

- `<name-of-post>/`
  -  `index.html`
  -  `assets/`

Which should make the post accessible at `/<name-of-post>`.

# Compile markdown to HTML

For building a blog I will need to create a website with some static pages and somehow compile each blog post into a page which fits the overall design of the website. Each markdown file should be compiled to unique HTML pages.

VS code comes with a build-in preview mode. VS Code uses [markdown-it](https://markdown-it.github.io/), and I have decided to jump on board an use the same for automating the generation of my static web pages.

A naïve implementation for compiling the markdown will work for now. This version display the code used for compiling a all posts in `/posts` folder to the `public` folder. I don't have any `assets/` for this blog post nor do I have a `metadata.json` file, so will skip that part until it's needed.

The script looks like the following:

```js
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
```
