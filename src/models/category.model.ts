import mongoose from "mongoose";


const category_schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Category name is required'],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:{
            public_id:{
                type:String,
                required:[true,'public id is required']
            },
            path:{
                type:String,
                required:[true,'path is required']
            }
        },
        required:[true,'category image is required']
    }
},{timestamps:true})


// category model
const Category = mongoose.model('category',category_schema);
export default Category;