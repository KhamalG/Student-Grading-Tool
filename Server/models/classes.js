const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {type: String, required: true},
    department: {type: String, required: true},
    students: {type: [{
        student_id: {type: String, required: true},
        student_name: {type: String, required: true},
       
    }], },
}, {collection: 'Classes'});

const Class = mongoose.model("Class", classSchema);

module.exports= {Class};

