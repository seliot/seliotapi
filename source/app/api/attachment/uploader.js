'use strict';

const fs = require('fs');

const uploader = function (file, options) {
  if (!file) throw new Error('no file(s)');

  return _fileHandler(file, options);
};

const _fileHandler = function (file, options) {
  if (!file) throw new Error('no file');

  const orignalname = file.hapi.filename;
  const filename = orignalname;
  const path = `${options.dest}${filename}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on('error', function (err) {
      reject(err);
    });

    file.pipe(fileStream);

    file.on('end', function () {
      const fileDetails = {
        fieldname: file.hapi.name,
        originalname: file.hapi.filename,
        filename,
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path,
        size: fs.statSync(path).size,
      };
      resolve(fileDetails);
    });
  });
};

module.exports = {
  uploader
};
