const { Accommodation, creationSchema } = require('./accommodation');
const { Room, createRoomSchema } = require('./rooms');
const { Like } = require('./likes')
module.exports = {
  Accommodation,
  Room,
  Like,
  creationSchema,
  createRoomSchema
};
