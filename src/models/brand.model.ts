import mongoose from "mongoose";


const brand_schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Brand name is required'],
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    logo:{
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
        required:[true,'brand logo is required']
    }
},{timestamps:true})


// brand model
const Brand = mongoose.model('brand',brand_schema);
export default Brand;