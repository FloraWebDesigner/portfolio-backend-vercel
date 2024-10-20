import mongoose from "mongoose";
import connect from '../Connection/db.js';
import { ObjectId } from "mongodb";
import tagFunc from '../tags/tagDb.js';
const { Tag } = tagFunc;

//const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_ATLAS}`;

//set up Schema and model
// https://mongoosejs.com/docs/index.html
const ProjSchema = new mongoose.Schema({
    ProjectName: String,
    Desc: String,
    Tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    Img: String,
    Link: String,
    Repo: String,
    CreatedDate: { type: Date, default: Date.now },
},
    { collection: "projects" });
// above, you could pass the collection name in an options object to specify a specific collection to associate with the pet model
// the name of the model
const Project = mongoose.model("Project", ProjSchema);



// funtion to add some initial movies to the DB(look at documents and queries, API/model)
async function initializeProjects() {
    await connect();
    let tag = await Tag.findOne({ TagName: "Template Tag" });
    if (!tag) {
        tag = await Tag.create({ TagName: "Template Tag" });
    }

    const projectList = [
        {
            ProjectName: "Template Project",
            Desc: "This is a template project for users to edit",
            Tags: [tag._id],
            Img: "placeholder.png",
            Link: "http://www.google.com",
            Repo: "http://www.google.com",
            CreatedDate: new Date('2024-01-01'),
        }
        // {
        //     ProjectName: "Easy Parking",
        //     Desc: "An application for monitoring vehicle parking in a small outdoor parking lot",
        //     Tag: "JavaScript",
        //     Img: "easyParking.png",
        //     Link: "http://www.google.com",
        //     Repo: "http://www.google.com",
        //     CreatedDate: new Date('2024-07-28'),
        // },
        // {
        //     ProjectName: "Merry Christmas",
        //     Desc: "A Christmas theme page with a snowflake background of user choice",
        //     Tag: "CSS Animation",
        //     Img: "Snowflake.png",
        //     Link: "http://www.google.com",
        //     Repo: "http://www.google.com",
        //     CreatedDate: new Date('2024-08-10'),
        // }
    ];
    await Project.insertMany(projectList);
    // Model.insertMany()
}


async function addProject(newProject) {
    await connect();

    let tags = Array.isArray(newProject.Tags) 
        ? await Tag.find({ _id: { $in: newProject.Tags.map(id => new mongoose.Types.ObjectId(id)) } }) 
        : [];

    let projectData = {
        ProjectName: newProject.ProjectName,
        Desc: newProject.Desc,
        Tags: tags.map(tag => tag._id), 
        Img: newProject.Img,
        Link: newProject.Link,
        Repo: newProject.Repo,
        CreatedDate: newProject.CreatedDate,
    };
    await Project.create(projectData);
}


async function getProjects() {
    await connect();
    // for sort(), you can use "asc", "desc", (or 1, -1)
    return await Project.find({}).populate('Tags').sort({ CreatedDate: -1 }); 
}

async function getOneProj(id) {
    await connect();
    return await Project.findById(id).populate('Tags').exec(); 
}

async function updateProj(filter,updatedProj) {
    await connect();
    console.log("Inside updateProj:", updatedProj);
    let tags = Array.isArray(updatedProj.Tag) 
        ? await Tag.find({ _id: { $in: updatedProj.Tag.map(id => new mongoose.Types.ObjectId(id)) } }) 
        : [];
        console.log("Selected Tags:", tags);
    let updateFields = {
        "ProjectName": updatedProj.ProjectName,
        "Desc": updatedProj.Desc,
        "Tags": tags.map(tag => tag._id),
        //"Img": updatedProj.Img,
        "Link": updatedProj.Link,
        "Repo": updatedProj.Repo,
    };
    console.log("Update Fields:", updateFields);
    if (updatedProj.Img) {
        updateFields.Img = updatedProj.Img;
    }
    return await Project.updateOne(filter,{ $set: updateFields }); 
}


//function: deleteOne()
async function deleteProj(id) {
    await connect();
    let filter = { _id: new ObjectId(id) };
    await Project.deleteOne(filter);
}

//function: deleteMany()
async function reset() {
    await connect();
    await Project.deleteMany({});
}


const projFunc = {
    getProjects,
    initializeProjects,
    addProject,
    reset,
    deleteProj,
    getOneProj,
    updateProj,
    Project,
    ProjSchema
}

export default projFunc;