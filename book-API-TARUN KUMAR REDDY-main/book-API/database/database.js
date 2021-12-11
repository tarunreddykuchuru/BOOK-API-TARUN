const books=[
    {
        ISBN:"12345book",
        title:"Tesla",
        pubDate:"2021-08-05",
        language:"en",
        numPage:250,
        author:[1,2],
        publications:[1],
        category:["tech","space","education"]
    }
]
const author=[
    {
        id:1,
        name:"bhanu",
        books:["12345book","dummybook"]
    },
    {
        id:2,
        name:"venu",
        books:["12345book"]
    }
]
const publication=[
    {
        id:1,
        name:"writex",
        books:["12345book"]
    },
    {
        id:2,
        name:"writex2",
        books:[]
    }
]
module.exports={books,author,publication};