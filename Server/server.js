require('dotenv').config({ path: 'config.env' });
const express = require('express');
const app = express();
const cors = require("cors");
const {database} = require("./database");
const { Assignment } = require('./models/assignments');
const {Student} = require('./models/students');
const {Class} = require('./models/classes');
const { User } = require('./models/users');

database()

app.use(express.json());
app.use(cors());

app.post('/api/auth', async (req, res) => {
    try {
        const {error} = authValidate(req.body);
        if (error) {
            return res.status(400).send({message: error});
        }
        var user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.status(401).send({message: "Invalid email or password"});
        }
        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );
        if (!validPassword) {
            return res.status(401).send({message: "Invalid email or password"});
        }
        const token = user.generateAuthToken();
        res.status(200).send({token: token, user: user, message: "Login Successful!"})
    } catch(e) {
        res.status(500).send({message: "Internal Server Error", error: e});
    }
});

app.post('/api/assignment/new', async (req, res) => {
    try {
        console.log("reqbody in assignment: ", req.body);
        const assignments = await Assignment.insertMany([{...req.body}]);
        console.log("assignment: ", assignments);
        res.status(200).send({message: 'assignment successfully created!'})
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/assignment/assignments', async (req, res) => {
    try {
        const assignemnts = await Assignment.find({});
        res.status(200).send({message: 'New student successfully created!', data: assignemnts});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/assignemnt/:id/student', async (req, res) => {
    try {
        const assignment = await Assignment.find({student_id : req.params.id})
        res.status(200).send({message: 'assignment successfully created!', data: assignment});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/assignment/:id/class', async (req, res) => {
    try {
        const assignment = await Assignment.find({class_id : req.params.id})
        res.status(200).send({message: 'assignment successfully retrieved!', data: assignment});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.patch('/api/assignemnt/update', async (req, res) => {
    try {
        const assignment = await Assignment.updateMany({assignment_id : req.body.student_id}, ...req.body.data);
        res.status(200).send({message: 'assignment successfully created!', data: assignment});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.delete('/api/assignment/delete', async (req, res) => {
    try {
        const assignment = await Assignment.deleteMany({assignment_id : req.body.student_id});
        res.status(200).send({message: 'assignment successfully created!', data: assignment});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.post('/api/student/new', async (req, res) => {
    try {
        console.log(req.body);
        const students = await Student.create({...req.body});
        console.log('new studentL: ', students);
        res.status(200).send({message: 'New student successfully created!', data: students});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/student/students', async (req, res) => {
    try {
        const student = await Student.find({});
        console.log("students: ", student);
        res.status(200).send({message: 'New student successfully created!', data: student});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/class/:class_id/class', async (req, res) => {
    try {
        const students = await Class.findOne({_id: req.params.class_id});
        res.status(200).send({message: 'New class successfully created!', data: students});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});


app.delete('/api/student/delete', async (req, res) => {
    try {
        const student = await Student.deleteOne({_id : req.body.student_id});
        res.status(200).send({message: 'student successfully deleted!', data: student});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.patch('/api/student/grade', async (req, res) => {
    try {
        const grade = await Student.findOneAndUpdate(
            {_id : req.body.student_id},
            {"grades": req.body.data}
        );
        res.status(200).send({message: 'New Grade successfully created!', data: grade});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.patch('/api/student/update', async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate({_id : req.body.student_id}, {...req.body.data});
        res.status(200).send({message: 'New Grade successfully created!', data: student});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.post('/api/class/new', async (req, res) => {
    try {
        const newClass = await Class.create({...req.body});
        res.status(200).send({message: 'New class successfully created!', data: newClass});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/class/classes', async (req, res) => {
    try {
        const classes = await Class.find({});
        console.log("classes: ", classes);
        res.status(200).send({message: 'New class successfully created!', data: classes});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/class/:class_id/class', async (req, res) => {
    try {
        const classes = await Class.findOne({_id: req.params.class_id});
        res.status(200).send({message: 'New class successfully created!', data: classes});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.get('/api/student/:id/student', async (req, res) => {
    try {
        const students = await Student.findOne({_id: req.params.id});
        res.status(200).send({message: 'New class successfully created!', data: students});
    } catch (e){
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});

app.patch('/api/class/student', async (req, res) => {
    try {
        const students = await Class.updateOne(
            {_id : req.body.class_id},
            {$push:{ students: req.body.data}}
        );
        console.log('students: ', students);
        res.status(200).send({message: 'New Grade successfully created!', data: students});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e; 
    }
});

app.delete('/api/class/delete', async (req, res) => {
    try {
        const classes = await Class.deleteOne({_id : req.body.class_id});
        res.status(200).send({message: 'student successfully deleted!', data: classes});
    } catch (e) {
        res.status(500).send({message: "Internal Server Error", error: e });
        throw e;
    }
});



const port = process.env.PORT || 3050;
app.listen(port, () => console.log(`Listening on port ${port}...`))