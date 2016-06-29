var p1 = true;
var charP, charC; // starts blank, result of a function called on ready (after choice is made)
var victory = false;
var record = {
	'wins' : 0,
	'losses' : 0,
	'ties' : 0 }
var combos = [['#a1', '#a2', '#a3'],
			['#b1', '#b2', '#b3'],
			['#c1', '#c2', '#c3'],
			['#a1', '#b1', '#c1'],
			['#a2', '#b2', '#c2'],
			['#a3', '#b3', '#c3'],
			['#a1', '#b2', '#c3'],
			['#c1', '#b2', '#a3']]

var updateBlanks = function() {
	var blanks = $('.blank').length;
	return blanks;
}

var tie = function() {
	$('#b2').addClass('tie').text('TIE');
	record.ties += 1;
	var gloat = window.setTimeout(reset, 2000);
	return;
}

var reset = function() {
	$('td').removeClass().html('').addClass('blank');
	$('#wins').text(record.wins);
	$('#losses').text(record.losses);
	$('#ties').text(record.ties);
	p1 = true;
	victory = false;
	return;
}

var onWin = function(squares) {
	if (p1) {
		var result = 'win';
		record.wins += 1;
	} else {
		var result = 'lose';
		record.losses += 1;
	}

	$(squares[0]).removeClass().addClass(result);
	$(squares[1]).removeClass().addClass(result);
	$(squares[2]).removeClass().addClass(result);

	var gloat = window.setTimeout(reset, 2000);
	return;
}

var checkForWin = function() {
	for (i = 0; i < combos.length; i++) {

		var squares;

		if ($(combos[i][0]).hasClass('x') && $(combos[i][1]).hasClass('x') && $(combos[i][2]).hasClass('x')) {
			squares = combos[i];
			victory = true;

		} else if ($(combos[i][0]).hasClass('o') && $(combos[i][1]).hasClass('o') && $(combos[i][2]).hasClass('o')) {
			squares = combos[i];
			victory = true;
		}

		if (victory) {
			onWin(squares);
			return;
		}
	}

	return;
}

var player = function(element) {
	if (charP === 'x') {
		spyMakeX(element)
	} else {
		spyMakeO(element)
	}

	checkForWin();

	if (victory) {
		return;
	}

	p1 = false;

	var blanks = updateBlanks();
	if (blanks === 0) {
		spyTie();
		return;
	} else {
		spyComputer();
		return;
	}
}

var convert = function(squares) {
	var classes = [$(squares[0]).attr('class'), $(squares[1]).attr('class'), $(squares[2]).attr('class')];
	var value = 0;

	for (j = 0; j < 3; j++) {

		if (classes[j] === charC) {
			value += 100;
		}
		if (classes[j] === charP) {
			value += 10;
		}
		if (classes[j] === 'blank') {
			value += 1;
		}
	}
	return value;
}

var findBestChoice = function() {
	// determine the best opportunity
	var bestChoice;
	var curPriority = 0;

	for (i = 0; i < combos.length; i++) {
		var value = convert(combos[i]);
		var priority = 0;
		if (value === 201) {				// two charC, one blank
			priority = 10;
		} else if (value === 21) {			// two charP, one blank
			priority = 9;
		} else if (value === 102) {			// one charC, two blanks
			priority = 8;
		}

		if (priority > curPriority) {
			bestChoice = i;
			curPriority = priority;
		}
	}
	return bestChoice;
}

var getCurrentOptions = function(bestChoice) {
	var blanksSquares = [];

	// find blanks within the best row choice
	if (bestChoice >= 0) {
		var row = [combos[bestChoice][0], combos[bestChoice][1], combos[bestChoice][2]];
		for (i = 0; i < 3; i++) {
			if ($(row[i]).hasClass('blank')) {
				blanksSquares.push(document.getElementById(row[i].substr(1)));
			}
		}

	// there is no best row, blanks are all remaining on the board
	} else {
		var blanksSquares = $('.blank');
	}
	return blanksSquares;
}

var computer = function() {
	var bestChoice = findBestChoice();
	var blanksSquares = getCurrentOptions(bestChoice);

	// pick one of the blank squares
	var elementID = "#" + blanksSquares[Math.floor(Math.random() * blanksSquares.length)].id;
	var element = $(elementID);

	if (charC === 'x') {
		makeX(element)
	} else {
		makeO(element)
	}

	checkForWin();
	if (victory) {
		return;
	}

	p1 = true;
}

var makeX = function(element) {
	if (element.hasClass('blank')) {
		element.removeClass();
		element.addClass('x');
		element.text('X');
	}
	return;
}

var makeO = function(element) {
	if (element.hasClass('blank')) {
		element.removeClass();
		element.addClass('o');
		element.text('O');
	}
	return;
}

// click handler
var clicker = function() {
	$('td').click(function() {
		if (p1) {
			player($(this));
		}
	})
	return;
}

var init = function() {
	$('#xSelect').click(function() {
		charP = 'x';
		charC = 'o';
		$('#selector').css('display', 'none')
		$('#record').css('display', 'block')
		$('table').css('display', 'block')
		clicker();
	});

	$('#oSelect').click(function() {
		charP = 'o';
		charC = 'x';
		$('#selector').css('display', 'none')
		$('#record').css('display', 'block')
		$('table').css('display', 'block')
		clicker();
	});
}

var spyMakeX = chai.spy(makeX);
var spyMakeO = chai.spy(makeO);
var spyTie = chai.spy(tie);
var spyComputer = chai.spy(computer);

$(document).ready(function(){
	init();
});
