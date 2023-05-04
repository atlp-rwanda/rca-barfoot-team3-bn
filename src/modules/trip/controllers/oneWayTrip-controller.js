const moment = require('moment');
const { OneWayTrip, Request } = require('../model');
const { Accommodation, Room } = require('../../accommodation/models');
const { User } = require('../../user/model');
const { Booking } = require('../../booking/models');

/**
 * OneWayTrip Controller Class
 */
class OneWayTripController {
  /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     *  @returns {*} created trip
    */
  static async getRequests(req, res) {
    const user = await User.findByPk(req.user.id);

    try {
      const requests = await user.getRequests({
        include: [
          { model: OneWayTrip, as: 'onewaytrip' },
          {
            model: Booking,
            as: 'bookings',
            include: [
              {
                model: Room,
                as: 'room',
                include: {
                  model: Accommodation, as: 'accommodation'
                }
              }
            ]
          },
        ]
      });
      return res.send({
        requests
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

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
      const tripDate = moment(date, 'YYYY-MM-DD');
      const isoDate = tripDate.toISOString();

      const existingTrip = await OneWayTrip.findOne({
        where: {
          created_by: createdBy,
          date: isoDate
        }
      });
      if (existingTrip) {
        return res.status(404).json({ message: 'You can only book one accommodation per day' });
      }

      // let us create one request.
      const request = await Request.create({
        userId: createdBy,
        status: 'PENDING'
      });

      // Create the new trip
      const trip = await OneWayTrip.create({
        requestId: request.id,
        departure,
        destination,
        date: isoDate,
        reason,
        created_by: createdBy,
        accomodationId,
      });

      res.status(201).json({
        trip,
        message: 'Trip created successfully'
      });
    } catch (error) {
      console.error("err",error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = {
  OneWayTripController
};
