var db = require('./db');
var fs = require('fs');

var config = require('./config.js');
var proc = require('./proc.js');
var proc2 = require('./proc2.js');
var Doc = require("./document.js");

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: config.index_host,
	// requestTimeout: 250000
});
var totales=true;
// var indexes="emol";

var mood=["menciones"]

var totalCount=new Object();
var bwcount=0;

count=0;

module.exports.xporter=function(){
		this.id="xporter"+Math.random();
		// console.log(">>>>>>>>>>>>>>>>>>>>>...-"+this.id)
		var writer = require('./writer.js');
		
		var BagOfWords=require("./Data/mongoObject.js");

		this.data=new BagOfWords();
		
		var queriesAll=this.data.getQueries();

		this.setObservatory=function(id){
			
			this.observatory=id;
		}

		this.setConsulta=function(consulta){
			
			this.consulta=consulta;
		}


		this.getBagOfWords=function(){
			
			return this.bagOfWords;
		}

		this.setBagOfWords=function(consulta){
			console.log(consulta)
			console.log("==============")
			this.bagOfWords=null;
			this.bagOfWords=consulta;
		}


		this.setUser=function(username){
			
			this.userName=username;
		}

		this.setFolder=function(folder){
			
			this.folder=folder;

			this.data.setFolder(folder)
		}
		this.initXls=function(callback){
			   
		    totalCount=new Object()

			this.data.getBag(this.observatory,this.userName,this.consulta,function(ob){	
			
				callback(ob,Object.keys(ob).length)
			})
		}
		this.procesarBolsa=function(pos,callback){

			this.matrix=new Object();
		    
		    totalCount=new Object()
			// console.log("--->Procesar Bolsa->"+this.id)
			// console.log(pos)
			this.procesarConcepto(0, Object.keys(this.getBagOfWords())[pos], this.getBagOfWords()[Object.keys(this.getBagOfWords())[pos]],this.matrix,function(){

				callback()

			})	
		}

		/* Procesar Consulta con sus bolsas*/
		this.procesarConcepto= function (index,name,queries,matrix,callback){
			// console.log("--->procesarConcepto-->"+this.id)
			// console.log(index+"  <> "+queries.length)
			var ref=this
			if(queries!=undefined){
				if(index<queries.length){

					ref.search2(name,queries[index],this.data.getSince(),this.data.getUntil(),matrix,function(err,docs){

						ref.procesarConcepto(index+1,name,queries,matrix,callback)

					});
				}else{

					if(totales){
						// writer.writeTotal(matrix,name+"_totales",this.data,"frecuency");
						writer.writeTotal(matrix,name+"_totales",this.data,"strengtn");
					}
					writer.writeFile(matrix["total"],name,this.data,this.data.getMetric())
					writer.writeFilePercent(matrix["total"],name+"p",this.data,this.data.getMetric())
							
				 callback()
				}
				return;
			}		
		}



		 this.search2=function(id,query,since,until,matrix,callback) {
				//if(query[0]=='"')
				var ref=this;

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
						type:ref.data.getIndexes(),
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
						// console.log("getMoreUntilDone")
						// console.log(response.hits)
						
						  // collect the title from each response
					  		//	console.log(query+"----"+response.hits.total)
					  	var count=0;

					  	// totalCount[query]=0;
					  	if(response.hits!=undefined)
					  	response.hits.hits.forEach(function (doc) {
					  		// console.log(query)
					  		
					  		var docu = new Doc(doc);
					  	
					  		docu.matchQuery(ref.data);
						 	// console.log("@@@@@@@@@")
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
								
							
								// console.log(totalCount[query]+"++"+response.hits.total)
						

						  });
				if(totalCount[query]==undefined)
									totalCount[query]=1
								else
						  			totalCount[query]++;
							docu=null;
							// console.log("-->"+response.hits.total)
							// console.log("-->"+ totalCount[query])
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
}