const fs = require('fs');
const { validate } = require('../../../utils/validate');
const { Room, createRoomSchema, Accommodation } = require('../models');
const cloudinary = require('../../../utils/cloudinary');
const sequelize = require('../../../config/SequelizeConfig');
const assert = require('http-assert');

/**
 * Accoomodation Controller Class
 */
class RoomsController {
  /**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Object>} created rooms
 */
  static async getAll(req, res) {
    const rooms = await Room.findAll();

    return res.status(200).json({
      rooms
    });
  }

  /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} accommodation by id
     */
  static async getById(req, res) {
    assert(req.params.id, 400, "Room Id is required in params")

    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        errors: {
          request: [
            'Accommodation with this id is not found'
          ]
        }
      });
    }

    let resp = { room }

    if (req.query.accommodation) {
      console.log("Fetching accomodations")
      let accommodation = await Accommodation.findByPk(room.accommodationId)
      resp = { ...resp, accommodation }
    }

    return res.status(200).json(resp);
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} created room
   */
  static async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const [passes, data, errors] = validate(req.body, createRoomSchema);

      if (!passes) {
        return res.status(400).json({
          statusCode: 'BAD_REQUEST',
          errors
        });
      }

      const accommodation = await Room.findByPk(req.body.accommodationId);

      if (!accommodation) {
        return res.status(404).json({
          status: 'NOT_FOUND',
          errors: {
            request: [
              'Accommodation with this id is not found'
            ]
          }
        });
      }

      const room = await Room.create({
        ...data
      }, { transaction });

      transaction.commit();

      return res.status(201).json({
        status: 'CREATED',
        room
      });
    } catch (error) {
      transaction.rollback();
      return res.status(500).json({
        status: 'INTERNAL_SERVER ERROR',
        errors: {
          server: error
        }
      });
    }
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} cooresponding rooms
   */
  static async uploadImage(req, res) {
    const room = await Room.findByPk(req.params.id);

    if (!room) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        errors: {
          request: [
            'Room with this id is not found'
          ]
        }
      });
    }

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
  RoomsController
};
