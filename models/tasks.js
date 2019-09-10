var mongoose = require('mongoose');

var tasksSchema = mongoose.Schema({
    name: String,
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    status: String,
    desc: String
});

var TasksModel = mongoose.model('Tasks', tasksSchema);

module.exports = TasksModel;