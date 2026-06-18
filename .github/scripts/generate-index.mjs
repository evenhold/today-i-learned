import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // 🔥 Corregida la T mayúscula

// Reemplazo para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url); // 🔥 Corregida la T mayúscula
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '../../');
const README_PATH = path.join(ROOT_DIR, 'README.md');
const IGNORED_DIRS = ['.git', '.github', 'node_modules'];

const getMarkdownFiles = (dir, categoryList) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !IGNORED_DIRS.includes(file)) {
      getMarkdownFiles(fullPath, categoryList);
    } else if (file.endsWith(".md") && file !== "README.md") {
      const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/'); // 🔥 Corregido el regex /\\/g
      const content = fs.readFileSync(fullPath, 'utf8');

      // Extraer el titulo del Frontmatter o del primer H1
      let title = file.replace('.md', '');
      const titleMatch = content.match(/title:\s*"(.*?)"/) || content.match(/^#\s+(.*)/m);

      if (titleMatch) {
        title = titleMatch[1];
      }

      const category = path.basename(path.dirname(fullPath));
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);

      if (!categoryList[formattedCategory]) {
        categoryList[formattedCategory] = [];
      }

      categoryList[formattedCategory].push(`    *   [${title}](./${relativePath})`);
    }
  });

  return categoryList;
};

const updateReadme = () => {
  const categories = getMarkdownFiles(ROOT_DIR, {}); // 🔥 Corregido: pasamos el objeto {} inicial
  let indexContent = '\n';

  Object.keys(categories).sort().forEach(category => {
    indexContent += `*   **${category}**\n${categories[category].join('\n')}\n`;
  });

  let readme = fs.readFileSync(README_PATH, 'utf8');
  const regex = /(<!-- START_INDEX -->)[\s\S]*(<!-- END_INDEX -->)/;

  if (regex.test(readme)) {
    readme = readme.replace(regex, `$1${indexContent}$2`);
    fs.writeFileSync(README_PATH, readme, 'utf8');
    console.log('✅ Index generated successfully using ES Modules!');
  } else {
    console.error('❌ Markers <!-- START_INDEX --> and <!-- END_INDEX --> not found.');
  }
};

updateReadme();
