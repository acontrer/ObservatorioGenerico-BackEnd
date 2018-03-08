var db = require('./Dao/db');
var	config = require('./config.js');
var proc2 = require('./procesamiento.js');
var elasticsearch = require('elasticsearch');
var moment=require('moment');
var client = new elasticsearch.Client({
		host: config.index_host
	});



module.exports.search2=function(id,user,query,since,until,callback) {
console.log(new Date(since))
var since2=new Date(since)+"";
var until2=new Date(until)+"";
console.log(".................")
		db.getObs(id,user, function(err, observatories) {

if(Array.isArray(observatories.sources))
var ii=observatories.sources.join()
else
var ii=observatories.sources;

console.log(observatories.sources)			
				if(err) {
					console.log(err)
					callback(err, 400);

		
				} else {
					var qShould;
					if(query=="GLOBAL"){
						qString="created:["+moment(since).format('YYYY-MM-DD')+" TO "+moment(until).format('YYYY-MM-DD')+"]AND('"+ observatories.keywords.join(" ")+"')"
						qShould=null
					}
					else{
						qString="created:["+moment(since).format('YYYY-MM-DD')+" TO "+moment(until).format('YYYY-MM-DD')+"]AND('"+ observatories.keywords.join(" ")+"') AND ("+query+")"
				 	qShould={
								"multi_match" : {
								"query":      query,
								"fields":     [ "cleantext","text","autor" ],
								"type":       "most_fields",
								"operator":   "or" 
								}
				        }
				    }
			client.search({
				
				index: config.index_name,
				type:ii,
				body:{
    

    "query": {
        "query_string" : {
            "query" : qString,
            "use_dis_max" : false
        }
    }
				// 	"query": {
				// 		"filtered":{
				// 		"query": {
				// 	    "bool" : {
				// 	        "must" : {
				// 					"multi_match" : {
				// 					// "query":      observatories.keywords.join(" "),
				// 					"query":      '\"martin carcamo\"',
				// 					"fields":     [ "cleantext","text","autor" ],
				// 					"type":       "most_fields",
				// 					"operator":   "or" 
				// 					}
				// 	        },
				//             "should" :qShould,
				// 	        "minimum_should_match" : 1,
				// 	        "boost" : 0.5
				// 	    }
				// 		},
				// 	"filter":{

				// 		    "bool" : {
				// 		        "must" :[
    // 									{"range": { "created": { "gte": since,"lte": until }}},
    // 									//{"exists" : { "field" : "location" }}
				// 		        	],

										
				// 		} 	
				// 	}
				// }
					
				// 		}

						,
						"aggs" : {

							"geo" : {
									"terms" :{
										"field":"location",
										"size":20
									} 
							},
	
							"donut" : {
									"terms" :{"field":"mood"} 
							},

							"url" : {
									"terms" : { 
										"field" : "url",
										"size":30
									}
								},
							"media" : {
									"terms" : { 
										"field" : "media",
										"size":20
									}
								},
							"topWords" : {
									"terms" : { // probar con campo cleantext
										"field" : "cleantext",
										"size" : 20
									}
								},
				
						    "timeSerie" : {
					            "date_histogram" : {
					                "field" : "created",
					                "interval" : "day",
					                "format":"yyyy-MM-dd"
					            },
							      
								"aggs" : {
									"negativo" : {
										"filter" : { "term": { "mood": "negativo" } },
						
									},
								
									"positivo" : {
										"filter" : { "term": { "mood": "positivo" } },
		
									},

									"objetivo" : {

										"filter" : { "term": { "mood": "objetivo" } }, //en el import juntar los ? con objetivos y dejarlos como neutros
		
									}
   

								}  
							},

						}
						

					}
			}).then(function (resp) {
			
				var docs=new Object();
					
			    resp.aggregations.document = resp.hits.hits;
			    docs.data=new Object();
			    docs.data.total=resp.hits.total;
			    var info = new Object();

			    info.total=resp.hits.total;

				for(index=0;index<services.length;index++){
				    	if(services[index]!="news")    	    	
				    	try{	
				    			
							eval("proc2."+services[index]+"Proc")(eval("resp.aggregations."+services[index]),20,function(results,extra){
							
								docs[services[index]]=formatOutput(results,extra,docs["docs"]);
							
							});	
						}catch(err){
							console.log(err)
							console.log("proc2."+services[index]+"Proc")
							console.log(services[index]+" is not defined")
						}
				
				}

				client.search({
					
					index: config.index_name,
					
					type:ii,
					body:{
						"query": {
							"filtered":{
							"query": {
						    "bool" : {
						        "must" : {
										"multi_match" : {
										"query":      observatories.keywords.join(" "),
										"fields":     [ "text" ],
										"type":       "most_fields",
										"operator":   "or" 
										}
						        },
					            "should" :qShould,
						        "minimum_should_match" : 1,
						        "boost" : 0.5
						    }
							},
		
					}
						
							},
						
					}
				}).then(function (resp2) {
					
					proc2.newsProc(resp2.hits.hits,20,function(results,extra){
						docs["news"]=formatOutput(results,extra,docs["docs"]);
						callback(null,docs);
					})
					
				}, function (err) {
				    
				    console.trace(err.message);
			    });



					// callback(null,docs);

			}, function (err) {
			    
			    console.trace(err.message);
		    });


			}
		});

}

module.exports.searchNews=function(id,user,query,since,until,callback) {

			db.getObs(id,user, function(err, observatories) {
				
				if(err) {
		
					res.send(err, 400);

		
				} else {
					var qShould;

					if(query=="GLOBAL")
						qShould=null
					else
				 	qShould={
								"multi_match" : {
								"query":      query,
								"fields":     [ "text","autor" ],
								"type":       "most_fields",
								"operator":   "or" 
								}
				        }

			client.search({
				
				index: config.index_name,
				// index: "observatoriotest",
				_type:"news",
				body:{
					"query": {
						"filtered":{
						"query": {
					    "bool" : {
					        "must" : {
									"multi_match" : {
									"query":      observatories.keywords.join(" "),
									"fields":     [ "text","autor" ],
									"type":       "most_fields",
									"operator":   "or" 
									}
					        },
				            "should" :qShould,
					        "minimum_should_match" : 1,
					        "boost" : 0.5
					    }
						},
	
				}
					
						},
					
					}
			}).then(function (resp) {

			
				callback(null,resp);

			}, function (err) {
			    
			    console.trace(err.message);
		    });


			}
		});

}


function formatOutput(results,extra,tweets) {
	
	var out=new Object();
	
	out.data=results;
	
	out.info=extra;
	
	if(tweets!=undefined)
		out.total=tweets.length;

	return out;
}
