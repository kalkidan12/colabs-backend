import * as path from 'path';
import * as fs from 'fs';

/**
 * Get Files from Remote Repository
 * @description User selected files will be retrieved from the github repo and package them ready to be downloaded
 * @access Private
 */
const getFilesfromRepo = (projectName: string, urls: any[]) => {
  const directory = path.join(__dirname.replace('src\\utils', 'temp'), projectName);
  const download = require('download');

  return new Promise((resolve, _reject) => {
    urls.forEach(async (url) => {
      await download(url.download_url, directory);
      console.log('File downloaded successfully!');
    });

    resolve(true);
  }).then(() => {
    return compressFiles(directory);
  });
};

// TODO: Test directory creation
const compressFiles = (directory: string) => {
  const zipCompress = require('adm-zip');
  const filePackage = new zipCompress();
  const zipDirectory = fs.readdirSync(directory);
  const downloadPackage = 'job_package.zip';

  for (const file of zipDirectory) filePackage.addLocalFile(path.join(directory, file));

  const data = filePackage.toBuffer();

  return { downloadFileName: downloadPackage, data };
};

export { getFilesfromRepo, compressFiles };
