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
    status: {
        type: String,
        validate: {
            validator: function (status) {
                return status === "InProgress" || status === "Complete";
            },
            message: 'status should be InProgress or Complete'
        }
    },
    desc: String
});

var TasksModel = mongoose.model('Tasks', tasksSchema);

module.exports = TasksModel;