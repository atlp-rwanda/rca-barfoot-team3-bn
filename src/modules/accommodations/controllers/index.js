const { validate } = require("../../../utils/validate");
const { creationSchema, Accommodation } = require("../models");
const { Room } = require("../models/rooms");


module.exports.AccomodationsController = class {
  static async create(req, res) {

    const [passes, data, errors] = validate(req.body, creationSchema);

    if (!passes) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        errors
      });
    }

    let accommodation = await Accommodation.create(data)
    let rooms = []

    for (let room of data.rooms) {
      rooms.push(await Room.create({
        accommodationId: accommodation.id,
        ...room
      }))
    }

    return res.status(201).json({
      status: "CREATED",
      accommodation,
      rooms
    })
  }
}