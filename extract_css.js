const fs = require('fs');

const extractAndRemoveCSS = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    const styleRegex = /<style>([\s\S]*?)<\/style>/g;
    let match;
    let allCSS = '';
    
    while ((match = styleRegex.exec(content)) !== null) {
        allCSS += `\n/* Extracted from ${file} */\n${match[1]}\n`;
    }
    
    if (allCSS) {
        fs.appendFileSync('style.css', allCSS);
        content = content.replace(styleRegex, '');
        fs.writeFileSync(file, content);
        console.log(`Extracted style from ${file}`);
    }
};

['about.html', 'connect.html', 'portfolio.html'].forEach(extractAndRemoveCSS);
