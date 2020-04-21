import { promises as fs } from 'fs';
import path from 'path';

const walk = async (baseDir, filelist = [], nextDir) => {
    const dir = nextDir || baseDir;
    const files = await fs.readdir(dir);
  
    for (const file of files) {
      const filepath = path.join(dir, file);
      const stat = await fs.stat(filepath);
  
      if (stat.isDirectory()) {
        filelist = await walk(baseDir, filelist, filepath);
      } else {
        filelist.push(filepath.replace(baseDir, ''));
      }
    }
  
    return filelist;
};

export default walk;