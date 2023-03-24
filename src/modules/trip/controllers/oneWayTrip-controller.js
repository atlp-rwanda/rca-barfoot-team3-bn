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
            console.log('req', req.user)
            // const userId = req.user.id;

            const trip = await OneWayTrip.create({
                departure,
                destination,
                date,
                reason,
                accommodationId,
                // created_by: userId // Associate the trip with the authenticated user
            });

            res.status(201).json(trip);
        } catch (error) {
            console.log("error", error)
            res.status(400).json({ message: error.message });
        }
    };

}

module.exports = {
    OneWayTripController
}
