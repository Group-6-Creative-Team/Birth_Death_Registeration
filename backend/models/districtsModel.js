import mongoose from "mongoose";

const disSchema= mongoose.Schema({
    id:{
        type : Number,
        require: true
    },
    discName:{
        type: String,
        require: true
    }
},
{
    timestamp: true
});

const District = mongoose.model('District', disSchema);
export default District