//var news = require('./news.js');
module.exports.topWordsProc=function(docs,k,callback){
	var text="";

	for(var i = 0; i < docs.length; i++) {
			text=text.concat(docs[i]["cleantext"]);
		}
		var listado=text.split(" ");
		
		var diccionario=new Object();

		for(i=0; i<listado.length;i++){

			if(diccionario[listado[i]]==null){
				diccionario[listado[i]]="1";
			}
			else{
				diccionario[listado[i]]=parseInt(diccionario[listado[i]])+1;
			}


		}
		
		var salidaFinal=new Array()
		for(d in diccionario){
			var salida=new Object();
			salida.text=d;
			salida.size=diccionario[d];

			
			salidaFinal.push(salida);
		}
		
		salidaFinal.orderByNumber('size',-1);

		callback(salidaFinal.slice(1,k));
}
/*ELIMANR ESTE SERVICIO CUANDO SE NORMALICEN EL RESTO DE OBSERVATORIOS*/
module.exports.mentionsProc=function(tweets, k,callback) {
	
	var moods=new Object();

	var moodsNames=new Array();
	moodsNames.push("positivo");
	moodsNames.push("negativo");
	moodsNames.push("objetivo");
	moodsNames.push("menciones");
	//moodsNames.push("?");

	var metrics=new Object();


	for(var i=0;i<tweets.length;i++){
		
		var d=new Date(Date.parse(tweets[i]["created"]));
	
		var dF=d.toISOString().split("T")[0]; 

		
		if(metrics[dF]==undefined){
			metrics[dF]=new Object();
			metrics[dF]["menciones"]=0;
		}

		if(metrics[dF][tweets[i]["mood"]]==undefined)
			metrics[dF][tweets[i]["mood"]]=1;
		else
			metrics[dF][tweets[i]["mood"]]++;
		
		metrics[dF]["menciones"]++;						

		if(	moods[tweets[i]["mood"]]==undefined){
			moods[tweets[i]["mood"]]=1;
			moodsNames.push(tweets[i]["mood"]);
		}
		else
			moods[tweets[i]["mood"]]=moods[tweets[i]["mood"]]+1;

	}
	var sal=new Array();
	for(key in metrics){
		var ob=new Object();
		ob["date"]=key;
		var menciones=0;
		for(var j=0;j< moodsNames.length;j++){

			if(metrics[key][moodsNames[j]]==undefined)
				ob[moodsNames[j]]=0;
			else{
				ob[moodsNames[j]]=metrics[key][moodsNames[j]];
				menciones=menciones+metrics[key][moodsNames[j]];
			}
			//ob["menciones"]=menciones;
		}
		sal.push(ob)
		
	}

	for(var i=0;moods.length;i++){
		donut["label"]=moods
	}
	
	
	var outPut=new Object();
	
	// modificado para agurpar ? y objetivos
	for(var i=0;i<sal.length;i++){
		sal[i]['objetivo']=sal[i]['objetivo']+sal[i]['?'];
		sal[i]['?']=undefined;
	}
	if(moods["?"]==undefined||moods["?"]==null)
		moods["?"]=0;
	
	if(moods["objetivo"]==undefined||moods["objetivo"]==null)
		moods["objetivo"]=0;
	
	if(moods["positivo"]==undefined)
		moods["positivo"]=0;
	
	if(moods["negativo"]==undefined){
		
		moods["negativo"]=0;
		
	}
	else{
	
	}
	
	moods["objetivo"]=moods["objetivo"]+moods["?"];
	moods["menciones"]=parseInt(moods["objetivo"])+parseInt(moods["positivo"])+parseInt(moods["negativo"]);
	moods["?"]=undefined;
	//---------------
	
	outPut=sal;

	outPut["count"]=moods;
	
	callback(outPut,moods);
		
}


