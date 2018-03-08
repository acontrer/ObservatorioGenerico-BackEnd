db = require('../db.js');
var	config = require('../config.js');	
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
		host: config.index_host,
		requestTimeout: 90000,
	});
var news = require('../news.js');
var later = require('later');

// var textSched = later.parse.text('every 1 minutes');
// var timer = later.setTimeout(logTime, textSched);
// var timer2 = later.setInterval(logTime, textSched);

var newsSched = later.parse.text('every 30 seconds');
// later.setTimeout(indexingNews, newsSched);
later.setInterval(indexingNews, newsSched);

// function to execute
function logTime() {
 	console.log("Index News.....")

    indexingNews();
}

function logTime2() {
 	console.log("Index Tweets......")

     indexing();
}

function indexingNews(){

	news.getNews2(function(err,cursor){
	
		var objectsToIndex=new Array();
		var objectsToUpdate= new Array();
	
		cursor.each(function(err, n) {
			
			if(n!=null){
				objectsToUpdate.push(n._id);

				var tBody=new Object();
			
				tBody={
					index:
					{
					  _index: config.index_name,//observatory
					  _type: 'news', // ciclismo, politicos, etc
					  _id: n.name,		
					}
				}

	 			var body= {
				    text: n.text,
				    image: n.image,
				    title: n.title,
				    
				  }

				objectsToIndex.push(tBody);
				
				objectsToIndex.push(body)
				console.log("99999 - "+objectsToIndex.length)
				if(objectsToIndex.length==20){

					console.log("---------->")

					client.bulk({
						body: objectsToIndex
					}, function (err, resp) {
						console.log("asasdas")
						console.log(err)
						console.log(resp.items)
						if(err==undefined)
							// if(resp.errors!=true)
								news.updateNews(objectsToUpdate);
						db.close();
					});
				}

			}
			})
				


	})
}

function indexing(){
db.getCursorToIndex(function(err,cursor){


	var objectsToIndex=new Array();
	var objectsToUpdate= new Array();
	cursor.each(function(err, t) {
		//assert.equal(err, null);
		if(t!=null)
		if(t.id!=undefined){
			if(t.id.indexOf("{\"$numberLong\":")!=-1)
				t.id=t.id.replace("{\"$numberLong\":\"","").replace("\"}","")
			
			if(t.mood=="?")
				t.mood="objetivo";
			objectsToUpdate.push(t._id);

			var tBody=new Object();
			tBody={
				index:
				{
				  _index: config.index_name,//observatory
				  _type: 'tweet', // ciclismo, politicos, etc
				  _id: t.id,
				
				}
			}
			if(t.mLocation!=null)
				t.location=t.mLocation
			else if(t.uLocation!=null)
				t.location=t.mLocation;
			var u=findUrls(t.text);
			// console.log(u)
			var body= {
				    text: t.text,
				  //  cleantext: t.cleantext,
				    created: t.created,
				    autor:t.autor,
				    mood:t.mood,
				    media:t.media,
				    location:t.location,
				    url:findUrls(t.text)
				  }
			objectsToIndex.push(tBody);
			objectsToIndex.push(body)


		}

		if(objectsToIndex.length==config.index_count){
			console.log("---------->")
			client.bulk({
				body: objectsToIndex
			}, function (err, resp) {
				
				console.log("function");
		
				if(err==undefined)
					if(resp.errors==false)
						db.updateTweet(objectsToUpdate);

					db.close();
			
				// return null
			});
			

			objectsToIndex=new Array();
		}
	})

})
}

function findUrls( text )
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {

        var token = matchArray[0];
        // console.log(token)
        if(token=="http://t"||token=="http://t.c"|| token=="http://t.co"|| token=="http://t.co/"||token=="https://t"||token=="https://t.c"|| token=="https://t.co"|| token=="https://t.co/")
        ;
        urlArray.push( token );
    }

    return urlArray;
}