console.log("Hello World");

var kidIDs = [
                {"name"		: "John",  // First element
                "isBoy"		: true,
                "isRowdy"	: true },       

                {"name"		: "Reid",
                "isBoy"		: true,
                "isRowdy"	: true },      

                {"name"		: "Cooper",
                "isBoy"		: true,
                "isRowdy"	: false },      
                
                {"name"		: "Junho",
                "isBoy"		: true,
                "isRowdy"	: false }, 

                {"name"		: "Minster",
                "isBoy"		: true,
                "isRowdy"	: false }, 
                
                {"name"		: "Clara",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Leela",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Mary",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Anna",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Isabel",
                "isBoy"		: false,
                "isRowdy"	: false }, 

                {"name"		: "John",  // First element
                "isBoy"		: true,
                "isRowdy"	: true },       

                {"name"		: "Reid",
                "isBoy"		: true,
                "isRowdy"	: true },      

                {"name"		: "Cooper",
                "isBoy"		: true,
                "isRowdy"	: false },      
                
                {"name"		: "Junho",
                "isBoy"		: true,
                "isRowdy"	: false }, 

                {"name"		: "Minster",
                "isBoy"		: true,
                "isRowdy"	: false }, 
                
                {"name"		: "Clara",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Leela",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Mary",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Anna",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Isabel",
                "isBoy"		: false,
                "isRowdy"	: false }, 

                {"name"		: "John",  // First element
                "isBoy"		: true,
                "isRowdy"	: true },       

                {"name"		: "Reid",
                "isBoy"		: true,
                "isRowdy"	: true },      

                {"name"		: "Cooper",
                "isBoy"		: true,
                "isRowdy"	: false },      
                
                {"name"		: "Junho",
                "isBoy"		: true,
                "isRowdy"	: false }, 

                {"name"		: "Minster",
                "isBoy"		: true,
                "isRowdy"	: false }, 
                
                {"name"		: "Clara",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Leela",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Mary",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Anna",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Isabel",
                "isBoy"		: false,
                "isRowdy"	: false }, 

                {"name"		: "John",  // First element
                "isBoy"		: true,
                "isRowdy"	: true },       

                {"name"		: "Reid",
                "isBoy"		: true,
                "isRowdy"	: true },      

                {"name"		: "Cooper",
                "isBoy"		: true,
                "isRowdy"	: false },      
                
                {"name"		: "Junho",
                "isBoy"		: true,
                "isRowdy"	: false }, 

                {"name"		: "Minster",
                "isBoy"		: true,
                "isRowdy"	: false }, 
                
                {"name"		: "Clara",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Leela",
                "isBoy"		: false,
                "isRowdy"	: true }, 
                
                {"name"		: "Mary",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Anna",
                "isBoy"		: false,
                "isRowdy"	: false }, 
                
                {"name"		: "Isabel",
                "isBoy"		: false,
                "isRowdy"	: false }, 


    ] // End of Kids

var tableInts = [10,10,10,10];

var blacklists = {
//	1:[2, 3],
//	2:[9],
//	3:[1],
//	6:[7, 8],
//	7:[6]
};

// kidIDs is JSON array of kid id's and names and gender and isRowdy
// tableInts is array of ints which represent tables and table numbers
// blacklists is a hashmap of values of kid's ids who cannot be together

csp(kidIDs, tableInts, blacklists);

