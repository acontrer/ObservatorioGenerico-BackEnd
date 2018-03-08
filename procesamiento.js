
module.exports.topWordsProc=function(bucket,k,callback){

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

	data=new Array()

	bucket.buckets.forEach(function(oo){

		var salida=new Object();
			salida.date=oo.key_as_string;

		salida["negativo"]=oo["negativo"]["doc_count"]
		salida["positivo"]=oo["positivo"]["doc_count"]
		salida["objetivo"]=oo["objetivo"]["doc_count"]
		salida.menciones=oo.doc_count;

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

module.exports.geo2Proc = function(bucket,k,callback) {


var data= [
		{
			"Identificador": "I",
			"Nombre": "I de Tarapacá",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "II",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "II",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "40"
		},
		{
			"Identificador": "II",
			"Nombre": "II de Antofagasta",
			"aprobacion": "60",
			"desaprobacion": "50"
		},
		{
			"Identificador": "III",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "IV",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "V",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "VI",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "VII",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		},
		{
			"Identificador": "VII",
			"Nombre": "II de Antofagasta",
			"aprobacion": "50",
			"desaprobacion": "50"
		}

];


		callback(data,null);

}


module.exports.mediaProc = function(bucket,k,callback) {
	data=new Array()

	bucket.buckets.forEach(function(oo){

		var salida=new Object();

		salida.url=oo.key;
console.log("aaaa")
console.log(oo)
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
		salida3.url=hits[i]["_source"]["url"];
		salida3.title=hits[i]["_source"]["title"];
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
