var method = Doc.prototype;

function Doc(doc) {
   	this.regexHtml=/(<([^>]+)>)/ig;
	this.doc=doc;
	this.TIT=0;
	this.FREQ=0;
	this.text="";
	// this.text=doc["_source"]["text"];
	//console.log(doc["_source"])

	if(doc["_source"]["text"]!=undefined){
		this.save=true;
		this.text=doc["_source"]["text"].replace(/[.,]/ig, " ");
	}else
		this.save=false;

	this.save=true;
	this.nBody;
	this.nTitle;
	this.date=this.doc["_source"]["created"].split("T")[0];

}

method.getDate = function(i) {
    return this.date;
};

method.getAge = function(type,i) {
    this.doc["_source"][type]=i
};
method.getVar=function(type){
	return Math.round(this.doc["_source"][type]* 100) / 100;

}

method.getLength=function(type){
	return this.text.split(" ").length;
}

method.setStrength=function (query){
		// var dat=this.doc["_source"]["created"].split("T")[0];
		var re;
		
		this.text = this.text.replace(this.regexHtml, "");		
	    query=query.replace(/[.,]/ig, " ");
	    query=query.replace(/\(/ig, " ");
    	query=query.replace(/\)/ig, " ");
    	// console.log("QUERY +++++ "+query)
		
		if(query.indexOf("*")>-1){
			console.log("========s")	
			
			re = new RegExp(query.replace(/\*/g, " "), "g");
		}
		else{

			var q2=query.replace(/"/g, "")
			q2=q2.replace(/ AND /g, " | ")//
			q2=q2.replace(/ OR /g, " | ")

			// if(query.indexOf(" AND ")>-1)

				// q2=q2.replace(/ AND /g, " | ")//
			// console.log(q2)	
			if(query[0]=='"'){
				re = new RegExp(" "+q2, "gi");

			}else
				re = new RegExp(q2, "gi");
		}

		this.nBody=this.text.match(re);
		if(this.doc["_source"]["cleantext"]!=undefined)
			this.nTitle=this.doc["_source"]["cleantext"].match(re);

		if(this.nBody!=null)
			this.FREQ=this.nBody.length


		if(this.nTitle!=null)
			this.TIT=this.nTitle.length

		var log=Math.log(Math.log(this.text.length)/Math.LN10)/Math.LN10;

		
	
	if(this.text.length==0)
		this.doc["_source"]["_strenghtn"]=0;
	else
		this.doc["_source"]["_strenghtn"]=(Math.log(this.text.length)/Math.LN10)*(2*this.TIT+this.FREQ);
	// console.log(this.doc["_source"]["_strenghtn"]);
	// console.log("TextLength:"+this.text.length+" Freq:"+this.FREQ+", TIT:"+this.TIT+" ,_strenghtn:"+this.doc["_source"]["_strenghtn"])
				
}
method.matchQuery=function (data){
	 	// console.log("MATCHQUERY")
 	if(data.getSpecialQuery()!=null){
	  	// console.log("special Filter")
	  	// console.log("-----------------------------------------")
	  	// console.log(data.getSpecialQuery())
	  	var rG = new RegExp(data.getSpecialQuery(), "gi");
	  	var r=this.text.match(rG)
	  	
	  	if(r==null)
	  		this.save=false;
	 
  	}

}
method.setFrecuency=function(){
	
	if(this.nBody!=null||this.nTitle!=null)
		this.doc["_source"]["frecuency"]	=1;
	else
		this.doc["_source"]["frecuency"]	=0;
}

method.isOk=function (){
	return this.save;
}
module.exports = Doc;