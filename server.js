// server side javascript for all the math and sending stuff to HTML
var http = require('http'); // this is new
var express = require('express');
var app = express();

var server = http.createServer(app); // this is new
var sketchedout = app.listen(8080);
// add socket .io
var io = require('socket.io').listen(sketchedout);
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://lunchroom.db.sqlite');
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run.html files through Hogan
app.set('views', __dirname +'/templates'); // tell Express where to find templates
app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function(socket){
	socket.join("theRoom");
	socket.on('getGroups',function(){//takes in nothing, returns an list of groups of kids in an array
		//var 
	});
	socket.on('gettables', function(tbls, grade){//takes in stuff, returns an array of arrays that hold children in tables
		//console.log(tbls);
		//console.log(grade);
		var tables = [];
		var children = [];
		var q = conn.query('SELECT * FROM children WHERE class = $1', [grade])
		q.on('data', function(row){
			children.push(row.id);
		});
		q.on('end', function(){
			var jsonTables = tableMaker(children, tbls);
			console.log(jsonTables);
			var newjson = JSON.stringify(jsonTables);
			console.log(newjson);
			var ll = conn.query('INSERT INTO pasttables (tbl, grade) VALUES ($1, $2)', [newjson, grade]);
			ll.on('data', function(row){
				//for some reason doesnt work w/o this being here??
			});
			ll.on('end', function(){
				var num;
				conn.query('SELECT id FROM pasttables ORDER BY id DESC LIMIT 1')
				.on('data', function(row){
					//console.log(row.id);
					num = row.id;
				})
				.on('end', function(){
					socket.emit('doneTables', num);
				});
			});
		});
	});
	socket.on('numKids', function(grade){
		var numkids = 0;
		var qq = conn.query('SELECT * FROM children WHERE class = $1', [grade]);
		qq.on('data', function(row){
			numkids++;
		});
		qq.on('end', function(){
			socket.emit('kidsnum', numkids);
		});
	});
	socket.on('changeTable', function(newT, num){
		console.log(newT);
		console.log(num);
		conn.query('SELECT * FROM pasttables WHERE id = ($1)', [num])
		.on('data', function(row){
			grdd = row.grade;
		})
		.on('end', function(){
			conn.query('DELETE FROM pasttables WHERE id = ($1)', [num]);
			console.log('her');
			var newjson1 = JSON.stringify(newT);
			console.log(newjson1);
			conn.query('INSERT INTO pasttables (id, tbl, grade) VALUES ($1, $2, $3)', [num, newjson1, grdd])
			.on('data', function(){
				//doesnt work without this here
			})
			.on('end', function(){
				console.log("changed!");
			});
		});
	});
	socket.on('getStudentList', function(group, tablesList){ //takes in a group of students (one of the ones given by "get groups"), and gives back a json list of children in that group, with attributes displayed as well

	});
	socket.on('newGrade', function(grade){
		var num = 0;
		conn.query('SELECT * FROM classes WHERE year = ($1)', [grade])
		.on('data', function(row){
			num++;
		})
		.on('end', function(){
			conn.query('INSERT INTO classes (year) VALUES ($1)', [grade]);
		});
	});
	socket.on('changeChild', function(id, grade, name, gender, rowdy, typea){//takes in a child's id and changes/sets all of the rest of their stuff (with all of their data fields), and changes that child in the database. returns nothing
		conn.query('UPDATE children SET class=$1, name=$2, gender=$3, rowdy=$4, typea=$5 WHERE id = $6', [grade, name, gender, rowdy, typea, id]);
	});
	socket.on('addChild', function(grade, name, gender, rowdy, typea){//takes in a child (grade, name, gener, rowdy, typea) and inserts the new child into the database
		var rowdy = mkbool(rowdy);
		var typea = mkbool(typea);
		console.log(rowdy);
		console.log(typea);
		conn.query('INSERT INTO children (class, name, gender, rowdy, typea) VALUES ($1, $2, $3, $4, $5)', [grade, name, gender, rowdy, typea])
		.on('data', function(row){
			//console.log(row);
		})
		.on('end', function(){
			console.log('new child!');
		});
	});
	socket.on('removeChild', function(id){//takes in a child and removes it from the database
		conn.query('DELETE FROM children WHERE id = $1', [id])
		.on('end', function(){
			console.log('removed child ' + id);
		});
	});
	socket.on('lastTable', function(){//returns last tables
		var numtables = 0;
		var q = conn.query('SELECT * FROM pasttables');
		q.on('row', function(row){
			numtables++;
		});
		q.on('end',function(){
			if(numTables == 0){
				console.log("tried to get tables, there werent any previous tables");
			}
			else{
				var oldTable;
				var z = conn.query('SELECT * FROM pasttables WHERE id == $1', [numtables]);
				z.on('row', function(row){
					oldTable = row.tbl;
				});
				z.on('end', function(){
					socket.emit('oldTable', oldTable); //gives JSON array of tables with kids in them
				});
			}
		});
		socket.on('saveBlacklist', function(list){
			for(var o = 0; o<list.length;list++){
				var nm1=list[o][0];
				var nm2=list[o][1];
				var n1;
				var n2;
				var grd;
				var tot;
				conn.query('SELECT * FROM children WHERE name = ($1)', [nm1])
				.on('data', function(row){
					n1 = row.id;
				})
				.on('end', function(){
					conn.query('SELECT * FROM children WHERE name = ($1)', [nm2])
					.on('data', function(row){
						n2=row.id;
						grd = row.class;
					})
					.on('end', function(){
						tot = [n1, n2]
						console.log(tot);
						conn.query('DELETE * FROM blacklist WHERE grade = ($1)', [grd])
						.on('data', function(row){

						})
						.on('end', function(){
							conn.query('INSERT INTO blacklist (pair, grade) VALUES ($1, $2)', [tot, grd])

						});
					});	
				});
			}
		})
	});

});



