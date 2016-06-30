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
	var result;
	if (p1) {
		result = 'win';
		record.wins += 1;
	} else {
		result = 'lose';
		record.losses += 1;
	}

	$(squares[0]).removeClass().addClass(result);
	$(squares[1]).removeClass().addClass(result);
	$(squares[2]).removeClass().addClass(result);

	var gloat = window.setTimeout(reset, 2000);
	return;
}

var checkForWin = function() {
	var squares;
	for (i = 0; i < combos.length; i++) {
		if ($(combos[i][0]).hasClass('x') && $(combos[i][1]).hasClass('x') && $(combos[i][2]).hasClass('x')) {
			squares = combos[i];
			victory = true;

		} else if ($(combos[i][0]).hasClass('o') && $(combos[i][1]).hasClass('o') && $(combos[i][2]).hasClass('o')) {
			squares = combos[i];
			victory = true;
		}

		if (victory) {
			spyOnWin(squares);
			break;
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
	var bestChoice = [];
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
			bestChoice = [i];
			curPriority = priority;
		} else if (priority === curPriority) {
			bestChoice.push(i);
		}
	}
	return bestChoice;
}

var getCurrentOptions = function(bestChoice) {
	var blankSquares = [];

	// find blanks within the best row choices
	bestChoice.map(function(choice) {
		var row = [combos[choice][0], combos[choice][1], combos[choice][2]];
		row.forEach(function(id) {
			if ($(id).hasClass('blank') && blankSquares.indexOf(id) === -1) {
				blankSquares.push(id);
			}
		});
	});
	return blankSquares;
}

var computer = function() {
	var bestChoice = findBestChoice();
	var blankSquares = getCurrentOptions(bestChoice);

	// pick one of the blank squares
	var elementID = blankSquares[Math.floor(Math.random() * blankSquares.length)];
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
var spyOnWin = chai.spy(onWin);

$(document).ready(function(){
	init();
});
