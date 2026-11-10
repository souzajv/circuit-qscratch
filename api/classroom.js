const { backend } = require("../server/firebase.cjs");
const { createClassroomHandler } = require("../server/classroom/handler.cjs");
module.exports = createClassroomHandler(backend);