//TODO: make sure when a new class is added to add it to the database--in one of the socket things


app.get('/', function(request, response){
	var numy = 0;
	var groupList = [];
	var l = conn.query('SELECT * FROM classes');
	l.on('data', function(row){numy++;});
	l.on('end', function(){
		var q = conn.query('SELECT * FROM classes');
		q.on('data', function(row){
			var kidsList = [];
			var x = conn.query('SELECT * FROM children WHERE class = ($1)', [row.year]);
			x.on('data', function(row){
				var male="";
				var female="";
				var rowdy="";
				var typea="";
				if(row.gender == "true" || row.gender == 1){
					female = "checked";
				}
				else{
					male = "checked";
				}
				if(row.rowdy=="true" || row.rowdy == 1){
					rowdy="checked";
				}
				if(row.typea=="true" || row.typea == 1){
					typea="checked";
				}
				kidsList.push({kid: [{kidID:row.id, kidName:row.name, male:male, female:female, disruptive:rowdy, social:typea}]});
			});
			x.on('end', function(){
				var blist = [];
				var bl = [];

				var z = conn.query('SELECT * FROM blacklist WHERE grade == ($1)', [row.year]);
				z.on('data', function(row){
					var ndone = row.pair;
					var done = numgt(ndone);
					bl.push(done);
					console.log([bl]);
				});
				z.on('end', function(){
					var kid1;
					var kid2;
					for(var k = 0; k < bl.length; k++){
						console.log(bl);
						console.log(bl[k]);
						var a = bl[k][0];
						var b = bl[k][1];
						var l = conn.query('SELECT * FROM children WHERE id = ($1)', [a]);
						l.on('data', function(row){
							kid1 = row.name;
						});
						l.on('end', function(){
							var wl = conn.query('SELECT * FROM children WHERE id = ($1)', [b]);
							wl.on('data', function(row){
								kid2 = row.name;
							});
							wl.on('end', function(){
								blist.push({pair: [{k1:kid1, k2:kid2}]});
								
								if(k == bl.length){							
									groupList.push({groupName: row.year, kidsList: kidsList, blacklist: blist});
									if(groupList.length == numy){
										response.render('index.html', {groupList: groupList});///******fill this in when index is done--mustache the stuff in
									}	
								}
							});
						});
					}
				});

			});

	});
	});

});
app.get('/:numdb/tables', function(request, response){ //n^n complexity down in there somewhere maybe?
	var tblcomp = [];
	var kdsname = [];
	var grd;
	var tbl;
	var mm = conn.query('SELECT * FROM pasttables WHERE id == ($1)', [request.params.numdb]);
	mm.on('data', function(row){
		grd = row.grade;
		tbl = row.tbl;
		console.log(tbl);
	});
	mm.on('end', function(){
		var nmq = conn.query('SELECT * FROM children WHERE class == ($1)', [grd]);
		nmq.on('data', function(row1){
			kdsname.push([row1.id, row1.name]);
		});
		nmq.on('end', function(){
			var temp = JSON.parse(tbl);
			for(var h = 0; h < temp.length; h++){
				var listo = [];
				for(var hh = 0; hh < temp[h].length; hh++){
					var kiddo = '';
					for(var v = 0; v<kdsname.length; v++){
						if(temp[h][hh] == kdsname[v][0]){///here is the potential n^n complexity??
							kiddo = kdsname[v][1];
							listo.push({kidID: temp[h][hh], kid: kiddo});
						}
					}
				}
				tblcomp.push({tableNum: h+1, kids: listo});
				response.render('tables.html', {tables:tblcomp});///fill this in when tables is done/know what the fields need to be
			}
		});
	});
});
app.get('/:class/students.json', function(request, response){
	var children = [];
	var idthing = [];
	var q = conn.query('SELECT * FROM children WHERE class = $1', [request.params.class]);
	q.on('data', function(row){
		children.push(row);
		idthing.push(row.id);
	});
	q.on('end', function(){
		response.json(children);
	});
});


