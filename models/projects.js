const mongoose=require('mongoose');

const ProjectSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    skills:{
        type:String,
        required:true
    },

    budget:{
        type: Number,
        required:true
    }
});

const Project=module.exports=mongoose.model('Project',ProjectSchema);