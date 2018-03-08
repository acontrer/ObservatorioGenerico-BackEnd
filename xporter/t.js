var db = require('./db');
var fs = require('fs');
var stream = fs.createWriteStream('topicos_generales.csv', {flags: 'w'})
var	config = require('./config.js');
var proc = require('./proc.js');
var proc2 = require('./proc2.js');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
		host: "http://localhost:9200"
	});
var services=["geo","timeSerie","donut","document","topWords","media","url"];

//	var queries =['protesta','manifestación','marcha','paro','huelga','despidos','subcontrato','explotación','precarización','atentado','sindicato','pobreza','injusticia','bombazos','']
//	var queries =['constitución','modelo  económico','modelo   político','neoliberalismo','libertad','igualdad','represión','derrumbe   modelo ','"asamblea constituyente"','AC','reforma','revolución','inversión   extranjera','crisis   económica','crisis   economía','democracia','cobre','desigualdad','crecimiento   económico','crecimiento   economía','"desarrollo económico" ***','desaceleración','deuda   externa','morosidad','"gasto público"','austeridad','"equilibrio macroeconómico"','"equilibrios macroeconómicos"','desempleo','endeudamiento','delincuencia','"incertidumbre económica"','incertidumbre   reformas','crisis   política']
//	var queries =['corrupción','caval','nueragate','tráfico   influencias','"información privilegiada"','"info privilegiada"','"inf privilegiada"','elite   política','"clase dominante"','colusión ','farmacias','supremazos','penta','"caso penta"','confort','icare','tissue','CPC']
//	var queries =['confech','destrozos   estudiantes','destrozos   estudiantil','encapuchados ','barricadas','lucro ','lucro   educación','gratuidad','"reforma educacional"','mineduc','ministerio   educación','"movimiento estudiantil"','"mov estudiantil"','selección   educación']
	//var queries =['"movimientos sociales"','"mov sociales"','"mov social"','petitorio','"sociedad civil"','"soc civil"','"derechos sociales"','"derechos soc"','"der sociales"','"demandas sociales"','"demandas soc"','"demanda social"','"demanda social"','mapuche','"conflicto mapuche"','araucanía ','"conflicto estudiantil"','"conflicto ambiental"','"medio ambiente"'];
	var queries=['delincuencia','seguridad','salud','educacion','trabajo','centralismo','cultura','arte','crisis']
var out="";
var matrix=new Object();

					
for(var j=0;j<queries.length;j++){

	(function(index){

		search2("aa",queries[index], new Date("2013-01-01"),new Date("2016-01-30"),function(err,docs){
			/*
			stream.write("\n");
			stream.write(queries[index])
			*/
			for(var i=0;i<docs["timeSerie"]["data"].length;i++){

			if(matrix[docs["timeSerie"]["data"][i]["date"]]==undefined)
				matrix[docs["timeSerie"]["data"][i]["date"]]= new Object();
			
		
			matrix[docs["timeSerie"]["data"][i]["date"]][queries[index]]=docs["timeSerie"]["data"][i]["menciones"]				
//console.log(matrix)
				//	stream.write("\n");c
				//	stream.write(docs["timeSerie"]["data"][i]["date"]+","+docs["timeSerie"]["data"][i]["menciones"]);
			}
			setTimeout(function(){
			if(index==queries.length-1)next();
},15000)
			
				
				
		});
	})(j);
}
 function next(){
					// copiar cabeceras
	var str="";
	var headers=Object();
				for(date in matrix){
					
					for(topic in matrix[date]){
						str+=","+topic
					//	console.log(topic)
						headers[topic]=1;
					}
				}

				var strHeaders="Fecha"				
				for(topic in headers)	
					strHeaders+=","+topic
				stream.write(strHeaders);
	
				for(date in matrix){
					stream.write("\n")
					
					var str=date;
					
					for(topic in headers){
						if(matrix[date][topic]==undefined)
							str+=","+0
						else	
							str+=","+matrix[date][topic]
					}
			
					stream.write(str);
				
				}
					console.log("ok")	
 }

function search2(id,query,since,until,callback) {

		
		 	qShould={
					"multi_match" : {
					"query":      query,
					"fields":     [ "text","autor" ],
					"type":       "most_fields",
					"operator":   "or" 
					}
	        }

			client.search({
				
				index:"test",
				type:"news",
				body:{
					"query": {
						"filtered":{
						"query": {
					    "bool" : {
			
				            "must" :qShould,
					        "minimum_should_match" : 1,
					        "boost" : 0.5
					    }
						},
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
										"field" : "text",
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
callback(null,docs);
				// client.search({
					
				// 	index: config.index_name,
				// 	// index: "observatoriotest",
				// 	type:"news",
				// 	body:{
				// 		"query": {
				// 			"filtered":{
				// 			"query": {
				// 		    "bool" : {
						  
				// 	            "should" :qShould,
				// 		        "minimum_should_match" : 1,
				// 		        "boost" : 0.5
				// 		    }
				// 			},
		
				// 	}
						
				// 			},
						
				// 	}
				// }).then(function (resp2) {
					
				// 	proc2.newsProc(resp2.hits.hits,20,function(results,extra){
				// 		docs["news"]=formatOutput(results,extra,docs["docs"]);
				// 		callback(null,docs);
				// 	})
					
				// }, function (err) {
				    
				//     console.trace(err.message);
			 //    });



					// callback(null,docs);

			}, function (err) {
			    
			    console.trace(err.message);
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