let express = require('express');
let mongodb = require('mongodb');
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

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";
let viewsPath = __dirname + "/views/";

let db = null;
let col = null;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("week6lab");
            col = db.collection('tasks');
        }
    });

app.get("/", (req, res) => {
    res.sendFile(viewsPath + "index.html");
});

app.get("/newtask", (req, res) => {
    res.sendFile(viewsPath + "newtask.html");
});

app.post("/newtask", (req, res) => {
    let id = Math.round(Math.random() * 100);
    let data = req.body;
    //db.push({ _id: id, name: data.taskname, assign: data.assignto, due: data.taskdue, status: data.taskstatus, desc: data.taskdesc});
    col.insertOne({ _id: id, name: data.taskname, assign: data.assignto, due: data.taskdue, status: data.taskstatus, desc: data.taskdesc});
    res.redirect('/listtasks');
});

app.get("/listtasks", (req, res) => {
    col.find({}).toArray(function (err, data) {
        res.render('listtasks.html', { taskDB: data });
    });
});

app.get('/updatetask', function (req, res) {
    res.sendFile(viewsPath + "updatetask.html");
});

app.post('/updatetask', function (req, res) {
    col.updateOne({ _id: Number(req.body.taskID) }, { $set: { status: req.body.taskstatus } });
    res.redirect("/listtasks");
});

app.get('/deletetask', function (req, res) {
    res.sendFile(viewsPath + "deletetask.html");
});

app.post('/deletetask', function (req, res) {
    col.deleteOne({ _id: Number(req.body.taskID) });
    res.redirect("/listtasks");
});

app.get('/deleteall', function (req, res) {
    res.sendFile(viewsPath + "deleteall.html");
});

app.post('/deleteall', function (req, res) {
    col.deleteMany({ status: "Complete"});
    res.redirect("/listtasks");
});

app.get('/deleteOldComplete', function (req, res) {
    res.sendFile(viewsPath + "deleteoldcomplete.html");
});

app.post('/deleteOldComplete', function (req, res) {
    let today = "2019-09-03";
    let query = {$and: [{status: "Complete"}, {due: {$lt: today}}]};
    col.deleteMany(query);
    res.redirect("/listtasks");
});

app.listen(8080);