module.exports.timeSerieProc=function(tweets, k,callback) {
	
	var moods=new Object();

	var moodsNames=new Array();
	moodsNames.push("positivo");
	moodsNames.push("negativo");
	moodsNames.push("objetivo");
	moodsNames.push("menciones");
	//moodsNames.push("?");

	var metrics=new Object();


	for(var i=0;i<tweets.length;i++){
		
		var d=new Date(Date.parse(tweets[i]["created"]));
	
		var dF=d.toISOString().split("T")[0]; 

		
		if(metrics[dF]==undefined){
			metrics[dF]=new Object();
			metrics[dF]["menciones"]=0;
		}

		if(metrics[dF][tweets[i]["mood"]]==undefined)
			metrics[dF][tweets[i]["mood"]]=1;
		else
			metrics[dF][tweets[i]["mood"]]++;
		
		metrics[dF]["menciones"]++;						

		if(	moods[tweets[i]["mood"]]==undefined){
			moods[tweets[i]["mood"]]=1;
			moodsNames.push(tweets[i]["mood"]);
		}
		else
			moods[tweets[i]["mood"]]=moods[tweets[i]["mood"]]+1;

	}
	var sal=new Array();
	for(key in metrics){
		var ob=new Object();
		ob["date"]=key;
		var menciones=0;
		for(var j=0;j< moodsNames.length;j++){

			if(metrics[key][moodsNames[j]]==undefined)
				ob[moodsNames[j]]=0;
			else{
				ob[moodsNames[j]]=metrics[key][moodsNames[j]];
				menciones=menciones+metrics[key][moodsNames[j]];
			}
			//ob["menciones"]=menciones;
		}
		sal.push(ob)
		
	}
	
	outPut=sal;

	outPut["count"]=moods;
	
	callback(outPut,null);
		
}

module.exports.donutProc=function(tweets, k,callback) {
	
	var moods=new Object();
	var moodsNames=new Array();
	moodsNames.push("positivo");
	moodsNames.push("negativo");
	moodsNames.push("objetivo");
	moodsNames.push("menciones");

	for(var i=0;moods.length;i++){
		donut["label"]=moods
	}
	
	for(var i=0;i<tweets.length;i++){
		
		var d=new Date(Date.parse(tweets[i]["created"]));
	
		var dF=d.toISOString().split("T")[0]; 

		
		if(metrics[dF]==undefined){
			metrics[dF]=new Object();
			metrics[dF]["menciones"]=0;
		}

		if(metrics[dF][tweets[i]["mood"]]==undefined)
			metrics[dF][tweets[i]["mood"]]=1;
		else
			metrics[dF][tweets[i]["mood"]]++;
		
		metrics[dF]["menciones"]++;						

		if(	moods[tweets[i]["mood"]]==undefined){
			moods[tweets[i]["mood"]]=1;
			moodsNames.push(tweets[i]["mood"]);
		}
		else
			moods[tweets[i]["mood"]]=moods[tweets[i]["mood"]]+1;

	}
		var sal=new Array();
	var outPut=new Object();
	
	// modificado para agurpar ? y objetivos
	for(var i=0;i<sal.length;i++){
		sal[i]['objetivo']=sal[i]['objetivo']+sal[i]['?'];
		sal[i]['?']=undefined;
	}
	if(moods["?"]==undefined||moods["?"]==null)
		moods["?"]=0;
	
	if(moods["objetivo"]==undefined||moods["objetivo"]==null)
		moods["objetivo"]=0;
	
	if(moods["positivo"]==undefined)
		moods["positivo"]=0;
	
	if(moods["negativo"]==undefined){
		
		moods["negativo"]=0;
		console.log("si");
	}
	else{
	
	}
	
	moods["objetivo"]=moods["objetivo"]+moods["?"];
	moods["menciones"]=parseInt(moods["objetivo"])+parseInt(moods["positivo"])+parseInt(moods["negativo"]);
	moods["?"]=undefined;
	//---------------
	
	

	outPut=moods;
	
	callback(outPut,null);
		
}

