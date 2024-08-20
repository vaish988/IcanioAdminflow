const mongoose = require('mongoose');
const CourseDetails = require('./coursedetail');
const assignmentSchema = new mongoose.Schema({
   tasks:[
    {
      task:  {
    type:String,
   },
} 
],

    link:{
        type:String,
    },
    coursedetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseDetails'
    }
});


const Assignment = mongoose.model('Assignment',assignmentSchema);
module.exports=Assignment;
