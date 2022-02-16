# large-file-processor

Process large files using streams in Node.js

## Problem

While processing large csv files greater than 500MB, often we encounter unexpected EOF(End of File) error. Also, very large files could not be opened via excel or any text editor. I intend to build a solution to split the csv files to the desired size and process them back in another task.

## How to use

1. Clone the source code to local file system. Perform `npm i` at the root of the project path `{PROJECT_ROOT}`.
2. Copy the zip files with large csv content to the `{PROJECT_ROOT}/resources`.
3. Start the app using `npm start` at the root of the project.
4. Sit back and watch the magic of zip extraction, split csv, repack zip.
5. Once the process is completed successfully, copy the split files from the resources path for use.

## Notes:

1.) Watch the config.js which can be modified as per the requirement.
