const { Accommodation, creationSchema } = require('./accommodation');
const { Room, createRoomSchema } = require('./rooms');

module.exports = {
  Accommodation,
  Room,
  creationSchema,
  createRoomSchema
};
