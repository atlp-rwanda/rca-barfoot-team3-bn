const { OneWayTrip } = require('../model');
const { Accommodation } = require('../../accommodations/models');

/**
 * OneWayTrip Controller Class
 */
class OneWayTripController {
  /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     *  @returns {*} created trip
    */
  static async createOneWayTrip(req, res) {
    try {
      const {
        destination, departure, date, reason, accomodationId
      } = req.body;

      const createdBy = req.user.id;

      const accommodation = await Accommodation.findByPk(accomodationId);
      if (!accommodation) {
        return res.status(404).json({ message: 'Accommodation not found' });
      }

      const existingTrip = await OneWayTrip.findOne({
        where: {
          created_by: createdBy,
          date
        }
      });
      if (existingTrip) {
        return res.status(404).json({ message: 'You can only book one accommodation per day' });
      }

      // Create the new trip
      const trip = await OneWayTrip.create({
        departure,
        destination,
        date,
        reason,
        created_by: createdBy,
        accomodationId,
      });

      res.status(201).json({
        trip,
        message: 'Trip created successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = {
  OneWayTripController
};
