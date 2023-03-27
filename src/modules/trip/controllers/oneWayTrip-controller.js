const { OneWayTrip } = require("../model");

class OneWayTripController {
    /**
     * @param {Express.Request} req
     * @param {Express.Response} res
     *  @returns {*} created accommodation
    */
    static async createOneWayTrip(req, res) {
        try {
            const { destination, departure, date, reason, accomodationId } = req.body;

            const created_by =req.user.id
            // Create the new trip
            const trip = await OneWayTrip.create({
                destination,
                departure,
                date,
                reason,
                accomodationId,
                created_by
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
