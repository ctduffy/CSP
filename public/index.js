// client side javascript for index page

// COLLAPSIBLE CODE FROM MATERIALIZE
var socket = io.connect();

function blacklist(){
    var div = $('#black')
    var butt = $('[name="butt"]');

    var kids = $('.k');
    for (var i = 0; i<div.length; i++){
        div[i].style.display = "";
        butt[i].innerHTML = 'Save Blacklist';
        $(butt[i]).attr('onclick', 'saveblacklist()');
    }
    for (var j = 0; j< kids.length; j++){
        //goes through all kids
        kids[j].style.cursor = "pointer";
    }

    $(".k").on("click", function(e) {
       $(this).toggleClass("selected");
    }); 
}

$('#switch').on("click", function() {
    $first = $(".selected:eq(0)");
    $second = $(".selected:eq(1)");
    if ($second.length > 0){
        var tempText = $first.innerHTML();
        console.log(tempText)
        $first.text($second.innerHTMl());
        $second.text(tempText);
        $first.removeClass('selected');
        $second.removeClass('selected');
    } else {
        alert('Please choose another name to switch with');
    }
}); 

$('#add').on("click", function() {
    $('#blacklist_table tr:last').after('<td class=\"k\"><input type=\"text\" size=\"10\"></input></td><td class=\"k\"><input type=\"text\" size=\"10\"></input></td>')
}); 

function saveblacklist(){
    var butt = $('[name="butt"]');
    var div = $('#black')
    //socket.emit('saveBlacklist', newList);
    var kids = $('.k');
    for (var i = 0; i<div.length; i++){
        div[i].style.display = "none";
        butt[i].innerHTML = 'Edit Blacklist';
        $(butt[i]).attr('id', 'blacklist_button');
    }
    for (var j = 0; j< kids.length; j++){
        //goes through all kids
        kids[j].style.cursor = "default";
    }
}


window.addEventListener('load', function(){

    socket.on('doneTables', function(tblnum){
        window.location = tblnum+'/tables';
    });

    $(".generate").click(function(event){
        var class1 = parseInt($("#group_of_kids").val());
        var numtbls = parseInt($("#num_of_tables1").val());
        var numchrs = parseInt($("#num_of_chairs1").val());
        var counter = 0;
        var kidsInClass;
        event.preventDefault();
        socket.emit('numKids', class1);
        socket.on('kidsnum', function(numkds){
            kidsInClass = numkds;
            console.log(class1 +' '+ numtbls +' '+ numchrs +' ')
            if(class1 == 0 || numtbls == 0 || numchrs == 0){
                alert("Please select a grade and/or a number of tables and chairs!");
            }
            else{
                var tblList = [];
                var numtbls1 = parseInt($("#num_of_tables2").val());
                var numchrs1 = parseInt($("#num_of_chairs2").val());
                if (numtbls1 == 0 || numchrs1 == 0){
                    for(var i = 0; i<numtbls; i++){
                        tblList.push(numchrs);
                        counter += numchrs;
                    }
                }
                else{
                    for(var i = 0; i<numtbls; i++){
                        tblList.push(numchrs);
                        counter+=numchrs;
                    }
                    for(var j = 0; j<numtbls1; j++){
                        tblList.push(numchrs1);
                        counter+=numchrs1;
                    }
                }
                if(kidsInClass > counter){
                    alert("Please make sure there are enough chairs for the amount of children in the grade");
                }
                else{
                    socket.emit('gettables', tblList, class1);
                    $('#wholePage').hide();
                    $('#loading').show(function(){
                        message();
                    });
                }
            }
        });
    });
    $('#kids_number').on('click', function(){
        var numnew = parseInt($('#new_kids').val());
        //var newgrade = parseInt($('.new_name').html());
        if(numnew == 0 || numnew == NaN){
            alert('Please type in a valid number before clicking update!');
        }
        else{
            var rowCount = ($('#new_kids_table > tbody > tr').length - 1);
            console.log(rowCount);
            numnew = numnew - rowCount;
            for(var i = 0; i<numnew; i++){
                $('#new_kids_table tr:last').after('<tr class = \'tri\' ><td name=\"name\" class = \'name\' class=\"namebox\"><input type=\"text\" size=\"12\"></input></td><td><form class=\"radio\"><input type=\"radio\"  name=\"gender\" class=\'male\' value=\"1\">M<input type=\"radio\" name=\"gender\" value=\"0\">F</form></td><td><input type=\"checkbox\" name=\"disrupt\" value=\"rowdy\"></td><td><input type=\"checkbox\" name=\"social\" value=\"social\"></td></tr>');
            }
            $('#new_kids').val('');
        }
    });
    $('#rename').on('click', function(){
        var grd = $('#new_name').val();
        if(grd == ''){
            alert('Please type in something before clicking update!');
        }
        else{
            $('#newgroup').text(grd);
            $('#new_name').val('');
        }

    });
    $('#save').on('click', function(){
        var grade = $('#new_name').val();
        var len = $('#new_kids_table > td').length;
        var kids = [];
        if(len == null){
            alert('Please type in all of the names and attributes before saving this list!');
        }
        else{
            $('#new_kids_table tr').each(function() {
                var name = '';
                var gender = true;
                var disrupt = false;
                var social = false;
                $(this).find('td').each(function(){
                    var r = $(this);
                    var inp = r.find("input");
                    if(inp.attr('name') == 'gender'){
                        if(inp.eq(0).is(':checked')){
                            gender=false;
                        }
                        //console.log('gender: '+ gender);
                    }
                    else if(inp.attr('name') == 'disrupt'){
                        if(inp.is(':checked')){
                            disrupt = true;
                        }
                    }
                    else if(inp.attr('name') == 'social'){
                        if(inp.is(':checked')){
                            social = true;
                        }
                    }
                    else{
                        name = inp.val();
                        //console.log('name: ' + name);
                    }
                    //console.log("NAME:\t" + inp.attr('name'));
                    //console.log("VAL:\t" + inp.val());
                    //console.log("CHECKED:\t" + inp.is(':checked'));

                });
                console.log(grade);
                if(name == ''){

                }
                else{
                    socket.emit('addChild', grade, name, gender, disrupt, social);
                }
            });
            socket.emit('newGrade', grade);
            window.location.reload(true);
        }
    });
});


