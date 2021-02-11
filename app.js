const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");



const app=express();
app.set("view engine","ejs");

app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser:true, useUnifiedTopology:true});

const articleSchema={
  title:String,
  content:String
};

const Article=mongoose.model("Article",articleSchema);
app.route("/articles")
.get(function(req,res){

Article.find(function(err,foundarticles){
  if(!err){
    res.send(foundarticles);
  }
  else{
    res.send(err);
  }
});
})
.post(function(req,res){
  const newArticle =new Article({
    title:req.body.title,
    content:req.body.content
  });
newArticle.save(function(err){
  if(!err){
  res.send("succesfully added a new article");
  }else{
  res.send("failed to add a new article");
  }
});
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("succesfully deleted");
    }
    else{
      res.send(err);
    }
  })
});


app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundarticles){
    if(foundarticles){
      res.send(foundarticles);
    } else{
      res.send("No articles matching your search was found");
    }
  })
})
.put(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title, content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("succesfully updated the article");
      }
    }
  )
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(!err){
        res.send("succesfully updated the article")
      }else{
        res.send(err);
      }
    }
  )
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("succesfully deleted")
      }else{
        res.send(err)
      }
    }
  )
})

app.listen(3000,function(){
  console.log("server is running on Port 3000");
});
