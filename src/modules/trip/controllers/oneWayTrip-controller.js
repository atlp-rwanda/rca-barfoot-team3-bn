const { OneWayTrip } = require('../model');

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
