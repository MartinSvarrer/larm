As this is a tech blog, a hello world post seems appropriate. What better way to start than describing my approach to building my blog from scratch. I decided to not use an existing platform just for the fun of being able to learn some new things while building the blog itself.

Overall my initial goal is to publish this as a static blog on GitHub Pages, with an infrastructure that will help me write my first 10 blog posts.

## Writing experience

I want my blog to be version controlled and saved in plain text. Markdown is a familiar format for me, and comes with all the features I think I need for writing my articles about development. Should I need more features I should be able to migrate from markdown to something else pretty easy, using something like [pandoc](https://pandoc.org/).

CommonMark markdown is to me the easiest choice, as it seems to be a common supported flavor by VS Code, Pandoc, and Github.

Next up I need to use an editor. My only requirement for now is spell-checking, and a minimal of visualization to know my markdown is correctly formatted. For this need Visual Studio Code with [Spell Right](https://marketplace.visualstudio.com/items?itemName=ban.spellright) extension seems to do the trick.

## File structure (source and target)

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

## Compile markdown to HTML

For building a blog I will need to create a website with some static pages and somehow compile each blog post into a page which fits the overall design of the website. Each markdown file should be compiled to unique HTML pages.

VS code comes with a build-in preview mode. VS Code uses [markdown-it](https://markdown-it.github.io/), and I have decided to jump on board an use the same for automating the generation of my static web pages.

As this is a tech-blog I will also configure the [highlight.js](https://highlightjs.org/) plugin for `markdown-it`, to support good code highlighting.

A naïve implementation for compiling the markdown will work for now. This version display the code used for compiling a all posts in `/posts` folder to the `public` folder. I don't have any `assets/` for this blog post nor do I have a `metadata.json` file, so will skip that part until it's needed.

The script for locating and compiling the markdown files look like the following:

```js
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
const posts = fs.readdirSync('posts/');

posts.forEach(async (nameOfPost) => {
  const pathToMdPost = path.resolve('posts', nameOfPost, nameOfPost + '.md');
  const markdownContent = await fs.promises.readFile(pathToMdPost, { encoding: 'utf8' });
  const postHtml = md.render(markdownContent);
  await fs.promises.rmdir('public/posts', { recursive: true });
  await fs.promises.mkdir(`public/posts/${nameOfPost}`, { recursive: true });
  await fs.promises.writeFile(`public/posts/${nameOfPost}/index.html`, postHtml);
});
```

## Templating

The build output of each compiled markdown is an HTML fragment. To add design and a website layout elements like header, navigation and footer we must inline the content into a post layout template.

For this task, I have to choose between using an existing templating engine or use simple string replacements.

Lets begin with creating an HTML template, in which each blog post is added. I will use the syntax the style of [mustache](http://mustache.github.io) like  `{{variable}}` to insert things into the template.

I imagine a template like the following for each post:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{title}}</title>
</head>

<body>
  <header>
    <a href="/">Larm [lɑːˀm]</a>
  </header>

  <main>
    <article>
      <header>
        <h1>{{title}}</h1>
      </header>

      {{content}}
    </article>
  </main>
</body>

</html>
```
Doing a simple string replacement, works for me here, and no need for a template engine yet. I am sure using the templating engine is faster for me to get up and running and will serve me well, but where is the fun in that. Moving to a template engine later should be possible without too big changes.

Here is a snippet of replacing some variables in the template with appropriate content:

```js
const htmlContent = htmlTemplate
  .replace(/{{title}}/g, metadata.title)
  .replace(/{{content}}/, postHtml);
```

Simple, but effective!

## Styling

We already configured the markdown so that we can display syntax highlighting. Adding a highlight.js stylesheet is now a simple and easy task:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/vs2015.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```
