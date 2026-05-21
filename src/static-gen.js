const fs = require('fs');
const path = require('path');

const CONTENT_DIR = './content';
const OUTPUT_DIR = './dist';

const TEMPLATE = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Мой SSG</title></head>
<body>
    <h1>{{TITLE}}</h1>
    {{CONTENT}}
    <hr>
    <p>📊 В этой статье <strong>{{WORDCOUNT}}</strong> слов</p>
    <hr>
    <small>SSG v1.0 | {{DATE}}</small>
</body>
</html>`;

function md2html(md) {
    let html = md;
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return html;
}

const files = fs.readdirSync(CONTENT_DIR);
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

for (const file of files) {
    if (file.endsWith('.md')) {
        const md = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
        const title = md.match(/^# (.*)$/m)?.[1] || 'Без названия';
        
        const wordCount = md.split(/\s+/).length;
        
        const html = TEMPLATE
            .replace('{{TITLE}}', title)
            .replace('{{CONTENT}}', md2html(md))
            .replace('{{WORDCOUNT}}', wordCount)
            .replace('{{DATE}}', new Date().toLocaleDateString());
            
        fs.writeFileSync(path.join(OUTPUT_DIR, file.replace('.md', '.html')), html);
        console.log(`✅ ${file} → ${file.replace('.md', '.html')} (слов: ${wordCount})`);
    }
}
console.log('🎉 Готово!');