$(window).on('beforeunload', function(){
    socket.close();
});

(function ($) {
    $.fn.collapsible = function(options) {
    var defaults = {
        accordion: undefined
    };

    options = $.extend(defaults, options);


    return this.each(function() {

        var $this = $(this);

        var $panel_headers = $(this).find('> li > .collapsible-header');

        var collapsible_type = $this.data("collapsible");

        // Turn off any existing event handlers
        $this.off('click.collapse', '> li > .collapsible-header');
        $panel_headers.off('click.collapse');


        /****************
        Helper Functions
        ****************/

        // Accordion Open
        function accordionOpen(object) {
            $panel_headers = $this.find('> li > .collapsible-header');
            if (object.hasClass('active')) {
                object.parent().addClass('active');
            }
            else {
                object.parent().removeClass('active');
            }
            if (object.parent().hasClass('active')){
                object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
            }
            else{
                object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
            }

            $panel_headers.not(object).removeClass('active').parent().removeClass('active');
            $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).slideUp(
            {
                duration: 350,
                easing: "easeOutQuart",
                queue: false,
                complete:
                function() {
                    $(this).css('height', '');
                }
            });
            if ($(window).width() > 1000){
                for (var i=0; i<$('.collapsible-body').length; i++)
                    $('.collapsible-body')[i].style.margin = "0 150px";
            }
        }

        // Expandable Open
        function expandableOpen(object) {
            if (object.hasClass('active')) {
                object.parent().addClass('active');
            }
            else {
                object.parent().removeClass('active');
            }
            if (object.parent().hasClass('active')){
                object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
            }
            else{
                object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
            }
        }

        /**
         * Check if object is children of panel header
        * @param  {Object}  object Jquery object
        * @return {Boolean} true if it is children
        */
        function isChildrenOfPanelHeader(object) {

            var panelHeader = getPanelHeader(object);

            return panelHeader.length > 0;
        }

        /**
        * Get panel header from a children element
        * @param  {Object} object Jquery object
        * @return {Object} panel header object
        */
        function getPanelHeader(object) {
            return object.closest('li > .collapsible-header');
        }

        /*****  End Helper Functions  *****/



        // Add click handler to only direct collapsible header children
        $this.on('click.collapse', '> li > .collapsible-header', function(e) {
            var $header = $(this),
            element = $(e.target);

            if (isChildrenOfPanelHeader(element)) {
                element = getPanelHeader(element);
            }

            element.toggleClass('active');

            if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
                accordionOpen(element);
            } else { // Handle Expandables
                expandableOpen(element);

                if ($header.hasClass('active')) {
                    expandableOpen($header);
                }
            }
        });

        // Open first active
        var $panel_headers = $this.find('> li > .collapsible-header');
        if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
        accordionOpen($panel_headers.filter('.active').first());
        }
        else { // Handle Expandables
        $panel_headers.filter('.active').each(function() {
          expandableOpen($(this));
        });
        }

    });
    };

    $(document).ready(function(){
    $('.collapsible').collapsible();
    });
}( jQuery ));




var mList = [ 'These tables are going to be great!', 
                'Get Excited!', 
                'You\'re going to love these tables :)',
                'Just a few more moments. . .',
                'Perfect tables are coming your way :)',
                'This group is a tough one. . .',
                'The algorithm is currently processing your data. . .',
                'Fear not- the longer it takes, the better they\'ll be!',
                'Don\'t worry, this loading time is perfectly normal',
                'If you don\'t like the tables, you can always edit them!',
                'Wow, the tables we\'re generating right now are amazing!',
                'I hope you\'re prepared for some awesome lunch tables!',
                'Just placing a few more kids in the right spots. . .',
                'This shouldn\'t take much longer. . .',
                'The process is almost finished. . .',
                'These tables are about to be the best yet!'
            ];

function message() {
    var message = $('#load');
    var newMessage = "";

    var rNum = Math.floor(Math.random() * mList.length);
    newMessage = mList[rNum];
    mList.splice(rNum, 1);

    if (message.text() != newMessage){
        message.text(newMessage);
    }

    if(mList.length == 0){
        message.text('Sorry this is taking so long. . .');
    }
}
var interval = window.setInterval(message, 5000);