const { validate } = require('../../../utils/validate');
const { creationSchema, Accommodation, Room } = require('../models');
const cloudinary = require('../../../utils/cloudinary')
const fs = require("fs")

/**
 * Accoomodation Controller Class
 */
class AccomodationsController {
  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} created value
   */
  static async create(req, res) {
    const [passes, data, errors] = validate(req.body, creationSchema);

    if (!passes) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors
      });
    }

    const accommodation = await Accommodation.create({
      created_by: req.user.id,
      ...data
    });

    const rooms = await Promise.all(data.rooms.map((room) => Room.create({
      accommodationId: accommodation.id,
      ...room
    })));

    return res.status(201).json({
      status: 'CREATED',
      accommodation,
      rooms
    });
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} cooresponding accommodations
   */
  static async uploadImage(req, res) {
    let accommodation = await Accommodation.findByPk(req.params.id)

    if (!accommodation) return res.status(404).json({
      status: 'NOT_FOUND',
      errors: {
        request: [
          "Accommodation with this id is not found"
        ]
      }
    });

    let files = req.files
    if (!files.length) return res.status(404).json({
      status: 'BAD_REQUEST',
      errors: {
        files: [
          "No Files Uploaded"
        ]
      }
    });

    const uploader = async (path) => await cloudinary.uploads(path);

    const urls = []
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }

    await Accommodation.update({ "image_path": urls.map(url => url.url).join(",") }, { where: { id: accommodation.id } })

    return res.status(200).json({
      status: 'SUCCESS',
      accommodation
    });
  }
}

module.exports = {
  AccomodationsController
};
