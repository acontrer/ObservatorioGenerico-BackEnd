var db = require('./db');
var fs = require('fs');
var Excel = require("exceljs");
var	config = require('./config.js');
var proc2 = require('./proc2.js');
// var data = require('./data.js');
var data = require('./data-General-Mayo.js');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
		host: "http://localhost:9200",
		requestTimeout: 250000,
	});

var services=["timeSerie"];

var sumatoriaConceptos=new Object();

var mood=["total","lanacion","emol","ltpaper","mediosregionales","lasegunda","inversiones","legal","elmostrador"]


var queriesAll=data.getQueries();
// var queriesAll=data.getTest();
// var graficos=data.getSumatorias();
// var cruzados=data.getCruzados();

// console.log(data.getAllQueries())
//start(queriesAll,true);
// sleep(1000*60*2)
// start(graficos,false);
// sleep(1000*60*2)
// start(cruzados,false);
	
var all=data.getAllQueries();
// console.log(all.join(" OR "))
search3("",all.join(" OR "),new Date("2016-03-01"),new Date("2016-04-01"),function(err,docs){
	// console.log(docs) 
})
function start(queries,totales){

	for(topic in queries){
		
		(function(index){

			// console.log(index)

			lll(index,queries[index],mood,topic,totales);

		})(topic)
	}
}

function lll(name,queries,moods,topic,totales){

	var matrix=new Object();
	
	for(var j=0;j<queries.length;j++){

		(function(index){

			search2("aa",queries[index], new Date("2016-05-01"),new Date("2016-05-31"),function(err,docs){
				
				for(var j=0;j< moods.length;j++){
					
					var tipo=moods[j];
					
					for(var i=0;i<docs["timeSerie"]["data"].length;i++){
					
						if(matrix[tipo]==undefined)
							matrix[tipo]=new Object()

						if(matrix[tipo][docs["timeSerie"]["data"][i]["date"]]==undefined)
							matrix[tipo][docs["timeSerie"]["data"][i]["date"]]= new Object();

						if(docs["timeSerie"]["data"][i][tipo]==undefined)
							matrix[tipo][docs["timeSerie"]["data"][i]["date"]][queries[index]]=0
						else
							matrix[tipo][docs["timeSerie"]["data"][i]["date"]][queries[index]]=docs["timeSerie"]["data"][i][tipo]	

					}

				}
				setTimeout(function(){
				if(index==queries.length-1){
					
					writeFile(matrix["total"],name+"");
					if(totales)
					writeTotal(matrix,name+"_totales");
				}
	},40000)
				
					
					
			});
		})(j);
	}
}

function writeTotal(matrix,name){

	var totales=new Object();
	var str="";
	var str2="";
	var headers=Object();
	var total=new Object();

				for(tipo in matrix){
					// console.log(tipo)
					for(date in matrix[tipo]){
						// console.log(date)
						for(topic in matrix[tipo][date]){
							// console.log(topic)
							str+=","+topic
							headers[topic]=1;

						}
					}
				}
				for(tipo in matrix){
					for(date in matrix[tipo]){
						for(topic in matrix[tipo][date]){	
							
								if(total[tipo]==undefined)
									total[tipo]=new Object();

								if(total[tipo][topic]==undefined)
									total[tipo][topic]=0;
									
								total[tipo][topic]+=matrix[tipo][date][topic];
							// }
						}
					}
				}

				// console.log(total)

				var stream2= fs.createWriteStream("out/totales/total_"+name+'.csv', {flags: 'w'})	
				
				stream2.write(" ")
				for(topic in headers)	
					stream2.write(","+topic)
					


				for(index in total){
					stream2.write("\n")
					stream2.write(index)
					for(topic in headers){
						stream2.write(","+total[index][topic])
					}
						
				
					
				}
			
		
						
				console.log("Se creó el archivo :"+name+".csv")	
			
 }

function writeFile(matrix,name){
	// console.log(matrix)
	var totales=new Object();
	//var stream = fs.createWriteStream("out/"+name+'.csv', {flags: 'w'})				
	var str="";
	var str2="";
	var headers=Object();

	var workbook = new Excel.Workbook();
	workbook.creator = "Adrian C";
	workbook.created = new Date();

	var sheet = workbook.addWorksheet("Datos");

	var worksheet = workbook.getWorksheet("Datos");
	worksheet.columns=new Array();
	

		
				for(date in matrix){
					
					for(topic in matrix[date]){
						str+=","+topic
						headers[topic]=1;
					
					}
				}
				
				var arr=new Array()
				var strHeaders="Fecha"	
				var row=new Object();
					row.header="Fecha";
					row.key="Fecha";
					arr.push(row)	

				for(topic in headers){
					strHeaders+=","+topic
					var row=new Object();
					row.header=topic.toString();
					row.key=topic.toString();
					
					arr.push(row)
			
				}
				worksheet.columns =arr;
		
				for(date in matrix){

			
					
					matrix[date]["Fecha"]=date;
					 // console.log(matrix[date])
					
					var ws=worksheet.addRow(matrix[date]);
				
				
				}
			
		workbook.xlsx.writeFile("out/"+name+".xlsx")
	    .then(function() {
	        // done 
	        
	    });
				console.log("Se creó el archivo :"+name+".csv")	
				
					
 }

