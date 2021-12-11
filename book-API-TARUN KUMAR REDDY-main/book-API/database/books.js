const mong = require("mongoose");
//book schema
const bookSchema = mong.Schema(
    {
        ISBN:String,
        title:String,
        pubDate:String,
        language:String,
        numPage:Number,
        author:[Number],
        publications:[Number],
        category:[String]
    }
);

const bookModel= mong.model("books",bookSchema);
module.exports= bookModel;