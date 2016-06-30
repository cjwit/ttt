var assert = chai.assert;
var expect = chai.expect;

describe('makeX and makeO', function() {
    describe('makeX', function() {
        it("should remove all classes from an accepted element, add class x, and change the text to X", function() {
            var e = $('<div/>').addClass('blank').text('test');
            makeX(e);
            assert.equal(e.attr('class'), 'x');
            assert.equal(e.text(), 'X');
            e.remove();
        });
    });
    describe('makeO', function() {
        it("should remove all classes from an accepted element, add class o, and change the text to O", function() {
            var e = $('<div/>').addClass('blank').text('test');
            makeO(e);
            assert.equal(e.attr('class'), 'o');
            assert.equal(e.text(), 'O');
            e.remove();
        });
    })
});

describe("player's click", function() {
    it("should call makeX() when 'charP' is 'x'", function() {
        charP = 'x';
        player($('<td />'));
        expect(spyMakeX).to.have.been.called();
    });

    it("should call makeO() when 'charP' is 'o'", function() {
        charP = 'o';
        player($('<td />'));
        expect(spyMakeO).to.have.been.called();
    });

    it("should call tie() if 'blanks' == 0 and there is no winner", function() {
        $('table td').removeClass('blank');
        player($('<td />'));
        expect(spyTie).to.have.been.called();
    });

    it("should call computer() if 'blanks' !== 0 and there is no winner", function() {
        $('table td').addClass('.blank')
        player($('<td />'));
        expect(spyComputer).to.have.been.called();
    });
});

describe("the computer's turn", function() {
    describe('findBestChoice', function() {
        it("should check each potential option and determine the best choice as a number that references 'combos'", function() {
            charC = 'o';
            charP = 'x';
            $('table td').removeClass().addClass('blank');
            $('#c1').removeClass('blank').addClass('o');
            $('#c2').removeClass('blank').addClass('o');
            $('#b2').removeClass('blank').addClass('x');
            assert.equal(findBestChoice(), 2);
        });
    });

    describe('getCurrentOptions', function() {
        it("should return an array of blank squares that are suitable choices for the next move", function() {
            charC = 'o';
            charP = 'x';

            // one blank
            $('table td').removeClass().addClass('blank');
            $('#c1').removeClass('blank').addClass('o');
            $('#c2').removeClass('blank').addClass('o');
            $('#b2').removeClass('blank').addClass('x');
            var bestChoice = findBestChoice()
            var blankTestSquares = getCurrentOptions(bestChoice);
            assert.equal(1, blankTestSquares.length)
            blankTestSquares.forEach(function(square) {
                assert.equal(true, $(square).hasClass('blank'))
            })

            $('table td').removeClass().addClass('blank');
            $('#a1').removeClass('blank').addClass('o');
            $('#a2').removeClass('blank').addClass('x');
            var bestChoice = findBestChoice()
            var blankTestSquares = getCurrentOptions(bestChoice);
            assert.equal(4, blankTestSquares.length)
            blankTestSquares.forEach(function(square) {
                assert.equal(true, $(square).hasClass('blank'))
            })
        });

        it('should return an array of all empty squares if there are no clear best options', function() {
            charC = 'o';
            charP = 'x';

            $('table td').removeClass().addClass('blank');
            $('#a2').removeClass('blank').addClass('x');
            var bestChoice = findBestChoice()
            var blankTestSquares = getCurrentOptions(bestChoice);
            assert.equal(8, blankTestSquares.length)
            blankTestSquares.forEach(function(square) {
                assert.equal(true, $(square).hasClass('blank'))
            })
        })
    });
});

describe('following each square selection', function() {
    describe('checkForWin', function() {
        victory = false;
        it("should check each potential combination for three consecutive Xs or Os", function() {

            // if no win
            $('table td').removeClass().addClass('blank');
            $('#a1').removeClass('blank').addClass('o');
            $('#a2').removeClass('blank').addClass('x');
            $('#b2').removeClass('blank').addClass('o');
            $('#c2').removeClass('blank').addClass('x');
            checkForWin();
            assert.equal(false, victory);

            // if there is a win
            $('table td').removeClass().addClass('blank');
            $('#a1').removeClass('blank').addClass('o');
            $('#a2').removeClass('blank').addClass('x');
            $('#b2').removeClass('blank').addClass('x');
            $('#c2').removeClass('blank').addClass('x');
            checkForWin();
            assert.equal(true, victory);
        });

        it("should pass the winning set of squares to onWin if one exists", function() {
            charC = 'o';
            charP = 'x';
            victory = false;

            $('table td').removeClass().addClass('blank');
            $('#a1').removeClass('blank').addClass('o');
            $('#a2').removeClass('blank').addClass('x');
            $('#b2').removeClass('blank').addClass('x');
            $('#c2').removeClass('blank').addClass('x');
            checkForWin();
            expect(spyOnWin).to.have.been.called();
        });
    });
});

describe('the end of the game', function() {
    describe('onWin', function() {
        describe("if it is player 1's turn", function() {
            var squares = ['#a1','#a2', '#a3']

            it("should increment wins", function() {
                p1 = true;
                var currentWins = record.wins;
                currentWins += 1;
                onWin(squares);
                assert.equal(currentWins, record.wins);
            });
            it("should add class 'win' to squares", function() {
                assert.equal($(squares[0]).hasClass('win'), true);
                assert.equal($(squares[1]).hasClass('win'), true);
                assert.equal($(squares[2]).hasClass('win'), true);
            });
        });

        describe("if it is the computer's turn", function() {
            var squares = ['#a1','#a2', '#a3']
            it("should increment losses", function() {
                p1 = false;
                var currentLosses = record.losses;
                currentLosses += 1;
                onWin(squares);
                assert.equal(currentLosses, record.losses);
            });
            it("should add class 'lose' to squares", function() {
                assert.equal($(squares[0]).hasClass('lose'), true);
                assert.equal($(squares[1]).hasClass('lose'), true);
                assert.equal($(squares[2]).hasClass('lose'), true);
            });
        });
    });
    
    describe('tie', function() {
        it('should increment ties', function() {
            var currentTies = record.ties;
            currentTies += 1;
            tie();
            assert.equal(currentTies, record.ties);
        })
    });

    describe('reset', function() {
        it("should set p1 to true, victory to false (a new game is beginning) and add class 'blank' to all TD elements", function() {
            reset();
            assert.equal(p1, true);
            assert.equal(victory, false);
        });
    });
});
