const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assignment_id: {type: Number, required: true},
    title: {type: String, required: true},
    type: {type: String, required: true},
    grade: {type: Number, required: true},
    class_id: {type: String, required: true},
    class_name: {type: String, required: true},
    studnet_id: {type: String, required: true},
}, {collection: 'Assignments'});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports= {Assignment};
