var xporter=require('./createxls.js');
xporter.setObservatory();
xporter.createXls(0);
xporter.createXls(1);
xporter.createXls(2);
xporter=null
return null;