const cloudinary = require('../../../utils/cloudinary');
const fs = require("fs");
const assert = require('http-assert');

class FileController {
  /**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {*} cooresponding rooms
 */
  static async uploadImage(req, res) {
    const { files } = req;
    if (!files.length) {
      return res.status(404).json({
        status: 'BAD_REQUEST',
        errors: {
          files: [
            'No Files Uploaded'
          ]
        }
      });
    }

    const uploader = (path) => cloudinary.uploads(path);

    let uploads = []

    await Promise.all(files.map(async (file) => {
      const { path } = file;
      const newPath = await uploader(path);
      uploads.push({
        ...file,
        path: newPath
      });

      fs.unlinkSync(path);
    }));

    return res.status(200).json({
      status: 'SUCCESS',
      uploads
    });
  }

  /**
* @param {Express.Request} req
* @param {Express.Response} res
* @returns {*} cooresponding rooms
*/
  static async delete(req, res) {
    assert(req.body.path, 400, "Path is required")

    let body = await cloudinary.delete(req.body.path)

    return res.status(200).json({
      status: 'SUCCESS',
      body
    });
  }
}

module.exports = {
  FileController
}