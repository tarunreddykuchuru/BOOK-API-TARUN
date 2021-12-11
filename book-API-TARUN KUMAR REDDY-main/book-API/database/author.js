const mong = require("mongoose");
//author schema
const autSchema = mong.Schema(
    {
        id:Number,
        name:String,
        books:[String]
    }
);

const autModel= mong.model("author",autSchema);
module.exports= autModel;