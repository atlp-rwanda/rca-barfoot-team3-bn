const fs = require('fs');
const assert = require('http-assert');
const { Op } = require('sequelize');
const { validate } = require('../../../utils/validate');
const { creationSchema, updateSchema, Accommodation } = require('../models');
const cloudinary = require('../../../utils/cloudinary');
const sequelize = require('../../../config/SequelizeConfig');
const { User } = require('../../user/model');
const { Like } = require('../models/likes');

/**
 * Accoomodation Controller Class
 */
class AccomodationsController {
  /**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Object>} created accommodation
 */
  static async getAll(req, res) {
    const accommodations = await Accommodation.findAll();

    return res.status(200).json({
      accommodations
    });
  }

  /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} accommodation by id
     */
  static async getById(req, res) {
    assert(req.params.id, 400, 'Accomodation Id is required in params');

    const accommodation = await Accommodation.findByPk(req.params.id);

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

    let resp = { accommodation };

    if (req.query.rooms) {
      const rooms = await accommodation.getRooms();
      resp = { ...resp, rooms };
    }

    return res.status(200).json(resp);
  }

  /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} accommodation by name
     */
  static async getByName(req, res) {
    assert(req.params.name, 400, 'Accommodation name is required in params');

    const accommodations = await Accommodation.findAll({
      where: {
        name: {
          [Op.iLike]: `%${req.params.name}%` // case-insensitive search for name
        }
      }
    });

    if (!accommodations || accommodations.length === 0) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        errors: {
          accomodation: [
            'No accommodations with this name were found'
          ]
        }
      });
    }

    let resp = { accommodations };

    if (req.query.rooms) {
      const roomPromises = accommodations.map((accommodation) => accommodation.getRooms());
      const rooms = await Promise.all(roomPromises);
      resp = { ...resp, rooms };
    }

    return res.status(200).json(resp);
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} created accommodation
   */
  static async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
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
      }, { transaction });

      transaction.commit();

      return res.status(201).json({
        status: 'CREATED',
        accommodation
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
   * @returns {*} updated accommodation
   */
  static async update(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const [passes, data, errors] = validate(req.body, updateSchema);

      if (!passes) {
        return res.status(400).json({
          statusCode: 'BAD_REQUEST',
          errors
        });
      }

      const accommodation = await Accommodation.findByPk(req.params.id);

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

      await accommodation.update({
        ...data
      }, { transaction });

      transaction.commit();

      return res.status(200).json({
        status: 'UPDATED',
        accommodation
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
   * @returns {*} updated accommodation
   */
  static async search(req, res) {
    const { type = '', city = '' } = req.query;

    const accommodations = await Accommodation.findAll({
      where: {
        ...(type ? { type } : {}),
        location: {
          city: {
            [Op.iLike]: `%${city}%`
          }
        }
      }
    });

    return res.status(200).json({
      accommodations
    });
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} deleted accommodation
   */
  static async deleteAccomodation(req, res) {
    const accommodation = await Accommodation.findByPk(req.params.id);

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
    await accommodation.destroy();

    return res.status(200).json({
      status: 'DELETED'
    });
  }

  /**
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {*} cooresponding accommodations
   */
  static async uploadImage(req, res) {
    const accommodation = await Accommodation.findByPk(req.params.id);

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

    await Accommodation.update({ image_path: urls.map((url) => url.url).join(',') }, { where: { id: accommodation.id } });

    return res.status(200).json({
      status: 'SUCCESS',
      accommodation,
      files
    });
  }

  static async likeOrDislikeAccommodation(req, res) {
    try {
      const accommodationId = req.params.id;
      const { like } = req.params;
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      const accommodation = await Accommodation.findByPk(accommodationId);

      if (!accommodation) {
        return res.status(404).json({
          message: 'Accommodation not found'
        });
      }

      if (accommodation.likedBy.includes(userId)) {
        return res.status(400).json({
          message: 'User has already liked or disliked this accommodation'
        });
      }

      if (like === 'true') {
        accommodation.likes += 1;
      } else if (like === 'false') {
        accommodation.dislikes += 1;
      }

      accommodation.likedBy.push(userId);
      await accommodation.save();

      return res.json({
        status: 'SUCCESS',
        likes: accommodation.likes,
        dislikes: accommodation.dislikes
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async likeAccommodation(req, res) {
    const accommodationId = req.params.id;
    const userId = req.user.id;

    const existingLike = await Like.findOne({
      where: {
        accommodationId,
        userId
      }
    });

    if (existingLike) {
      existingLike.liked = !existingLike.liked;
      await existingLike.save();
    } else {
      await Like.create({
        accommodationId,
        userId,
        liked: true
      });
    }

    return res.status(200).json({
      status: 'SUCCESS',
    });
  }

  static async getAccommodationLikes(req, res) {
    const accommodationId = req.params.id;

    const likes = await Like.count({
      where: {
        accommodationId,
        liked: true
      }
    });
    const dislikes = await Like.count({
      where: {
        accommodationId,
        liked: false
      }
    });

    return res.json({ likes, dislikes });
  }
}

module.exports = {
  AccomodationsController
};