module.exports.geoProc = function(docs,k,callback) {
	var results = [];
	
	for(i=0; i<docs.length;i++) {
		//Produce una fecha como YYYY-MM-DD
		var lat,lng;
		if(docs[i]['location']!=null){
			
			// if(docs[i]['mLocation']!=null){
			// 	// console.log(docs[i]['mLocation']);
			// 	lat=docs[i]['mLocation'].split(",")[0];
			// 	lng=docs[i]['mLocation'].split(",")[1];
			// }else{
			// 	lat=docs[i]['uLocation'].split(",")[0];
			// 	lng=docs[i]['uLocation'].split(",")[1];
			// }

			lat=docs[i]['location'].split(",")[0];
			lng=docs[i]['location'].split(",")[1];
		
			var t = {
					
				'lat': lat,
				'lng': lng,
				'count': 1

			};
			
			results.push(t);
		}
		
	}
/*	results = {
	'data': results,
	'max':30
	};
*/
	callback(results);

}

module.exports.mediaProc = function(docs,k,callback) {
	
	var results=new Object();
	var ids=new Object();
	for(i=0; i<docs.length;i++) {
	
		if(docs[i]["media"]!=undefined)
			for(var j=0;j<docs[i]["media"].length;j++){
				
				if(results[docs[i]["media"][j]]==undefined){
					results[docs[i]["media"][j]]=1;
					ids[docs[i]["media"][j]]="https://twitter.com/"+docs[i]["id"]+"/status/"+docs[i]["id"]
				}
				else{
					
						results[docs[i]["media"][j]]=results[docs[i]["media"][j]]+1;
						docs[i]["id"];
					}
				}
			}
		
	

		var salidaFinal=new Array()
		
		for(d in results){
			var salida=new Object();
			salida.url=d;
			salida.size=results[d];
			salida.docid=ids[d];
			
			salidaFinal.push(salida);
		}
	salidaFinal.orderByNumber('size',-1);

	callback(salidaFinal.slice(1,30));

}

module.exports.documentProc = function(docs,k,callback) {
	
	var results=new Array();
	var salidaFinal=new Array();
	
	
		for(var j=0;j<docs.length;j++){
			
			var salida=new Object();
			if(docs[j]['id'].indexOf(":")==-1)
				salida.id=docs[j]['id'];
			else{
				
				arr=docs[j]['id'].split(":")
				if(arr[1]!=undefined){
				salida.id=arr[1].replace("\"{\"$numberLong\":\"","").replace("\"","").replace("}","");
				}
			}

			salida.autor=docs[j]['autor'];

			results.push(salida);
		}


	callback(results.slice(1,15));

}

module.exports.urlProc = function(docs,k,callback) {
	
	urlProcss(docs,k,callback);
	
}

urlProcss=function(docs,k,callback){

	var results=new Object();
	for(i=0; i<docs.length;i++) {
		if(docs[i]["urls"]!=undefined)
			for(var j=0;j<docs[i]["urls"].length;j++){
					
				if(results[docs[i]["urls"][j]["url"]]==undefined){
					
					results[docs[i]["urls"][j]['url']]=1;
				}
				else{
					
					results[docs[i]["urls"][j]['url']]=results[docs[i]["urls"][j]['url']]+1;
				}
			}
		
	} 


	var salidaFinal=new Array()
		for(d in results){
			var salida=new Object();
			salida.url=d;
			salida.size=results[d];
			
			salidaFinal.push(salida);
		}
	salidaFinal.orderByNumber('size',-1);
	
	callback(salidaFinal.slice(0,k));
}


module.exports.newsProc = function(docs,k,callback) {

	var results=new Object();
	
	var urls =[];
	
	urlProcss(docs,20,function(items){
		

		for(i=0;i<items.length;i++)
			urls.push(items[i]['url']);

		news.getNewsp(urls,function(err,items){
		
			callback(items)

		});

	})
	
}




Array.prototype.orderByNumber=function(property,sortOrder){
  // Primero se verifica que la propiedad sortOrder tenga un dato válido.
  if (sortOrder!=-1 && sortOrder!=1) sortOrder=1;
  this.sort(function(a,b){
    // La función de ordenamiento devuelve la comparación entre property de a y b.
    // El resultado será afectado por sortOrder.
    return (a[property]-b[property])*sortOrder;
  })
}

