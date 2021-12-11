require("dotenv").config();
const ex = require("express");
const db = require("./database/database");
var bodyParser= require("body-parser");
const mong= require("mongoose");
const bookModel=require("./database/books");
const autModel=require("./database/author");
const pubModel=require("./database/publication");
//initilise
booky = ex();
booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());
mong.connect(process.env.mongo_url,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then(()=>console.log("connection established"));
/*
route        /
description  get all books
access       public
parameter    none
methods      get
*/
booky.get("/",async (req,res)=>{
    const getallbooks= await bookModel.find();
    return res.json(getallbooks);
})
booky.listen(3000,() => {
    console.log("Running!!");
});
/*
route        /is
description  get specific book
access       public
parameter    isbn
methods      get
*/
booky.get("/is/:isbn",async (req,res)=>{
    const spebook= await bookModel.findOne({ISBN:req.params.isbn});
    if(!spebook)
    {
        return res.json({error: `No book found with ISBN : ${req.params.isbn}`});
    }
    return res.json({book:spebook});
})
/*
route        /c
description  get list of based on category
access       public
parameter    cat
methods      get
*/
booky.get("/c/:cat",async (req,res)=>{
    const catbook= await bookModel.findOne({category:req.params.cat});
   
    if(!catbook)
    {
        return res.json({error: `No book found with category : ${req.params.cat}`});
    }
    return res.json({book:catbook});
})
/*
route        /aut
description  get all authors
access       public
parameter    none
methods      get
*/
booky.get("/aut",async (req,res)=>{
    const getallaut= await autModel.find();
    return res.json(getallaut);
})
/*
route        /aut/book/
description  get list of authors based on books
access       public
parameter    isbn
methods      get
*/
booky.get("/aut/book/:isbn",(req,res)=>{
    const speaut=db.author.filter((auth)=>auth.books.includes(req.params.isbn));
    if(speaut.length === 0)
    {
        return res.json({error: `No book found with category : ${req.params.isbn}`});
    }
    return res.json({authors:speaut});
})
/*
route        /pub
description  get ll publications
access       public
parameter    none
methods      get
*/
booky.get("/pub",async (req,res)=>{
    const getallpub= await pubModel.find();
    return res.json(getallpub);
})
/*
route        /book/new
description  add new book
access       public
parameter    none
methods      post
*/
booky.post("/book/new",async (req,res)=>{
    const {newbook}=req.body;
    const addbook=bookModel.create(newbook);
    return res.json({books:addbook,message:"book added !"});
    // db.books.push(newbook);
    // return res.json({updatedbookds:db.books});
})
/*
route        /aut/new
description  add new author
access       public
parameter    none
methods      post
*/
booky.post("/aut/new",async (req,res)=>{
    const {newaut} = req.body;
    const addaut=autModel.create(newaut);
    return res.json({authors:addaut,message:"added successfullu!"});
    // db.author.push(newaut);
    // return res.json({updatedauthors:db.author});
})
/*
route        /pub/new
description  add new publication
access       public
parameter    none
methods      post
*/
booky.post("/pub/new",(req,res)=>{
    const newpub=req.body;
    db.publication.push(newpub);
    return res.json({updatedpublicationss:db.publication});
})

/*
route        /book/update/
description  update book on isbn
access       public
parameter    isbn
methods      put
*/
booky.put("/book/update/:isbn",async (req,res)=>{
    const upbook=await bookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title:req.body.booktitle
        },
        {
            new:true
        }
    );
    return res.json({book:upbook})
})
/*
route        /book/aut/update/
description  update publication
access       public
parameter    isbn
methods      put
*/
booky.put("/book/aut/update/:isbn",async (req,res)=>{
    const upbook= await bookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn
        },
        {
            $addToSet:{
                author:req.body.newaut
            }
        },
        {
            new:true
        }
    );
    const upaut=await autModel.findOneAndUpdate(
        {
            id:req.body.newaut
        },
        {
            $addToSet:{
                books:req.params.isbn
            }
        },
        {
            new:true
        }

    );
    return res.json({books:upbook,author:upaut})
})

/*
route        /pub/update/book/
description  update publication
access       public
parameter    isbn
methods      put
*/

booky.put("/pub/update/book/:isbn",(req,res)=>{
    //update publication db
    db.publication.forEach((pu)=>{
        if(pu.id === req.body.pubid)
        {
            return pu.books.push(req.params.isbn);
        }
    });
    db.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn)
        {
            book.publications=req.body.pubid;
            return;
        }
    });
    return res.json({books: db.books,publications:db.publication,message:"updated successfully"});
})
/*
route        /book/del/
description  delete a book
access       public
parameter    isbn
methods      delete
*/
booky.delete("/book/del/:isbn",async (req,res)=>{
    const upbooks=await bookModel.findOneAndDelete(
        {
            ISBN:req.params.isbn
        }
    );
    return res.json({books:upbooks})
})

/*
route        /book/del/
description  delete a book
access       public
parameter    isbn
methods      put
*/
booky.delete("/book/del/:isbn",(req,res)=>{
    const upbook=db.books.filter((book)=>book.ISBN !== req.params.isbn);
    db.books=upbook;
    return res.json({books: db.books});
})

/*
route        /book/del/aut
description  delete author from book and realated book from author
access       public
parameter    isbn,autid
methods      put
*/
 booky.delete("/book/del/aut/:isbn/:autid",(req,res)=>{
     const upbook=db.books.forEach((book)=>{
         if (book.ISBN === req.params.isbn){
             const upaut=book.author.filter((aut)=>aut !==parseInt(req.params.autid));
             book.author=upaut;
             return;
         }
     })
     const upauthor=db.author.forEach((aut)=> {
         if(aut.id=== parseInt(req.params.autid)){
             const newbook= aut.books.filter((book)=> book!== req.params.isbn);
             aut.books=newbook;
             return;
         }
     })
     return res.json({books:db.books,authors:db.author,message: "successful!!" });
 })