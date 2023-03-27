const { OneWayTrip } = require("../model");

class OneWayTripController {
    /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     *  @returns {*} created trip
    */
    static async createOneWayTrip(req, res) {
        try {
            const { destination, departure, date, reason, accomodationId } = req.body;

            const created_by =req.user.id
            // Create the new trip
            const trip = await OneWayTrip.create({
                departure,
                destination,
                date,
                reason,
                created_by,
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
    };

}

module.exports = {
    OneWayTripController
}
