const express = require('express');
const router =  express.Router();
const https  = require('https');
const request = require('../controlls/request');

router.get('/',(req,res,next)=>{
    url = "https://yts.am/api/v2/list_movies.json?";
    parameters = "";
    if(req.query.limit){
        parameters += "limit="+req.query.limit;
    }
    if(req.query.page){
        parameters += "&page="+req.query.page;
    }
    if(req.query.quality){
        parameters += "&quality="+req.query.quality;
    }
    if(req.query.minimum_rating){
        parameters += "&minimum_rating="+req.query.minimum_rating;
    }
    if(req.query.query_term){
        parameters += "&query_term="+req.query.query_term;
    }
    if(req.query.genre){
        parameters += "&genre="+req.query.genre;
    }
    if(req.query.sort_by){
        parameters += "&sort_by="+req.query.sort_by;
    }
    if(req.query.order_by){
        parameters += "&order_by="+req.query.order_by;
    }
    if(req.query.with_rt_rating){
        parameters += "&with_rt_rating="+req.query.with_rt_rating;
    }
    console.log(url+parameters);
    request.request(url,res,function(data){
        res.status(200).json(data);
    });
})

router.get('/:movieID',(req,res,next)=>{
    id = req.params.movieID;
    parameters = "";
    if(req.query.movie_id){
        parameters += "&movie_id="+req.query.limit;
    }
    if(req.query.with_images){
        parameters += "&with_images="+req.query.with_images;
    }
    if(req.query.with_cast){
        parameters += "&with_cast="+req.query.with_cast;
    }

    url = "https://yts.am/api/v2/movie_details.json?movie_id="+id+"&with_images=true&with_cast=true";
    request.request(url,res,function(data){
        request.request(url,res,function(data){
            movie =  data.data.movie
            title = movie.title;
            title_long = movie.title_long;
            medium_cover_image = movie.medium_cover_image;
            year = movie.year;
            like_count = movie.like_count;
            rating = movie.rating;
            download_count = movie.download_count;
            description_full = movie.description_full;
            //GEnre Array
           genArray = movie.genres;
            genres = "";
            genArray.forEach(function(item,index){
                genres += item +" ";
            })

            //Torrents
            torrents = [];
            torrArray = movie.torrents;
            torrArray.forEach(function(item,index){
                torrents.push(item.quality);
            })
            //cast array
            cast = [];
            castArray = movie.cast;
            castArray.forEach(function(item,index){
                cast.push([item.name,item.character_name,item.url_small_image]);
            })
            //download torrents
            torrFiles = [];
            filesArray = movie.torrents;
            filesArray.forEach(function(item,index){
                torrFiles.push([item.quality,item.size,item.seeds,item.peers,item.url,item.hash]);
            })

            //Sugest Movies
            url2 = "https://yts.am/api/v2/movie_suggestions.json?movie_id="+id;
            //console.log(url2);
            request.request(url2,res,function(data2){
                movies = data2.data.movies;
                movieArr = []
                movies.forEach(function(item,index){
                    movieArr.push([item.medium_cover_image,"./movies/"+item.id])
                })
                
                res.render('movie', { title: title,
                    titleLong : title_long,
                    medium_cover_image:medium_cover_image,
                   year : year,
                   genre: genres,
                   like_count : like_count,
                   rating : rating,
                   download_count : download_count,
                   torrents : torrents,
                   description_full: description_full,
                   cast : cast,
                   torrFiles: torrFiles,
                   movieArr: movieArr});
            });
           
        });
    });
})


router.get('/suggest/:movieId',(req,res,next)=>{
    id = req.params.movieId;
    url = "https://yts.am/api/v2/movie_suggestions.json?movie_id="+id;
    request.request(url,res,function(data){
        request.request(url,res,function(data){
            res.render('index', { title: 'Hey', messages: JSON.stringify(data) });
        });
    });
})

router.get('/parent_guide/:movieId',(req,res,next)=>{
    id = req.params.movieId;
    url = "https://yts.am/api/v2/movie_parental_guides.json?movie_id="+id;
    request.request(url,res,function(data){
        res.render('index', { title: 'Hey', messages: JSON.stringify(data) });
    });
    
})


module.exports = router;