function tableMaker(kidIds, tableInts) {

	// kidInts is an array of kid ids
	// tableInts is an array of integers which is the max number of people for each table

	var tables = []//list of working on tables/tables to be filled
	var doneTables = []//list of completed tables to be returned

	for (var i=0; i<tableInts.length; i++){ // Adding arrays into the array of tables for each table
		var x = [];
		tables.push(x);
	}

	//console.log(tables);


	var students = shuffle(kidIds); // Randomizes kid ids
	
	var k = 0; 
	var holderLength = students.length;
	for (var i=0; i<holderLength; i++){ // For each students in the array of student ids
		//console.log(tables);
		//console.log(k);
		var id = students.pop();
		tables[k].push(id);
		//console.log("id: " + id);
		//console.log("tables[k]" + tables[k]);
		//console.log(tables)
		if (tables[k].length == tableInts[k]) { // If the amount of things in the table equal the max
			//console.log((tables[k].length) +" tables "+ (tableInts[k]))
			var y = tables.splice(k, 1);
			//console.log("spliced = " + y);
			doneTables.push(y);
			//console.log(doneTables);
			tableInts.splice(k, 1);
			//console.log(tableInts);
		}
		if (k == (tables.length - 1) || (k == (tables.length))) {
			k = 0;
		}
		else {
			k++;
		}
	//console.log(k);
	//console.log(students);
	}
	//console.log(tables);
	
	//not sure exactly why code below was here (maybe to preserve order), but it screwed stuff up so i am commenting it out, also order deosnt really matter
	/*for (var i=0; i<tables.length; i++) {
		z = tables.pop(i);
		doneTables.push(z);
	}
	console.log(doneTables);

	doneTables.push(tables);*/
	console.log(tables);
	return tables;

}

//makes 0 or one into true or false, if number input into function is not zero or one, returns that number
function mkbool(num){
    var bool;
    if(num == 1){
        bool = true;
    }
    else if(num == 0){
        bool = false;
    }
    else{
        return num;
    }
    return bool;
}

function numgt(str){
	var tup;
	var plc = str.indexOf(',');
	var first = parseInt(str.substr(0, plc));
	var second = parseInt(str.substr(plc+1));
	tup =[first, second];
	return tup;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle
  while (m) {

    // Pick a remaining element
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
