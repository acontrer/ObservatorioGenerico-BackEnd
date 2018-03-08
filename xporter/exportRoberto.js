var db = require('./db');
var fs = require('fs');
var writer = require('./writer.js');
var config = require('./config.js');
var proc = require('./proc.js');
var proc2 = require('./proc2.js');
var Doc = require("./document.js");
var data=require(process.argv[3]);
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({

		//host: "http://localhost:9200",
		//host: "http://www.observatoriopolitico.cl/elastic",
		host:config.index_host
		requestTimeout: 250000
	});
var totales=true;
var indexes="";
console.log(data.getFolder())
fs.mkdir(data.getFolder(),function(err,data){
	console.log(err)
})
console.log("-------")
if(process.argv[4]!=undefined){
	indexes=process.argv[4];
	fs.mkdir(data.getFolder()+"porMedio/",function(err,data){
	//console.log(err)
	})
	fs.mkdir(data.getFolder()+"porMedio/"+process.argv[4]+"/",function(err,data){
	//console.log(err)
	})
	data.setFolder(data.getFolder()+"porMedio/"+process.argv[4]+"/")
	totales=false;
	console.log("-"+process.argv[4]+"-");
}
else{
	if(data.getIndexes()!=null)
		indexes=data.getIndexes();
}
console.log(process.argv[2]);

	var queriesAll=data.getQueries();
//	var queriesAll=data.getTest();
	var mood=["menciones"]
	var matrix=new Object();

	var totalCount=new Object();
		console.log(indexes)
	f1(0,process.argv[2]+"_"+indexes,queriesAll[process.argv[2]],"s");

count=0;

function f1(index,name,queries,tipo){
	console.log("---->")
	console.log(name)
	if(index<queries.length)
		search2(name,queries[index],data.getSince(),data.getUntil(),function(err,docs){			
					console.log("xd")
					f1(index+1,name,queries,tipo)
			});
	else{
		console.log("fin")
		if(totales){
			writer.writeTotal(matrix,name+"_totales",data,"frecuency");
			writer.writeTotal(matrix,name+"_totales",data,"strengtn");
		}
		writer.writeFile(matrix["total"],name,data,data.getMetric())
		writer.writeFilePercent(matrix["total"],name+"p",data,data.getMetric())


	}
		
}


