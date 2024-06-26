const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    description: {
        type: String,

    },
    file: {
        type: String,

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Document = mongoose.model("Document", DocumentSchema);
module.exports = Document