const { ResourceManager } = require("./src/ResourceManager");
const { ZipFileProcessor } = require("./src/ZipFileProcessor");
const { SplitCSVContent } = require("./src/SplitCSVContent");
const { process_file_types, RESOURCE_PATH, path } = require("./config");
const fs = require("fs");
//Initialize required objects
const _resourceManager = new ResourceManager();
const _zipFileProcessor = new ZipFileProcessor();
const _splitcsvContent = new SplitCSVContent();
//Read the valid archives list from the RESOURCE_PATH
const archivesRef = _resourceManager.fetchValidArchives(...process_file_types);
//Deflate the archives async and get the promises
const unpackPromises = _zipFileProcessor.unpackArchives(archivesRef);

//For each unpacked csv file, split the csv, repack the split files and push it back to the RESOURCE_PATH.
unpackPromises.forEach((_promise) => {
  _promise.then((unpackedPath) => {
    console.log(`Executing split process for ${unpackedPath}`);
    _splitcsvContent
      .splitCSV(unpackedPath)
      .then(() => {
        //Repack split archives to resource path
        return Promise.all(
          fs.readdirSync(unpackedPath).map((splitcsv) => {
            return _zipFileProcessor.repackArchives(
              path.join(unpackedPath, splitcsv),
              path.join(RESOURCE_PATH, `${splitcsv.slice(0, -4)}.zip`)
            );
          })
        );
      })
      .then(() => {
        //clean up files after repack
        return Promise.all(
          _resourceManager
            .fetchFilesInDirectory(unpackedPath)
            .map((_filename) => {
              return _resourceManager.removeFile(
                path.join(unpackedPath, _filename)
              );
            })
        );
      })
      .then(() => {
        return _resourceManager.removeFilesAndDir(unpackedPath);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        console.info(`Process complete for ${unpackedPath}`);
      });
  });
});
