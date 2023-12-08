const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    grades: { class_id: {type: Number}, class_name: {type: String}, grade: {type: Number} } 
}, {collection: 'Students'});

const Student = mongoose.model("Student", studentSchema);

module.exports= {Student};