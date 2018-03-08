metrics = require('../metrics.js');
var moment = require('moment');

var entityModel = require('../entity.js');

// MINISTROS SEPARADOS
function ministrosExport(){
metrics.getData("politicos",{"tipo":"Ministro"},function(err, items){


		var line="";
		//console.log(items[item])
		line="nombre,Ministerio";
		for(metric in items[0]["metrics2"])
			line=line+","+items[0]["metrics2"][metric]["since"]+",positivo,negativo,objetivos"
		console.log(line)
	


	for(item in items){
		var line="";
		//console.log(items[item])
		line=line+"'"+items[item]["name"]+"','"+items[item]["Ministerio"]+"'\n";
		for(metric in items[item]["metrics2"]){
			if(items[item]["metrics2"][metric]["info"]!=undefined){
				line=line+","+items[item]["metrics2"][metric]["mood"]+","+items[item]["metrics2"][metric]["mood2"]+","+items[item]["metrics2"][metric]["info"]["positivo"]+","+items[item]["metrics2"][metric]["info"]["negativo"]+","+items[item]["metrics2"][metric]["info"]["objetivo"]+"\n";
			}
		
		}
		console.log(line)
	}
			
})
}



function pactoExport(query,pacto){
metrics.getData("politicos",query,function(err, items){

	var pactoMedidas=new Object();
	for(item in items){
		
		if(item!="orderByNumber"){
		
			var politico =items[item];
		
			for(i in politico.metrics2){
				
				if(i!="orderByNumber"){
		
					var metrica=politico.metrics2[i];

					if(pactoMedidas[metrica.since]==undefined){
						
						
						pactoMedidas[metrica.since]=new Object();
						pactoMedidas[metrica.since].mood1=0
						pactoMedidas[metrica.since].mood2=0
						pactoMedidas[metrica.since].positivo=0;
						pactoMedidas[metrica.since].negativo=0;
						pactoMedidas[metrica.since].neutro=0;


					}
					pactoMedidas[metrica.since].mood1=parseFloat(metrica.mood);
					pactoMedidas[metrica.since].mood2+=parseFloat(metrica.mood2);
					pactoMedidas[metrica.since].positivo+=parseFloat(metrica.info.positivo);
					pactoMedidas[metrica.since].negativo+=parseFloat(metrica.info.negativo);
					pactoMedidas[metrica.since].neutro+=parseFloat(metrica.info.objetivo);
				
				}
			}
		 
			
		}
	}
	console.log(pacto)
	for(since in pactoMedidas){
		//console.log("---");
		var strLine=since;
		strLine+=","+((pactoMedidas[since]["positivo"]-pactoMedidas[since]["negativo"])/(pactoMedidas[since]["positivo"]+pactoMedidas[since]["negativo"]));
		strLine+=","+((pactoMedidas[since]["positivo"]-pactoMedidas[since]["negativo"])/(pactoMedidas[since]["positivo"]+pactoMedidas[since]["negativo"]+Math.log(pactoMedidas[since]["neutro"]+1)));
		strLine+=","+pactoMedidas[since]["positivo"];
		strLine+=","+pactoMedidas[since]["negativo"];
		strLine+=","+pactoMedidas[since]["neutro"];


		console.log(strLine)
	}
			
})
}

// ------
pactoExport({"name":"bachelet"},"Nueva Mayoría")
// 
// ministrosExport();
// pactoExport({"pacto":"Alianza"},"Alianza")
// pactoExport({"tipo":"Senador"},"Senadores")
// pactoExport({"tipo":"diputado"},"Diputados")
// pactoExport({"pacto":"Nueva Mayoría"},"Nueva Mayoría")
