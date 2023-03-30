const { where } = require('sequelize');
const { Accommodation } = require('../../accommodations/models/accommodation');
const { Room } = require('../../accommodations/models/rooms');
/**
 * hotel controlller
 */

class HotelController {
  /**
     *
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} all hotels accomodation
     */
  static async getAll(req, res) {
    const hotels = await Accommodation.findAll({ where: { type: 'HOTEL' } });
    return res.status(200).json({ hotels });
  }

  /**
     *
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*}  a single hotel
     */
  static async getOne(req, res) {
    const hotel = await Accommodation.findByPk(req.params.id, { where: { type: 'HOTEL' } });

    if (!hotel) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        errors: {
          request: [
            'Hotel with this id is not found'
          ]
        }
      });
    }
    return res.status(200).json({ hotel });
  }

  /**
     *
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} rooms in single hotel

     */
  static async getRooms(req, res) {
    const rooms = await Room.findAll({ where: { accommodationId: req.params.id } });

    if (!rooms) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        errors: {
          request: [
            'Rooms  in  hotel  with this id are not found'
          ]
        }
      });
    }
    return res.status(200).json({ rooms });
  }

  /**
     *
     * @param {Express.Request} req
     * @param {Express.Response} res
     * @returns {*} single room in single hotel

     */
  static async getRoom(req, res) {
    const room = await Room.findOne({
      where: { accommodationId: req.params.id, id: req.params.roomId }
    });

    if (!room) {
      return res.status(404).json({
        status: 'NOT_FOUND',
        errors: {
          request: [
            'Room with such id in this hotel is not found'
          ]
        }
      });
    }

    return res.status(200).json({ room });
  }
}
module.exports = { HotelController };
