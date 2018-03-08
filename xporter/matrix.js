module.exports.Matrix=function(){
	this.data=new Object();
	this.totalConcepts=0;
	this.count=0;
	this.addValue=function(doc,topico){
		//console.log(topico)
		// console.log(this.data.keys.length)

		var d= new Date(doc["_source"]["created"]);

		if(this.data[doc["_id"]]==undefined)
			this.data[doc["_id"]]=new Object();
		
		// this.data[doc["_id"]]["id"]=docs.hits.hits[i]["_id"];
		this.data[doc["_id"]]["date"]=d.getTime()

		this.data[doc["_id"]]["tipo"]="RT"
		
		this.data[doc["_id"]][topico]=1;

	}

	this.getData=function(){
		return this.data;
	}

	this.setTotalConcept=function(total){
		this.totalConcepts=total;
	}		

	this.addCount=function(){
		this.count++;
		if(this.count==14)
			next(this.getData(),"malestars")
	}		
	this.isTopicReady=function(){
		console.log(this.count+"=="+this.totalConcepts)
		if(this.count==this.totalConcepts)
			return true;
		else
			return false;
	}
return this;
}	