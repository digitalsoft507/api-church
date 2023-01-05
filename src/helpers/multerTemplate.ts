import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import * as mkdirp from 'mkdirp';

function getFilename(req, file, cb) {
  crypto.pseudoRandomBytes(16, function (error, raw) {
    cb(error, error ? undefined : raw.toString('hex'));
  });
};

function getDestination(req, file, cb) {
  cb(null, os.tmpdir());
};

function MyCustomStorage(opts) {
  this.getFilename = (opts.filename || getFilename)

  if (typeof opts.destination === "string") {
    mkdirp.sync(opts.destination);
    this.getDestination = function ($0, $1, cb) { cb(null, opts.destination)}
  } else {
    this.getDestination = (opts.destination || getDestination);
  }
}

MyCustomStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  const that = this;

  that.getDestination(req, file, (err, destination) => {
    if (err) return cb(err);

    that.getFilename(req, file, (err, filename) => {
      if (err) return cb(err);

      const finalPath = path.join(destination, filename);
      const outStream = fs.createWriteStream(finalPath);

      file.stream.pipe(outStream);

      outStream.on('error', cb);
      outStream.on('finish', () => {
        cb(null, {
          destination: destination,
          filename: filename,
          path: finalPath,
          size: outStream.bytesWritten
        })
      })
    })
  })
}

MyCustomStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  const path = file.path;

  delete file.destination;
  delete file.filename;
  delete file.path;

  fs.unlink(path, cb);
}

export default function (opts) {
  return new MyCustomStorage(opts)
}