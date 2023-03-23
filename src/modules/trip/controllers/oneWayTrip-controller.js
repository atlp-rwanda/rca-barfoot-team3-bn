const { OneWayTrip } = require("../model");

class OneWayTripController {
    /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     *  @returns {*} created accommodation
    */
    static async createOneWayTrip(req, res) {
        try {
            const { departure, destination, date, reason, accommodationId } = req.body;
            const userId = req.user.id;

            const trip = await OneWayTrip.create({
                departure,
                destination,
                date,
                reason,
                accommodationId,
                UserId: userId // Associate the trip with the authenticated user
            });

            res.status(201).json(trip);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

}

module.exports = {
    OneWayTripController
}
