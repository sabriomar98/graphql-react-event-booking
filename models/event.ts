import mongoose, { Schema } from "mongoose";

const eventSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true
    }
);

const eventModel = mongoose.model("Event", eventSchema);

export default eventModel;
