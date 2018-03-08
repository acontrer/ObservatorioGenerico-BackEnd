// var news = require('./news.js');
module.exports.topWordsProc=function(bucket,k,callback){
		console.log(bucket)
	data=new Array()

	bucket.buckets.forEach(function(oo){

		var salida=new Object();

		salida.text=oo.key;

		for(field in oo){
			if(oo[field]["doc_count"]!=undefined)
				salida[field]=oo[field]["doc_count"];
		}
			
		salida.size=oo.doc_count;

		data.push(salida);

	})

		callback(data,null);
}

/*ELIMANR ESTE SERVICIO CUANDO SE NORMALICEN EL RESTO DE OBSERVATORIOS*/
module.exports.mentionsProc=function(tweets, k,callback) {
	
	
	callback(outPut,moods);
		
}


module.exports.timeSerieProc=function(bucket, k,callback) {
	// console.log(bucket)
	data=new Array()
	var mood=["emol","lanacion","ltpaper","mediosregionales","lasegunda","inversiones","legal","elmostrador"]
	
	bucket.buckets.forEach(function(oo){
		// console.log(oo)
		var salida=new Object();
			salida.date=oo.key_as_string;
			


			for(i=0;i<oo.types.buckets.length;i++){
				// console.log("-------")
				//console.log(oo["types"]["buckets"][i]["key"])
				// console.log(oo["types"]["buckets"][i]["doc_count"])
				if(oo["types"]["buckets"][i]["doc_count"]!=NaN)
					salida[oo["types"]["buckets"][i]["key"]]=oo["types"]["buckets"][i]["doc_count"]
			}
			
			// llenando de ceros	
		for(j=0;j<mood.length;j++){
				
				// console.log(mood[j])
				
				// console.log(salida[mood[j]])
				
				if(salida[mood[j]]==undefined)
					salida[mood[j]]=0
			}
		// salida["lasegunda"]=oo["lasegunda"]["doc_count"]
		// salida["ltpaper"]=oo["ltpaper"]["doc_count"]
		// salida["emol"]=oo["emol"]["doc_count"]	
		// salida["soyChile"]=oo["soyChile"]["doc_count"]	
		// salida["inversiones"]=oo["inversiones"]["doc_count"];
		// salida["legal"]=oo["legal"]["doc_count"];
		// salida["elmostrador"]=oo["elmostrador"]["doc_count"];
		
		salida.total=oo.doc_count;

		data.push(salida);
		
	})
		
	callback(data,null);
		
}

module.exports.donutProc=function(bucket, k,callback) {
	
	var salida =new Object()

	bucket.buckets.forEach(function(oo){


	
		salida[oo["key"]]=oo["doc_count"]
		salida.size=oo.doc_count;

		//data.push(salida);

	})
		callback(salida,null);
		
}

module.exports.geoProc = function(bucket,k,callback) {
	
	data=new Array()

	bucket.buckets.forEach(function(oo){
	
		var t = {
				
			'lat': oo['key'].split(",")[0],
			'lng': oo['key'].split(",")[1],
			'count': oo['doc_count']

		};
			

		data.push(t);

	})

		callback(data,null);

}

module.exports.mediaProc = function(bucket,k,callback) {
	data=new Array()

	bucket.buckets.forEach(function(oo){

		var salida=new Object();

		salida.url=oo.key;

		for(field in oo){
			if(oo[field]["doc_count"]!=undefined)
				salida[field]=oo[field]["doc_count"];
		}
			
		salida.size=oo.doc_count;

		data.push(salida);

	})

		callback(data,null);
}

module.exports.documentProc = function(hits,k,callback) {
	
  var idss=new Array();

			    for(i in hits){
			    	
			    	if(hits[i]["_source"]!=undefined){
			    		
			    		var salida=new Object();
			    		salida["id"]=hits[i]["_id"];
			    		salida["autor"]=hits[i]["_source"]["autor"];	
			    	
			    		idss.push(salida)
			   	 	}
				
				}

	callback(idss,null);

}

module.exports.urlProc = function(bucket,k,callback) {
	data=new Array()

	bucket.buckets.forEach(function(oo){

		var salida=new Object();

		salida.url=oo.key;

		for(field in oo){
			if(oo[field]["doc_count"]!=undefined)
				salida[field]=oo[field]["doc_count"];
		}
			
		salida.size=oo.doc_count;

		data.push(salida);

	})

		callback(data,null);
	
}




module.exports.newsProc = function(hits,k,callback) {

	var salidaFinal=new Array()

	
	    for(i in hits){
			    	
			    	if(hits[i]["_source"]!=undefined){
			    	
			    		var salida3=new Object();
						salida3.name=hits[i]["_source"]["_id"];
						salida3.title=hits[i]["_source"]["title"];
						salida3.size="16";
						salida3.image=hits[i]["_source"]["image"]
						salida3.text=hits[i]["_source"]["text"]
						salidaFinal.push(salida3);
			   	 	}
				
				}

	callback(salidaFinal)
	
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

