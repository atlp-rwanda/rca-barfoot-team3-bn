const { validate } = require('../../../utils/validate');
const { creationSchema, Accommodation } = require('../models');
const { Room } = require('../models/rooms');

module.exports.AccomodationsController = class AccomodationsController {
  static async create(req, res) {
    const [passes, data, errors] = validate(req.body, creationSchema);

    if (!passes) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors
      });
    }

    const accommodation = await Accommodation.create(data);
    const rooms = [];

    for (const room of data.rooms) {
      rooms.push(await Room.create({
        accommodationId: accommodation.id,
        ...room
      }));
    }

    return res.status(201).json({
      status: 'CREATED',
      accommodation,
      rooms
    });
  }
};