function search2(id,query,since,until,callback) {
		//if(query[0]=='"')
		if(true)
				operator={query_string: {
					 		"fields" : ["text","cleantext"],
							"query":query,
							// "analyze_wildcard":true
							//"type":"phrase"

					    }};
			else
				operator={multi_match :{
							"fields" : ["text","cleantext"],
							"query":query

					    }};
		
	

			client.search({
				
				index:config.index_name,
				type:indexes,
				 "from" : 0, "size" : 5000,
				scroll: '60s',
				search_type: 'scan',
				body:{

					"query": {
						"filtered":{
						"query":operator,
//						"analyze_wildcard":true,
						"filter":{

						    "bool" : {
						        "must" :[
    									{"range": { "created": { "gte": since,"lt": until }}},
    									//{"exists" : { "field" : "location" }}
						        	],

										
						} 	
					}
				}
					
						},
					

					}
			}
			, function getMoreUntilDone(error, response) {
				  // collect the title from each response
			  //	console.log(query+"----"+response.hits.total)
			  	var count=0;

			  	// totalCount[query]=0;
			  	if(response.hits!=undefined)
			  	response.hits.hits.forEach(function (doc) {
			  		console.log(query)
			  		
			  		var docu = new Doc(doc);
			  	
			  		docu.matchQuery(data);
				 
				  	if(docu.isOk())
				  	{
			  			docu.setStrength(query);
				 
						docu.setFrecuency();

						// SE CREA EL OBJETO PARA CADA MEDIO 
						if(matrix[doc["_type"]]==undefined)
							matrix[doc["_type"]]=new Object()

						// PARA EL MEDIO SELECCIONADO SE CREA LA FECHA EN CASO QUE NO ESTE
						if(matrix[doc["_type"]][docu.getDate()]==undefined)
							matrix[doc["_type"]][docu.getDate()]= new Object();
						//console.log(queries[index])
						// GUARDAR STRENGTH EN CAMPO STREGNHT Y AGREGAR UN CONTADOR DE FRECUENCOA COMO PARAMETRO
						if(matrix[doc["_type"]][docu.getDate()][query]==undefined)
							matrix[doc["_type"]][docu.getDate()][query]=new Object();

						if(matrix[doc["_type"]][docu.getDate()][query]["strengtn"]==undefined){
							matrix[doc["_type"]][docu.getDate()][query]["strengtn"]=docu.getVar("_strenghtn")
							
						}
						else
							matrix[doc["_type"]][docu.getDate()][query]["strengtn"]+=docu.getVar("_strenghtn")
						

						if(matrix[doc["_type"]][docu.getDate()][query]["frecuency"]==undefined)
							matrix[doc["_type"]][docu.getDate()][query]["frecuency"]=docu.getVar("frecuency")
						else
							matrix[doc["_type"]][docu.getDate()][query]["frecuency"]+=docu.getVar("frecuency")
					

		
						// PARA MATRIX total
						if(matrix["total"]==undefined)
							matrix["total"]=new Object()

							
						// PARA EL MEDIO SELECCIONADO SE CREA LA FECHA EN CASO QUE NO ESTE
						if(matrix["total"][docu.getDate()]==undefined)
							matrix["total"][docu.getDate()]= new Object();
					
						if(matrix["total"][docu.getDate()][query]==undefined)
							matrix["total"][docu.getDate()][query]=new Object();

						if(matrix["total"][docu.getDate()][query]["strengtn"]==undefined)							
							matrix["total"][docu.getDate()][query]["strengtn"]=docu.getVar("_strenghtn")
						else
							matrix["total"][docu.getDate()][query]["strengtn"]+=docu.getVar("_strenghtn")	
						if(docu.getVar("_strenghtn")==null)
							console.log("==================================== "+docu.getVar("_strenghtn"))


						if(matrix["total"][docu.getDate()][query]["frecuency"]==undefined)							
							matrix["total"][docu.getDate()][query]["frecuency"]=docu.getVar("frecuency")
						else
							matrix["total"][docu.getDate()][query]["frecuency"]+=docu.getVar("frecuency")	

					}
						
						if(totalCount[query]==undefined)
							totalCount[query]=1
						else
				  			totalCount[query]++;
					docu=null;
				  });

					console.log(totalCount[query]+"++"+response.hits.total)
					
					if(response.hits.total == totalCount[query]||response.hits.total==0){
						//ma.addCount();
						callback()
					}else{
						client.scroll({
					      scrollId: response._scroll_id,
					      scroll: '30s'
					    }, getMoreUntilDone);
					}



			  })



			}
		




function search3(id,query,since,until,callback) {

			var op ={
					"query_string" : {
						"query" : query
					}
			}
			

			client.count({
				
				index:"test",
				type:id,
				body:{
					"query": {
						"filtered":{
						"query":op,
					"filter":{
						    "bool" : {
						        "must" :[
    									{"range": { "created": { "gte": since,"lte": until }}},
    									//{"exists" : { "field" : "location" }}
						        	],
					
							} 	
						}
					}
					
					},
						
						

			}
		},function (error,resp) {
				
				countSearch(id,since,until,function(resp2){
					
					var out =new Object();
					out.id=id;
					out.totalQuery=resp.count;		
					out.total=resp2.count;
					callback(out)
				
				})
				
			

			});


			}


	function countSearch(id,since,until,callback) {

			client.count({
				
				index:"test",
				type:id,
				body:{
					"query": {
						"filtered":{
						
					"filter":{
						    "bool" : {
						        "must" :[
    									{"range": { "created": { "gte": since,"lte": until }}},
    									//{"exists" : { "field" : "location" }}
						        	],
					
							} 	
						}
					}
					
					},
				}
		},function (error,resp) {

				
				callback(resp);
			

			});


			}
