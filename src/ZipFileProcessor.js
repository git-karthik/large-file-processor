const AdmZip = require("adm-zip");
const { path, limit_file_size, RESOURCE_PATH } = require("../config");

class ZipFileProcessor {
  constructor() {}

  /**
   * Unpack archives refered
   * @param {*} archiveRef list of archive references to extract. Expected archiveRef object like
   * [{
   * filename:'filename.zip',
   * filepath:'C:\\..\\filename.zip,
   * bytesize: 500'}]
   * @returns list of folder paths where the zip is extracted
   */
  unpackArchives(archiveRef) {
    return archiveRef.map((ref) => {
      console.info(ref);
      return new Promise((resolve, reject) => {
        if (ref.bytesize > limit_file_size) {
          try {
            const zip = new AdmZip(path.resolve(ref.filepath));
            if (this._isZipContainingSingleCSV(zip)) {
              zip.extractAllToAsync(
                path.join(RESOURCE_PATH, ref.filename.slice(0, -4)),
                true, //overwrite
                true, //keep original permission
                (err) => {
                  if (err) {
                    reject(err);
                    throw new Error(err.stack);
                  }
                  let unpackedPath = ref.filepath.slice(0, -4);
                  console.log(`Extraction complete for ${ref.filename}`);
                  resolve(unpackedPath);
                }
              );
            }
          } catch (error) {
            console.error(`Something went wrong ${error}`);
          }
        }
      });
    });
  }

  _isZipContainingSingleCSV(_zip) {
    return (
      _zip.getEntries().length == 1 &&
      _zip.getEntries()[0].name.slice(-3) == "csv"
    );
  }

  /**
   * Pack archives from sourceFilePath to archiveTargetFilePath
   * @param {*} unpackedFilePath
   * @param {*} archiveTargetPath
   * @returns a promise which resolves or rejects on packing the file resource
   */
  repackArchives(unpackedFilePath, archiveTargetPath) {
    return new Promise((resolve, reject) => {
      try {
        let zip = new AdmZip();
        zip.addLocalFile(unpackedFilePath);
        zip.writeZip(archiveTargetPath, (err) => {
          if (err) throw new Error(err.message);

          console.log(
            `Archive ${archiveTargetPath} packed and pushed to resource path`
          );
          resolve(unpackedFilePath);
        });
      } catch (err) {
        reject(`Error while repacking split files: ${err.message}`);
      }
    });
  }
}

module.exports = { ZipFileProcessor };
