// server side javascript to start the database
var anyDB = require('any-db');

var conn = anyDB.createConnection('sqlite3:lunchroom.db.sqlite');

conn.query('CREATE TABLE children ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "class" INTEGER, "name" TEXT, "gender" BOOL, "rowdy" BOOL, "typea" BOOL)')
	.on('end', function(){
		console.log('made children database');
	});
conn.query('CREATE TABLE pasttables("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "tbl" BLOB, "grade" INTEGER)');
conn.query('CREATE TABLE classes("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "year" STRING)');
//for gender, true equals female, false equals male
conn.query('CREATE TABLE blacklist ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "pair" STRING, grade "INTEGER")')
	.on('end', function(){
		console.log('made blacklist database');
	});
/*
conn.query('CREATE TABLE whitelist ()')
	.on('end', function(){
		console.log('made whitelist database');
	});*/


conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Cooper", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "George", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Christiaan", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Luke", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Mike", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Jeff", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Jack", "false", "true", "false"]);	
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Sam", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Andrew", "false", "true", "false"]);		
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Alex", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Joe", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Will", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Bo", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "David", "false", "true", "false"]);
conn.query('INSERT INTO children ("class", "name", "gender", "rowdy", "typea") VALUES ($1, $2, $3, $4, $5)', ["2026", "Elvis", "false", "true", "false"]);
conn.query('INSERT INTO classes("year") VALUES ($1)', ["2026"]);
conn.query('INSERT INTO blacklist ("pair", "grade") VALUES ($1, $2)', ["1, 2", "2026"]);