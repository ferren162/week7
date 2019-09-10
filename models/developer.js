var mongoose = require('mongoose');

var developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        validate: {
            validator: function (level) {
                return status === "Beginner" || status === "Expert";
            },
            message: 'Level should be Beginner or Expert'
        },
        required: true
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number
    }
});

var DeveloperModel = mongoose.model('Developer', developerSchema);

module.exports = DeveloperModel;