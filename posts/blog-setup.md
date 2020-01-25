# Hello world

As this is a tech blog, a hello world post seems appropriate. What better way to start than describing my approach to building my blog from scratch. I decided to not use an existing platform just for the fun of being able to learn some new things while building the blog itself.

# Writing experience

I want my blog to be version controlled and saved in plain text. Markdown is a familiar format for me, and comes with all the features I think I need for writing my articles about development. Should I need more features I should be able to migrate from markdown to something else pretty easy, using something like [pandoc](https://pandoc.org/).

CommonMark markdown is to me the easiest choice, as it seems to be a common supported flavor by VS Code, Pandoc, and Github.

Next up I need to use an editor. My only requirement for now is spell-checking, and a minimal of visualization to know my markdown is correctly formatted. For this need Visual Studio Code with [Spell Right](https://marketplace.visualstudio.com/items?itemName=ban.spellright) extension seems to do the trick.

# Compile markdown to HTML

For building a blog I will need to create a website with some static pages and somehow compile each blog post into a page which fits the overall design of the website. Each markdown file should be compiled to unique HTML pages.

VS code comes with a build-in preview mode. VS Code uses [markdown-it](https://markdown-it.github.io/), and I have decided to jump on board an use the same for automating the generation of my static web pages.