function search2(id,query,since,until,callback) {
				console.log(query)
			var operator=new Object();
			var q=query.toString().replace('"','');
			if(query[0]=='"')
				operator={query_string: {
					 		"fields" : ["text","cleantext"],
							"query":query,
							//"type":"phrase"

					    }};
			else
				operator={multi_match :{
							"fields" : ["text","cleantext"],
							"query":query

					    }};

		 

			client.search({
				
				index:"test",
				// type:"news",
				body:{
					"explain":true,
					"query": {
						"filtered":{
							"query":operator,

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
						"aggs" : {

					
				
						    "timeSerie" : {
					            "date_histogram" : {
					                "field" : "created",
					                "interval" : "day",
					                "format":"yyyy-MM-dd"
					            },
							      
								"aggs" : {
									"types": {
										"terms": {
											"field": "_type", 
											//"size": 10
										}
									},
									"grades_count" : { "value_count" : { "field" : "_type" } }
								}  
							},

						}
						

					}
			}).then(function (resp) {
				for(var k=0;k<resp.hits.hits.length;k++){
					// console.log(resp.hits.hits[k]["_explanation"]["details"]);
					// console.log(resp.hits.hits[k]["_explanation"]["details"][0]["details"][0]["details"][0]["details"][0])
					console.log("-----"+query)
					
					var tfOneField
					explanation=resp.hits.hits[k]["_explanation"];
					
					// console.log(explanation["details"][0]["details"][0]["details"][0]["details"][0]["description"])
					//TIENE TF
					if(explanation["details"][0]["details"][0]["details"][0]["details"][0]["description"].indexOf("termFreq")>-1){
						
						tfOne=explanation["details"][0]["details"][0]["details"][0]["details"][0]["value"];
						// console.log(tfOne)
					}else{
						if(explanation["details"][0]["details"][0]["details"][0]["details"][1]!=undefined){
							console.log(resp.hits.hits[k]["_source"])
							console.log(explanation["details"][0]["details"][0]["details"][0]["details"][0]["details"])
						
						}
						
						//TIENE IDF
						// if(explanation["details"][0]["details"].length>1)
						// 	console.log(explanation["details"][0]["details"][h]["details"][0]["details"][0])
					
						// 	for(h=0;h<explanation["details"][0]["details"].length;h++)
						// 	console.log(explanation["details"][0]["details"][h]["details"][0]["details"][1]["details"][0]["details"][0]["value"])
						// console.log(explanation["details"][0]["details"][0]["details"][0]["details"])
					}
						
						//console.log(resp.hits.hits[k])
					
					// console.log(resp.hits.hits[k]["_source"])
				}
				 	
				var docs=new Object();
			    resp.aggregations.documenst = resp.hits.hits;
			    docs.data=new Object();
			    docs.data.total=resp.hits.total;
			    var info = new Object();
		    	docs.query=query
		    	//console.log(docs.query)
		  //   	console.log("----")
				// console.log(docs.data)

			    info.total=resp.hits.total;

				for(index=0;index<services.length;index++){
				    	if(services[index]!="news")    	    	
				    	try{	
				    			//console.log("resp.aggregations."+services[index])
							eval("proc2."+services[index]+"Proc")(eval("resp.aggregations."+services[index]),20,function(results,extra){
							
								docs[services[index]]=formatOutput(results,extra,docs["docs"]);
							
							});	
						}catch(err){
							console.log(err)
							console.log("proc2."+services[index]+"Proc")
							console.log(services[index]+" is not defined")
						}
				
				}
callback(null,docs);
			

			}, function (err) {
			    
			    console.trace(err.message);
		    });


			}
		

function search3(id,query,since,until,callback) {
console.log(query)
			var operator=new Object();
			if(query[0]=='"')
				operator={match_phrase: {
							_all:query

					    }};
			else
				operator={match :{
							_all:query

					    }};


			var op ={
					"query_string" : {
						//"fields" : ["content", "name"],
						"query" : query
					}
			}

		
		 	qShould={
					"multi_match" : {
					"query":      op,
					"fields":     [ "text","title" ],
					"type":       "most_fields",
					"operator":   "or" 
					}
	        }

			client.search({
				
				index:"news",
				// type:"news",
				body:{
					"query": {
						"filtered":{
						"query": 
					    op
						,
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
			}).then(function (resp) {
				console.log(resp.hits.total)
				var docs=new Object();
			    resp.aggregations.document = resp.hits.hits;
			    docs.data=new Object();
			    docs.data.total=resp.hits.total;
			    var info = new Object();
		    	docs.query=query


			    info.total=resp.hits.total;

				
				callback(null,docs);
			

			}, function (err) {
			    
			    console.trace(err.message);
		    });


			}
		
 function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
		  break;
			}
		}
	}

function formatOutput(results,extra,tweets) {
	
	var out=new Object();
	
	out.data=results;
	
	out.info=extra;
	
	if(tweets!=undefined)
		out.total=tweets.length;

	return out;
}