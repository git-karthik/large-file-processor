const csvSplitStream = require("csv-split-stream");
const fs = require("fs");
const { path, lineLimit: _linelimit } = require("../config");

class SplitCSVContent {
  constructor() {}

  /**
   * Split large csv beyond the configured linelimit from the file path
   * @param {*} unpackedPath
   * @returns a promise which resolves or rejects during the split process
   */
  splitCSV(unpackedPath) {
    return new Promise((resolve, reject) => {
      const contents = fs.readdirSync(path.resolve(unpackedPath));
      const largecsvpath = path.join(unpackedPath, contents[0]);
      csvSplitStream
        .split(
          fs.createReadStream(largecsvpath),
          {
            lineLimit: _linelimit,
          },
          (index) =>
            fs.createWriteStream(
              path.join(
                unpackedPath,
                `${path.basename(unpackedPath)}-${index}.csv`
              )
            )
        )
        .then((csvSplitResponse) => {
          console.log("csvSplitStream succeeded.", csvSplitResponse);
          fs.unlink(largecsvpath, (err) => {
            if (err) throw err;
            console.log(`${largecsvpath} was deleted successfully`);
            resolve();
          });
        })
        .catch((csvSplitError) => {
          console.log("csvSplitStream failed!", csvSplitError);
          reject(csvSplitError);
        });
    });
  }
}

module.exports = { SplitCSVContent };
