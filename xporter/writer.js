var Excel = require("exceljs");
var moment=require("moment")
var fs = require('fs');

// GENERA ARCHIVO TOTALES
module.exports.writeTotal=function(matrix,name,data,val){

	var totales=new Object();
	var workbook = new Excel.Workbook();
	workbook.creator = "Adrian C";
	workbook.created = new Date();

	var sheet = workbook.addWorksheet("Datos");

	var worksheet = workbook.getWorksheet("Datos");
	worksheet.columns=new Array();
	var headers=Object();
	var total=new Object();

	
				// console.log(matrix)

				for(tipo in matrix){
					// console.log(tipo)
					for(date in matrix[tipo]){
						// console.log(date)
						for(topic in matrix[tipo][date]){
							// console.log(topic)
						
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
									total[tipo][topic]=new Object();

								if(total[tipo][topic][val]==undefined)
									total[tipo][topic][val]=0;
								
									total[tipo][topic][val]+=matrix[tipo][date][topic][val];
							
						}
					}
				}

			
			var row2=new Array()
			row2.push("Medios")	
				
				for(topic in headers){
					
					row2.push(topic);
				}
					
			worksheet.addRow(row2);

			
				for(index in total){
					if(index!="total"){
						var row=new Array()
						
						row.push(index);
						for(topic in headers){

							if(total[index][topic]!=undefined){
								
								row.push(total[index][topic][val]);
							}
							else
								row.push(0);
						}
						worksheet.addRow(row);
					}
				}
				var row=new Array()
						
				row.push("Total");
				for(topic in headers){

					if(total["total"][topic]!=undefined){
						
						row.push(total["total"][topic][val]);
					}
					else
						row.push(0);
				}
				worksheet.addRow(row);
				fs.mkdir(data.getFolder(),function(err,data){
					//console.log(err)
				})
				fs.mkdir(data.getFolder()+"totales/",function(err,data){
					//console.log(err)
				})
				workbook.xlsx.writeFile(data.getFolder()+"totales/"+val+"_"+name+".xlsx")
			    .then(function() {

						console.log(data.getFolder()+"totales/"+val+"_"+name+".xlsx")	
					
			        
			    });	
			
		
						
				
			
 }

// GENERA ARCHIVO FECHA/CONCEPTOS
module.exports.writeFile=function(matrix,name,data,metric){
	// console.log(matrix)
	if(metric==undefined||metric==null)
		metric="strengtn";

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
			//	for(var ite=moment(data.getSince());ite.isBefore(data.getUntil());ite.add(1,'d')){
								
					for(topic in matrix[date]){
					//	console.log(topic)
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
		
				//for(date in matrix){
				for(var ite=moment(data.getSince());ite.isBefore(data.getUntil());ite.add(1,'d')){
				
					var date=""+ite.format("YYYY-MM-DD")
					//console.log("-"+date)	
					
					if(matrix[date]!=undefined)				
					{
						//console.log(matrix)
						matrix[date]["Fecha"]=date;
						var row=new Array()
						row.push(date)
						acum=0;

						for(topic in headers){

							if(matrix[date][topic]!=undefined){
						
								row.push(matrix[date][topic][metric]);
								
							}
							else
								row.push(0);
						}
						
					

						var ws=worksheet.addRow(row);
					}
				
				}
			
		workbook.xlsx.writeFile(data.getFolder()+name+".xlsx")
	    .then(function() {
	        // done 

				console.log("Se creó el archivo :"+data.getFolder()+name+".xlsx")	        
			//process.exit(0)
	        
	    });	

				
					
 }
module.exports.writeFilePercent=function(matrix,name,data,metric){
	// console.log(matrix)
	if(metric==undefined||metric==null)
		metric="strengtn";

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
			//	for(var ite=moment(data.getSince());ite.isBefore(data.getUntil());ite.add(1,'d')){
								
					for(topic in matrix[date]){
					//	console.log(topic)
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
				iteOld=undefined
				//for(date in matrix){
				for(var ite=moment(data.getSince());ite.isBefore(data.getUntil());ite.add(1,'d')){
				
					var date=""+ite.format("YYYY-MM-DD")
					// var dateOld=""+iteOld.format("YYYY-MM-DD")
					// console.log("-"+dateOld)	
					
					if(matrix[date]!=undefined)				
					{
						//console.log(matrix)
						matrix[date]["Fecha"]=date;
						var row=new Array()
						row.push(date)
						acum=0;

						for(topic in headers){
							// console.log(topic)
							if(topic!="Fecha"){
								if(matrix[date][topic]!=undefined)
									v0=matrix[date][topic][metric]
								else
									v0=0;
									

									if(iteOld!=undefined){
										dateOld=""+iteOld.format("YYYY-MM-DD")
										if(matrix[dateOld]!=undefined)
											if(matrix[dateOld][topic]!=undefined){
												if(matrix[dateOld][topic][metric]!=undefined)
													v1=	matrix[dateOld][topic][metric]
												else
													v1=0;
											}
											else
												v1=0
										else
											v1=0

										if(v1==0){
											if(v0==0)
												vf=0
											else	
												vf=100;
										}
										else
											vf=100*(v0-v1)/v1;
										
										row.push( vf );
									}
									else
										row.push(100); //Fila inicial 
							
							}
						}
				
						var ws=worksheet.addRow(row);
					}
					iteOld=moment(ite);
				}
			
		workbook.xlsx.writeFile(data.getFolder()+name+".xlsx")
	    .then(function() {
	        // done 

				console.log("Se creó el archivo :"+data.getFolder()+name+".xlsx")	        
		// process.exit(0)
	        
	    });	

				
					
 }
 module.exports.writeAbstract=function(matrix,name,data){
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
	
		
					var row=new Array()
					row.push("Medio")
					row.push("Total Filtrado")
					row.push("Total")
					
					var ws=worksheet.addRow(row);
		
				for(var date=0;date<matrix.length;date++){
				
					// console.log("-"+date)	
					var row=new Array()
					row.push(matrix[date]["id"])
					row.push(matrix[date]["totalQuery"])
					row.push(matrix[date]["total"])
				

					var ws=worksheet.addRow(row);
			
				}
			
		workbook.xlsx.writeFile(data.getFolder()+"resumen.xlsx")
	    .then(function() {
	        // done 

				console.log("Se creó el archivo :"+data.getFolder()+name+".xlsx")	        
				// process.exit(0)
	        
	    });	

				
					
 }