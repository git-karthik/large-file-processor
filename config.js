const path = require("path");
const _curr_dir_obj = path.parse(__dirname);
const PROJECT_ROOT = path.join(_curr_dir_obj.dir, _curr_dir_obj.base);
const RESOURCE_PATH = path.join(PROJECT_ROOT, "resources");
//csv file size greater than the configured byte size would be processed for split
const limit_file_size = 400_000_000;
//csv files would be split into lines as set in the linelimit
const lineLimit = 999999;
const process_file_types = ["zip"];

module.exports = {
  PROJECT_ROOT,
  RESOURCE_PATH,
  path,
  limit_file_size,
  lineLimit,
  process_file_types,
};
