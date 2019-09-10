let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(express.static("images"));
app.use(express.static("css"));

let Tasks = require('./models/tasks');
let Developer = require('./models/developer');

const url = "mongodb://localhost:27017/tasksDB";
let viewsPath = __dirname + "/views/";

mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
});

app.get("/", (req, res) => {
    res.sendFile(viewsPath + "index.html");
});

app.get("/newdeveloper", (req, res) => {
    res.sendFile(viewsPath + "newdeveloper.html");
});

app.post("/newdeveloper", (req, res) => {
    let data = req.body;
    Developer.create({
        name: {
            firstName: data.firstname,
            lastName: data.lastname
        },
        level: data.level.toUpperCase(),
        address: {
            state: data.state,
            suburb: data.suburb,
            street: data.street,
            unit: data.unit
        }
    }, function (err) {
        if (err) console.log(err);
        //res.send("Developer created");
        res.redirect('/listdevelopers');
    })
});

app.get("/newtask", (req, res) => {
    res.sendFile(viewsPath + "newtask.html");
});

app.post("/newtask", (req, res) => {
    let data = req.body;
    Tasks.create({
        name: data.taskname,
        assignTo: mongoose.Types.ObjectId(data.assignto),
        dueDate: data.taskdue,
        status: data.taskstatus,
        desc: data.taskdesc
    }, function (err) {
        if (err) console.log(err);
        //res.send("Task created");
        res.redirect('/listtasks');
    })
});

app.get("/listtasks", (req, res) => {
    Tasks.find({}, function (err, data) {
        res.render('listtasks.html', { taskDB: data });
    })
});

app.get("/listdevelopers", (req, res) => {
    Developer.find({}, function (err, data) {
        res.render('listdevelopers.html', { developerDB: data });
    })
});

app.get('/updatetask', function (req, res) {
    res.sendFile(viewsPath + "updatetask.html");
});

app.post('/updatetask', function (req, res) {
    Tasks.updateMany({  _id: mongoose.Types.ObjectId(req.body.taskID) }, { $set: { status: req.body.taskstatus } }, function (err, doc) {
        console.log(doc);
    });
    res.redirect("/listtasks");
});

app.get('/deletetask', function (req, res) {
    res.sendFile(viewsPath + "deletetask.html");
});

app.post('/deletetask', function (req, res) {
    Tasks.deleteMany({ _id: mongoose.Types.ObjectId(req.body.taskID) }, function (err, doc) {
        console.log(doc);
    });    
    res.redirect("/listtasks");
});

app.get('/deleteall', function (req, res) {
    res.sendFile(viewsPath + "deleteall.html");
});

app.post('/deleteall', function (req, res) {
    Tasks.deleteMany({ status: "Complete" }, function (err, doc) {
        console.log(doc);
    });
    res.redirect("/listtasks");
});

app.get("/list3tasks", (req, res) => {
    Tasks.find({ status: "Complete" }).sort({name: -1}).limit(3).exec(function (err, docs) {
        res.render('listtasks.html', { taskDB: docs })
    })
});

app.listen(8080);