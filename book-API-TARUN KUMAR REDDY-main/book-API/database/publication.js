const mong = require("mongoose");
//publication schema
const pubSchema = mong.Schema(
    {
        id:Number,
        name:String,
        books:[String]
    }
);

const pubModel= mong.model("publication",pubSchema);
module.exports= pubModel;