function csp(kidIDs, tableInts, blacklists) { // assumes that none of the tableints is 0

	var isBlacklist;
		if (Object.keys(blacklists).length > 0){
			isBlacklist = true;
		}else{
			isBlacklist = false;
		}
	console.log("There is a nonempty blacklist: " + isBlacklist);

	var tableData = {};
	for (i = 1; i <= tableInts.length; i++) {
		tableData[i] = [tableInts[i-1], 0, 0, 0];
	} // Table Data
	console.log(tableData);

	var possibilities = {};
	for (i = 1; i <= kidIDs.length; i++) {
		var valueArray = [];
		for (j = 1; j <= tableInts.length; j++) {
			valueArray.push(j);
		}
		possibilities[i] = valueArray;
	} // Creating Possibility data
	console.log("possibilities:" + possibilities);

	var documentation = {}; // Creating empty space for documentation of changes
	var assignments = {}; // Creating empty assignments data
	var memoization = {}; // Creating empty memo
	var xDepth = 0; 	  // Used to determine current depth in tree
	var nextWillBeRandom = false;  // Used to determine whether to randomly pick the nextID, set to true if all kids have same # of constraints and possibilities
 	var nextID;    // Used to hole the kids ID who is being assigned on each pass
	var order = [];	 // Used to hold the order that kids need to be assigned, stays the same even if backtracking

	while (Object.keys(possibilities).length > 0) { // Until all the kids have been assigned it does the following
		
		var keys = Object.keys(possibilities); // Keys = all the kids who still need to be assigned a table
		
		////////////////////////
		///// CHOOSING KID /////
		////////////////////////

		if(order[xDepth] == undefined){
			var possibleKids = [];
			if (nextWillBeRandom == true){ // If the algorithm should pick a kid at random
				nextID = keys[Math.floor(keys.length * Math.random())]; // nextId = random kidId left to be assigned
			}
			else if (isBlacklist == false) { // Else if the blacklist is empty
		    	console.log("Picked kid at random because blacklist was empty");
		    	nextID = keys[Math.floor(keys.length * Math.random())]; // nextId = random kidId left to be assigned
		    	nextWillBeRandom = true; // The algorithm should pick the next kid at random
			}else{
				var maxConstraints = 0; // Set holding variable to zero
				possibleKids = []; // Empty possible kids list
				for (i = 0; i < keys.length; i++) { // For each of the remaining kids to be assigned
					if (keys[i] in blacklists){     // If their ID is a key in the blacklist
							if (blacklists[keys[i]].length == maxConstraints){  // If the amount of constraints they have is the same as the max
								possibleKids.push(keys[i]);                 	// Put that kid on the possible kids list
							}else if (blacklists[keys[i]].length > maxConstraints){ // Otherwhise if the amount of contraints they have is more than the max
								maxConstraints = blacklists[keys[i]].length;		// Change the max
								possibleKids = [keys[i]];							// Set possible kids to just that kid
							}
					}else{ 												// If the kids id is not a key in the blacklist
						if (maxConstraints == 0) {						// And if the current max contrains is 0
								possibleKids.push(keys[i]);					// Push the kid id on to the possible kids list
						}
					}
				}
				if (maxConstraints == 0) {				// After going though all the kids based on involvement in contraints, if the max contraints is still zero (none of remaining kids is involved in any constraints)
					var minimumPos = possibilities[keys[0]].length; // Setting variable for the minimum amount of remaining possible positions for kid
																	// To be compared to the rest of the kids
					possibleKids = [keys[0]]; // Puts first kid in possible kids
					for (i = 1; i < keys.length; i++) { // For each of the kids out of remaining kids who need to be assigned
						if (possibilities[keys[i]].length == minimumPos){ // If the amount of remaining possible assignments for that kid is equal to the current minimum
							possibleKids.push(keys[i]);					  // Put that kid on the possible kids list
						}else if (possibilities[keys[i]].length < minimumPos){ // Otherwise, if there are less remaining possibilities for this kid
							minimumPos == possibilities[keys[i]].length;       // Set the minimum to what this kid has 
							possibleKids = [keys[i]];						   // Set the possible kids list to just the current kid
						} // If the remaining possibilities for the kid is greater than the minimumm do nothing, he doesn't go on the list nor does anything else change
					}
					if (possibleKids.length == keys.length){ // If all the kids have the same amount of remaining possibilities, we want to base decision off of how many constrains a kid has
		    			nextWillBeRandom = true; // The algorithm should pick the next kid at random
					}
				}
				nextID = possibleKids[Math.floor(possibleKids.length * Math.random())]; // nextId = random kidId from possiblekids 
				console.log("Possible Kids: " + possibleKids);
			}
		}else{
			nextID = order[xDepth];
		}
		console.log("Next ID:" + nextID);
		
		////////////////////////////
		///// CHOOSING TABLE ///////
		////////////////////////////

		var IdInBlack = (nextID in blacklists); // Checks if chosen kidID is a key in the blacklist 


		var possibleAssignments = possibilities[nextID]; // Possible assignments = remaining posible assignments for nextID 
		var notPossible = []; // Creates empty list to be filled with impossible assignments for nextID
		var whyNotPossible = []; // Creates empty list to be filled with the kids who would be deemed unassignable by the not possible assignments. 
		var hypothet;   // Holder variable, tries each of the possible assignments to see if it will deem any of the other kids unassignable 
		for (i = 0; i < possibleAssignments.length; i++) {  // For each of the possible assignments
			hypothet = possibleAssignments[i];
			console.log("Currently testing assignment of table " + hypothet);
			if ((tableData[hypothet][0] - 1) == 0){ // If 
				for (h = 1; h < keys.length; h++) {  // For each of the remaining kids who need to be assigned
					if (possibilities[keys[h]].length == 1 && possibilities[keys[h]][0] == hypothet) { // If kid has a possibility list of length 1 and with the value hypothet
						whyNotPossible.push(keys[h]);     // Push that kid onto whyNotPossible array
						var t = possibleAssignments.splice(i, 1); // Take this kid out of possible assignments 
						notPossible.push(t);	// Put him in the notPossible list
					}
				}
				console.log(nextID + " will fill table " + hypothet);
			}else{  // If this assignment won't fill up the table, just the kids who are blacklisted with nextID need to be checked
				if (IdInBlack){ // If the nextID is a key in the blacklist at all
					console.log("Number of things in nextIDs blacklist: " + blacklists[nextID].length);
					for (j = 0; j < blacklists[nextID].length; j++) { // For each of the things that are blacklisted with nextID
						var p = [blacklists[nextID][j]]; // Setting p = next thing that is blacklisted with nextID
						console.log("Must check: " + p);
						if ((p in assignments) == false){ // If p hasnt already been assigned
							if ((possibilities[p].length == 1) && (possibilities[p][0] == hypothet)) { // If it has a possibility list of length 1 and with value hypothet
								whyNotPossible.push(keys[j]);										   // Put this kid id in the whyNotPossible list
								notPossible.push(possibleAssignments.splice(i, 1));					   // Take this possible assignment onto the notPossible list
							}
						}
					}
				}
			}
		}
		console.log("possibleAssignments: " + possibleAssignments);
		console.log("notPossibleAssignments: ") + notPossible;

		///////////////////////////////
		/// EVALUATING TABLE VALUES ///
		///////////////////////////////

		if (possibleAssignments.length > 0) {  // If there are some possible assignments
			var toBeAssigned;
			var realPossibilies = [];
			if (possibleAssignments.length == 1){
				toBeAssigned = possibleAssignments[0];
			}else{
				console.log("GOT TO VALUE ZONE (NOT FUNCTION)");
				var maxValue;
				var movValue
				maxValue = getValue(kidIDs[nextID - 1].isBoy, kidIDs[nextID - 1].isRowdy, tableData[possibleAssignments[0]])
				realPossibilies.push(possibleAssignments[0]);
				for (w = 1; w < possibleAssignments.length; w++) {
					console.log("GOT TO FOR LOOP");
					movValue = getValue(kidIDs[nextID - 1].isBoy, kidIDs[nextID - 1].isRowdy, tableData[w]);
					console.log(movValue);
					if (movValue == maxValue){
						realPossibilies.push(possibleAssignments[w]);
					}
					else if (movValue > maxValue){
						maxValue = movValue;
						realPossibilies = [possibleAssignments[w]];
					}
				}
				toBeAssigned = possibleAssignments[Math.floor(Math.random() * possibleAssignments.length)];
			}

			console.log("toBeAssigned: " + toBeAssigned);

			////////////////////////////
			// ASSIGNING TABLE TO KID //
			////////////////////////////

			xDepth = xDepth + 1;

			documentation[xDepth] = [nextID, [toBeAssigned], []];
			assignments[nextID] = toBeAssigned; 
			
			tableData[toBeAssigned][0] = tableData[toBeAssigned][0] - 1;
			if (kidIDs[nextID - 1].isBoy){
				tableData[toBeAssigned][1] = tableData[toBeAssigned][1] + 1;
				documentation[xDepth][1].push(1);
				if (kidIDs[nextID - 1].isRowdy){
					tableData[toBeAssigned][2] = tableData[toBeAssigned][2] + 1;
					documentation[xDepth][1].push(1);
				}else{
					documentation[xDepth][1].push(0);
				}
				documentation[xDepth][1].push(0);
			}else{
				console.log(tableData[toBeAssigned][1]);
				tableData[toBeAssigned][1] = tableData[toBeAssigned][1] - 1;
				console.log(tableData[toBeAssigned][1]);
				documentation[xDepth][1].push(-1);
				documentation[xDepth][1].push(0);
				if (kidIDs[nextID - 1].isRowdy){
					tableData[toBeAssigned][3] = tableData[toBeAssigned][3] + 1;
					documentation[xDepth][1].push(1);
				}else{
					documentation[xDepth][1].push(0);
				}
			}
			var g;
			delete possibilities[nextID];
			if (IdInBlack) {
				for (i = 0; i < blacklists[nextID].length; i++) {
					g = blacklists[nextID][i];
					if (g in possibilities){
						if (contains(toBeAssigned, possibilities[g])) {
							var index = possibilities[g].indexOf(toBeAssigned);
							possibilities[g].splice(index, 1); 
							documentation[xDepth][2].push([p, toBeAssigned]);
						}
					}
				}
			}
			if (tableData[toBeAssigned][0] == 0){
				for (h = 0; h < keys.length; h++) {
					g = keys[h];
					if (g != nextID && g in possibilities){
						if (contains(toBeAssigned, possibilities[g])) {
							var inced = possibilities[g].indexOf(toBeAssigned);
							possibilities[g].splice(inced, 1); 
						}
					}
				}
			}
		}

		////////////////////
		/// BACKTRACKING ///
		////////////////////

		if (possibleAssignments.length == 0) {


		}

		console.log(assignments);
		console.log(tableData);
		console.log(possibilities);

	}

}




function getValue(isBoy, isRowdy, data){
	
	var value = 0;
	if (isBoy == true){ // if the assiny is a boy
		if (data[1] != 0) {
			value = value - (data[1]);
			if (data[1] > 0){
				value = value - 2;
			}else if (data[1] < 0){
				value = value + 2;
			}
		}if (isRowdy == true){
			value = value - data[2];
		}
	}else{ // girl
		if (data[0] != 0) {
			value = value + (data[1]);
			if (data[1] > 0){
				value = value + 2;
			}else if (data[1] < 0){
				value = value - 2;
			}
		}if (isRowdy == true){
			value = value - data[3];
		}
	}
	console.log("value: " + value);
	console.log("GOT A VALUE")
	return value;
}

function contains(k, arraySearch) {
  for(var i=0; i < arraySearch.length; i++){
    if( arraySearch[i] === k || ( arraySearch[i] !== arraySearch[i] && k !== k ) ){
      return true;
    }
  }
  return false;
}






//make it so that, if the average table vlaue goes to +2 or -2, the possibility of that table is removed from all girls or boys (it can never get to |3|)
//once it goes back down, you can readd it to the possibilities of the items. 