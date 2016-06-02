'use_strict';

/*

*** Specifications of the CSV (in french):

** Field format: 

- le classement, peu importe le format
- le temps (pas de centièmes, ni de dizièmes), la plupart des formats sont reconnus, le plus courant est du style 02:23:45
- le nom et prénom dans cet ordre (donc dans une seule colonne)
- la catégorie, sous cette forme : CA JU ES SE V1 V2 V3 V4 V5, seul les 2 premiers caractères sont pris en compte, donc s'il y a SEH, cela fonctionne aussi.
- le sexe, sous cette forme : H ou M, F (il faut donc 2 colonnes séparés pour la catégorie et le sexe)
- le club (peut-être vide)
- Il faut une ligne d'entête avant le premier résultat, peut importe son contenu. Le séparateur des champs pour le csv est ;


** Example of valid csv:

class;temps;nom;cat;sexe;club
1;30'38;KIPKURUI CHERUIYOT Benjamin;SE;M;
2;32'07;MULEKI SEYA Patrick;ES;M;Asvel Villeurbanne*

*/


(function () {

	/*
	* Constants:
	*/
	var LAST_PAGE = 39;

	/*
	* Variables:
	*/

	var csv = "";
	var pages = [];

	/*
	* Main:
	*/

	insertJqueryOnThePage();
	setTimeout(processCsv(), 500);
	

	/*
	* Functions:
	*/

	/**
	* Inserts the jquery library in the header of the page, if necessary.
	*/
	function insertJqueryOnThePage(){
		var s = document.createElement('script');
		s.setAttribute('src', 'http://code.jquery.com/jquery-latest.min.js');

	    if (typeof jQuery == 'undefined') {
	        document.getElementsByTagName('head')[0].appendChild(s);
	    }
	}

	/**
	* Append the content of the array pages[] to the csv variable and
	* display the csv variable
	*/
    function fulfillCsvAndDisplayIt(){
    	// Insert the head line : 
    	csv += 'class;temps;nom;cat;sexe;club';

    	// Add pages content to the csv :
    	for (var i = 0; i < pages.length; i++) {
    		csv += pages[i];
    	}

    	console.log(csv);
    }

	/**
	* Parse the content of a line, and return a string respecting the CSV format given in the spec.
	* 
	* @param $line : jquery - Element corresponding to the table line to parse.
	* @return a string based on the following format : 
	*	class;temps;nom;cat;sexe;club
	*/
    function parseLine($line){
    	return '' +
    	$line.find('.place').html() + ';' +
    	$line.find('.temps').html() + ';' +
    	$line.find('.nom').html() + ';' +
    	$line.find('.cat').html().substr(0,2) + ';' +
    	$line.find('.sexe').html() + ';' +
    	$line.find('.club').html().replace('&nbsp;', '');
    }

	/**
	* Executes an AJAX request to get the content of the i'th page, 
	* parse the page,
	* add the parsed content to pages[i]. 
	* If it is the last page, execute lastPageCallBack();
	*
	* @param i index of the page to GET
	* @param lastPageCallBack callback to execute at the last page (when i === LAST_PAGE)
	*/
    function getPageAndParseIt(i, lastPageCallBack){
    	$.get('http://www.sport-up.fr/site/resultat/partenaire-20160419025577-'+i+'00-100.htm', function(page){
    		var $page = $(page);

	    	// Init page string;
	    	pages[i] = "";

	    	// Get the Table lines and complete the page String
	    	$page.find('.ligne_res')
	    		.each(function(){ 
	    			// Add the content of the line to the page string.
	    			pages[i] += '\n' + parseLine($(this));
	    		});

	    	// If it is the last page, execute the callback (Print the csv).
	    	if(i === LAST_PAGE){
	    		lastPageCallBack();
	    	}
    	});    	
    }

    /**
    * Get each page and parse the table on them.
    * At the end, fulfill and display the csv.
    */
    function processCsv(){
    	// Parse each page to fulfill the CSV + display the csv at the end:
    	for (var i = 0; i <= LAST_PAGE; i++) {
    		// Get the page and parse it + display the csv once all the pages have been parsed.
    		getPageAndParseIt(i, fulfillCsvAndDisplayIt);
    	}
    }

})();