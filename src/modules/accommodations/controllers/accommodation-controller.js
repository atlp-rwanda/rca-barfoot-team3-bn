const { validate } = require('../../../utils/validate');
const { creationSchema, Accommodation, Room } = require('../models');

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
}

module.exports = {
  AccomodationsController
};
