const express=require('express');
const {HotelController}=require('../controller')
const router=express.Router();

/**
 * @swagger
 * /api/v1/hotels:
 *  get:
 *    tags:
 *      - Hotel
 *    description: get all  hotels
 *    responses:
 *      200:
 *        description: An array of hotels
 *      400:
 *        description: Bad Request

 */
router.get('/',HotelController.getAll);
/**
 * @swagger
 * /api/v1/hotels/{id}:
 *   get:
 *     tags:
 *       - Hotel
 *     description: Returns a single hotel by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Hotel ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single hotel
 */
router.get('/:id',HotelController.getOne);
/**
 * @swagger
 * /api/v1/hotels/{id}/rooms:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Get all rooms of a hotel by ID.
 *     description: Returns a list of all rooms of a hotel specified by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the hotel to get rooms from.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with a list of all rooms of a hotel.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Room'
 *       400:
 *         description: Bad request error if the hotel ID is not valid.
 *       404:
 *         description: Not found error if the hotel with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/rooms',HotelController.getRooms);
/**
 * @swagger
 * /api/v1/hotels/{id}/rooms/{roomId}:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Get a room of a hotel by ID and room ID.
 *     description: Returns a single room of a hotel specified by both hotel ID and room ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the hotel to get the room from.
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: roomId
 *         description: ID of the room to get.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the requested room.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Room'
 *       400:
 *         description: Bad request error if the hotel ID or room ID is not valid.
 *       404:
 *         description: Not found error if the hotel or room with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id/rooms/:roomId',HotelController.getRoom);

module.exports=router