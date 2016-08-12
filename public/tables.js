//this page is mostly connecting the two sides (so is most client javascript that is not added in--mostly socket stuff+ stuff to accomodate that)
//if user moves people, socket.emit()

var socket = io.connect();	

function print_this(){
	var navbar = $('#navigation');
	var tables = $('.table');
	var main = $('#main');
	var s = $('.selected');
	var m = false; // boolean to keep track of message

	for (var i=0; i<tables.length; i++){
		tables[i].style.margin = "5px";
		tables[i].style.border = '#777 2px solid';
	}
	for (var i=0; i<navbar.length; i++){
		navbar[i].style.display = 'none';
		main[i].style.color = "#323031";

		if ($('#message')[i].style.display == ""){
			$('#message')[i].style.display = "none";
			m = true;
		}
	}
	window.print(); // after printing, reset all style changes

	for (var i=0; i<tables.length; i++){
		tables[i].style.margin = "10px";
		tables[i].style.border = '#eee 2px solid';
	}
	for (var i=0; i<main.length; i++){
		main[i].style.color = "#fff";
		navbar[i].style.display = '';

		if(m == true){
			$('#message')[i].style.display = "";
		}
	}
	s = $('.selected');
	if(s.length != 0){	
		for (var j=0; j<s.length; j++){
			$(s[j]).removeClass('selected');
		}
	}
}

function manual_edit(){
	var m = $('#message');
	var k = $('.kid');
	var mbutton = $('#edit');
	var pbutton = $('#print');
	var s = $('.selected');

	for (var i=0; i<k.length; i++){ // goes through all kids
		k[i].style.cursor = "pointer";
	}

	for (var i=0; i<m.length; i++){
		m[i].style.display = ""; // shows message
		mbutton[i].innerHTML = "Save Edits"; //changes button
		mbutton[i].style.left = "160px";

		if (mbutton[i].addEventListener) {
		    mbutton[i].addEventListener("click", function() {
		       if (confirm("Click OK to save these changes") == true){
		       		var newLayout = []; //full layout, list of table lists
		       		var kids_html = [];
		       		var tables_html = $('div.table'); //all of the tables
		       		for (var t=0; t<tables_html.length; t++){
		       			// creates a list of all the kid elements at each table
		       			kids_html.push($(tables_html[t]).find('.kid'));
		       		}
		       		for (var z=0; z<kids_html.length; z++){
		       			var IDs = [];
		       			for (var y=0; y<kids_html[z].length; y++){
		       				var kID = parseInt($(kids_html[z][y]).attr('id'));
		       				IDs.push(kID);
		       			}
		       			newLayout.push(IDs); // format: [table Num, [kid ID, kid Name]]
		       		}
					//console.log(newLayout);

		       		for (var j=0; j<m.length; j++){
						m[j].style.display = "none"; // removes message
						mbutton[j].innerHTML = "Manual Edit"; //changes button
						mbutton[j].style.left = "150px";
					}
					for (var j=0; j<k.length; j++){
						k[j].style.cursor = "default";
					}
					s = $('.selected');
					if(s.length != 0){	
						for (var j=0; j<s.length; j++){
							$(s[j]).removeClass('selected');
						}
					}
					var id = window.location.pathname.split('/')[1];
		       		socket.emit('changeTable', newLayout, id);
				}
		    }, false);
		} else { 
		    mbutton[i].attachEvent("onclick", function() { 
		    	if (confirm("Click OK to save these changes") == true){
		    		var newLayout = []; //full layout, list of table lists
		       		var kids_html = [];
		       		var tables_html = $('div.table'); //all of the tables
		       		for (var t=0; t<tables_html.length; t++){
		       			// creates a list of all the kid elements at each table
		       			kids_html.push($(tables_html[t]).find('.kid'));
		       		}
		       		for (var z=0; z<kids_html.length; z++){
		       			var IDs = [];
		       			for (var y=0; y<kids_html[z].length; y++){
		       				var kID = $(kids_html[z][y]).attr('id');
		       				IDs.push([kID]);
		       			}
		       			newLayout.push([IDs]); // format: [table Num, [kid ID, kid Name]]
		       		}
		       		socket.emit('changeTable', newLayout);
		       		console.log('new: '+ newLayout);

		       		for (var j=0; j<m.length; j++){
						m[j].style.display = "none"; // removes message
						mbutton[j].innerHTML = "Manual Edit"; //changes button
						mbutton[j].style.left = "150px";
					}
					for (var j=0; j<k.length; j++){
						k[j].style.cursor = "default";
					}
					s = $('.selected');
					if(s.length != 0){	
						for (var j=0; j<s.length; j++){
							$(s[j]).removeClass('selected');
						}
					}
		       }
			});
		}
	}

	$(".kid").on("click", function(e) {
	   $(this).toggleClass("selected");
	});

// SWTICH CODE ADAPTED FROM: 
// http://stackoverflow.com/questions/22528519/swap-two-items-on-clicks

	$('#switch').on("click", function() {
		$first = $(".selected:eq(0)");
	    $second = $(".selected:eq(1)");
	    if ($second.length > 0){
		    var tempText = $first.text();
		    var tempID = $first.attr('id');
		    $first.attr('id', $second.attr('id'));
		    $second.attr('id', tempID);
		    $first.text($second.text());
		    $second.text(tempText);
		    $first.removeClass('selected');
		    $second.removeClass('selected');
		} else {
			alert('Please choose another name to switch with');
		}
	});	
}


$(window).on('beforeunload', function(){
    socket.close();
});