const { path, RESOURCE_PATH } = require("../config");
const fs = require("fs");

class ResourceManager {
  constructor() {}

  /**
   * Fetches the files from the RESOURCE_PATH configured in config.json
   * @param {*} filetypes as configured in config.json
   * @returns An array of file dirents with filename, path and size
   */
  fetchValidArchives(filetypes) {
    let dirents = fs.readdirSync(path.resolve(RESOURCE_PATH), {
      withFileTypes: true,
    });

    if (!dirents.length) {
      console.warn("source directory is empty. No files could be processed");
      return;
    }

    return dirents
      .filter((dirent) => {
        return (
          dirent.isFile() && filetypes.includes(dirent.name.split(".").pop())
        );
      })
      .map((dirent) => {
        let filepath = path.join(RESOURCE_PATH, dirent.name);
        let stat = fs.statSync(filepath);

        return {
          filename: dirent.name,
          filepath: filepath,
          bytesize: stat.size,
        };
      });
  }

  /**
   * Removes file from the filepath
   * @param {*} filepath
   * @returns a promise which either resolves or rejects when the file is removed or encountered an err
   */
  removeFile(filepath) {
    return new Promise((resolve, reject) => {
      try {
        fs.unlinkSync(filepath);
        console.log(`File removed from path ${filepath}`);
        resolve();
      } catch (error) {
        console.error(`Error while removing file from path: ${filepath}`);
        reject(error);
      }
    });
  }

  /**
   * Removes files and its directory as provided in the directory path
   * @param {*} directoryPath
   * @returns a promise which resolves or rejection on deletion
   */
  removeFilesAndDir(directoryPath) {
    return new Promise((resolve, reject) => {
      let isExists = fs.existsSync(directoryPath);
      if (!isExists) {
        reject(`No such directory found: ${path.basename(directoryPath)}`);
        return;
      }

      fs.rm(
        directoryPath,
        { recursive: true, maxRetries: 3, retryDelay: 1000 },
        (err) => {
          if (err) {
            console.error(`Error while cleaning up folder ${directoryPath}`);
            reject(`Error while cleaning up folder ${directoryPath}`);
            return;
          }
          console.log(`${directoryPath} removed successfully`);
          resolve();
        }
      );
    });
  }

  /**
   * Fetches the list of dirents in the directory path
   * @param {*} directoryPath
   * @returns list of dirents
   */
  fetchFilesInDirectory(directoryPath) {
    let isExists = fs.existsSync(directoryPath);
    if (!isExists) {
      return;
    }

    return fs
      .readdirSync(directoryPath, { withFileTypes: true })
      .map((dirent) => dirent.name);
  }
}

module.exports = { ResourceManager };
