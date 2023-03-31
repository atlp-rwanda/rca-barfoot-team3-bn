const cloudinary = require('../../../utils/cloudinary');


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

    const urls = [];

    await Promise.all(files.map(async (file) => {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }));

    await Room.update({ image_paths: urls.map((url) => url.url).join(',') }, { where: { id: room.id } });

    return res.status(200).json({
      status: 'SUCCESS',
      room,
      files
    });
  }
}

module.exports = {
  FileController
}