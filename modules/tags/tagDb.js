import mongoose from "mongoose";
import connect from '../Connection/db.js';
import { ObjectId } from "mongodb";

//const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_ATLAS}`;

//set up Schema and model
// https://mongoosejs.com/docs/index.html
const TagSchema = new mongoose.Schema({
    TagName: String,
    Color: String,
    CreatedDate: { type: Date, default: Date.now },
},
    { collection: "tag" }
);

const Tag = mongoose.model("Tag", TagSchema);

// funtion to add some initial movies to the DB(look at documents and queries, API/model)
async function initializeTags() {
    await connect();
    const tagList = [
        {
            "TagName": "Template",
            "Color": "This is a color code for the tag",
            "CreatedDate": new Date(),
        },
        
    ];
    await Tag.insertMany(tagList);
    // Model.insertMany()
}


async function addTag(nTag, nColor, nCreatedDate) {
    await connect();
    let newTag = {
        "TagName": nTag,
        "Color": nColor,
        "CreatedDate": nCreatedDate,
    };
    let test = await Tag.create(newTag);
    return test;
}

// GREEN(industry) #28A745
// RED(highlight) #FF69B4
// YELLOW(technique) #FFC107


async function getTags() {
    await connect();
    // for sort(), you can use "asc", "desc", (or 1, -1)
    return await Tag.find({}).sort({ CreatedDate: 1 }); 
}

async function getOneTag(id) {
    await connect();
    return await Tag.findById(id).exec(); 
}

async function updateTag(filter,updatedTag) {
    await connect();
    let updTag = {
        "TagName": updatedTag.TagName,
        "Color": updatedTag.Color,
    };
    return await Tag.updateOne(filter,{ $set: updTag }); 
}


//function: deleteOne()
async function deleteTag(id) {
    await connect();
    let filter = { _id: new ObjectId(id) };
    await Tag.deleteOne(filter);
}

//function: deleteMany()
async function reset() {
    await connect();
    await Tag.deleteMany({});
}



const tagFunc = {
    getTags,
    initializeTags,
    addTag,
    reset,
    deleteTag,
    getOneTag,
    updateTag,
    // export tags
    Tag, 
    TagSchema
}

export default tagFunc;

