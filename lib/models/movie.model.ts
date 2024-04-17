import { Schema, model, models } from "mongoose";

const MovieSchema = new Schema({
    title: {type: String, required: true},
    plot: {type: String, required: true},
    cast: {type: [String], required: true},
    embedding: {type: [Number], required: true},
});

const Movie = models?.Movie || model("Movie", MovieSchema);

export default Movie;