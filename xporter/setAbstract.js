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
		host: "http://citiaps1.diinf.usach.cl:9200",
		requestTimeout: 250000
	});
var totales=true;
var indexes="";
console.log(data.getFolder())
fs.mkdir(data.getFolder(),function(err,data){
				//console.log(err)
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

console.log(process.argv[2]);

	var queriesAll=data.getQueries();
//	var queriesAll=data.getTest();
	var mood=["menciones"]
	var matrix=new Object();
	console.log("SSSSS")
console.log(data.getAllQueries().length)
		for(i in queriesAll)
			console.log(i)
			// console.log(queriesAll[i].length)

		printData();

function printData(){ 	

	var all=data.getAllQueries();
	search3("emol","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("inversiones","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("legal","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("lasegunda","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("mediosregionales","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("elmostrador","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("ltpaper","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("lanacion","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})
	search3("","("+all.join(")OR(")+")",data.getSince(),data.getUntil(),function(w){printResumen(w)})

}
count=0;
var totalArray=new Array();
function printResumen(ob){
console.log("-")
console.log(ob)
	var total=9;
	this.totalObject=new Array();
	if(this.count==undefined){
		
		this.count=0;
	}
	this.count++;
	if(this.totalObject==undefined)
		this.totalObject=new Array();

	totalArray.push(ob);
	
	if(this.count==total){
		console.log("-------->")
		console.log(totalArray)
		writer.writeAbstract(totalArray,"resumen",data);
	}
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
