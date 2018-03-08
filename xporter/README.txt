servicio-tweets
===============

Sirve los datos de tweets desde MongoDB.

Para instalar las dependencias:

	npm install package.json

Para empezar el programa:

	node app.js --listen:portNum

	portNum: número del servicio en HTTP. El defecto es 3000.

Para ejecutar pruebas:

	npm test

Se puede accesar tweets usando esto formato:

	localhost:3000/tweets/id?since=x&until=y

	id: número de identificación del político
	since: la fecha de inicio
	until: la fecha hasta, pero no incluyendo los tweets

	Todas fechas deberían en ISO 8601 (http://en.wikipedia.org/wiki/ISO_8601)

La API regresa un cacho de JSON:

	data: la información formateada para un gráfico de morris.js

		Cada colección tiene una fecha se llama "data" y un número de menciones

	totalMenciones: el número total de menciones
	totalMencionesp: el número total de menciones positivas
	totalMencionesn: el número total de menciones negativas

También, se puede solicitar por un gráfico:

	localhost:3000/graph/id?since=x&until=y&elementId=z

	id: número de identificación del político
	since: la fecha de inicio
	until: la fecha hasta, pero no incluyendo los tweets
	elementId: la indentificación del DIV para el gráfico

El script se llama "indices.js" es usado con mongo como:

	"mongo indices.js"

Esto script apoya los datos ejemplos del Observatorio Politicoa a MongoDB.

	Nombre de la bd: observatorioPolitico
	Nombre de la colección: indices

Cuidado, el script va a borrar los datos existentes.

Ahora, sirve la página "test-page.html" en "/". Se mira la página como un ejemplo.
