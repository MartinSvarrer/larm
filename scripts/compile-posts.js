const MarkdownIt = require('markdown-it');
const { readFiles } = require('./read-files');
const fs = require('fs');

const md = new MarkdownIt('commonmark');

readFiles('posts/', (filename, markdownContent) => {
  const htmlContent = md.render(markdownContent);
  const baseName = filename.split('.')[0];

  fs.writeFile(`public/${baseName}.html`, htmlContent, (err) => {
    if (err) {
      throw err;
    }
  })
}, function (err) {
  throw err;
});

