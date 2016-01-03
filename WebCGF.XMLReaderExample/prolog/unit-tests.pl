:- use_module(library(plunit)).
:- include('validation.pl').
:- include('utilities.pl').
:- include('bot.pl').
:- include('display.pl').

createBoard(
[
[ [0|0], [0|0], [0|0], [0|0], [0|0] ],
[ [0|0], [1|2], [0|0], [0|0], [0|0] ],
[ [1|2], [2|1], [0|0], [0|0], [0|0] ],
[ [0|0], [0|0], [0|0], [0|0], [0|0] ],
[ [0|0], [0|0], [0|0], [0|0], [0|0] ]
]
).



testBot:- createBoard(BOARD),
          printBoardIndex(BOARD),    
          botTurn(BOARD, RESULT, 1, 2),
          printBoardIndex(RESULT).  

setup(BOARD):- createBoard(BOARD).

% Validation of get triangle
:- begin_tests(getTriangle).
test(BOARD, true) :-    setup(BOARD),
                        getTriangle(BOARD, 1, 1, [TYPE | PLAYER]),
                        TYPE == 1,
                        PLAYER == 2.

test(BOARD, true) :-    setup(BOARD),
                        getTriangle(BOARD, 4, 4, [TYPE | PLAYER]),
                        TYPE == 0,
                        PLAYER == 0.

test(BOARD, fail) :-    setup(BOARD),
                        getTriangle(BOARD, 0, 1, [TYPE | PLAYER]),
                        TYPE == 1,
                        PLAYER == 1.
:- end_tests(getTriangle).

% Validation of movement
:- begin_tests(validCoord).
test(BOARD, fail) :-    setup(BOARD),
                        validCoords(BOARD, 1, 0).

test(BOARD, true) :-    setup(BOARD),
                        validCoords(BOARD, 0, 1).

test(BOARD, true) :-    setup(BOARD),
                        validCoords(BOARD, 2, 1).

test(BOARD, fail) :-    setup(BOARD),
                        validCoords(BOARD, 1, 2).

test(BOARD, fail) :-    setup(BOARD),
                        validCoords(BOARD, 1, 1).

test(BOARD, fail) :-    setup(BOARD),
                        validCoords(BOARD, -1, 2).

test(BOARD, fail) :-    setup(BOARD),
                        validCoords(BOARD, 6, 7).

:- end_tests(validCoord).

% Validation of insertion
:- begin_tests(insertion).
test(BOARD, true) :-    setup(BOARD),
                        insertTriangle(1, 2, BOARD, RESULT, [2|1]),
                        getTriangle(RESULT, 1, 2, [TYPE | PLAYER]),
                        TYPE == 2,
                        PLAYER == 1. 

test(BOARD, true) :-    setup(BOARD),
                        insertTriangle(4, 4, BOARD, RESULT, [1|1]),
                        getTriangle(RESULT, 4, 4, [TYPE | PLAYER]),
                        TYPE == 1,
                        PLAYER == 1.

test(BOARD, fail) :-    setup(BOARD),
                        insertTriangle(5, 4, BOARD, RESULT, [1|1]),
                        getTriangle(RESULT, 5, 4, [TYPE | PLAYER]),
                        TYPE == 1,
                        PLAYER == 1.
:- end_tests(insertion).



% Validation calculating triangle type
:- begin_tests(triangleType).
test(BOARD, true(TYPE == 2)) :-   setup(BOARD),
                                    calcTriangleType(BOARD, 0, 1, TYPE).
test(BOARD, true(TYPE == 2)) :-   setup(BOARD),
                                    calcTriangleType(BOARD, 1, 2, TYPE).
test(BOARD, true(TYPE == 1)) :-   setup(BOARD),
                                    calcTriangleType(BOARD, 1, 1, TYPE).
:- end_tests(triangleType).

% Validation number empty cells
:- begin_tests(emptyCells).
test(BOARD, true(N == 22)) :- setup(BOARD),
                                numberEmptyCells(BOARD, N).
test(BOARD, true(N == 21)) :- setup(BOARD),
                                insertTriangle(0, 0, BOARD, RESULT, [1|1]),
                                numberEmptyCells(RESULT, N).
test(BOARD, true) :-    setup(BOARD),
                        hasAvailableCells(BOARD).
test(BOARD, fail) :-    setup(BOARD),
                        insertTriangle(0, 0, BOARD, BOARD1, [1|1]),
                        insertTriangle(1, 0, BOARD1, BOARD2, [1|1]),
                        insertTriangle(2, 0, BOARD2, BOARD3, [1|1]),
                        insertTriangle(3, 0, BOARD3, BOARD4, [1|1]),
                        insertTriangle(4, 0, BOARD4, BOARD5, [1|1]),
                        insertTriangle(0, 1, BOARD5, BOARD6, [1|1]),
                        insertTriangle(1, 1, BOARD6, BOARD7, [1|1]),
                        insertTriangle(2, 1, BOARD7, BOARD8, [1|1]),
                        insertTriangle(3, 1, BOARD8, BOARD9, [1|1]),
                        insertTriangle(4, 1, BOARD9, BOARD10, [1|1]),
                        insertTriangle(0, 2, BOARD10, BOARD11, [1|1]),
                        insertTriangle(1, 2, BOARD11, BOARD12, [1|1]),
                        insertTriangle(2, 2, BOARD12, BOARD13, [1|1]),
                        insertTriangle(3, 2, BOARD13, BOARD14, [1|1]),
                        insertTriangle(4, 2, BOARD14, BOARD15, [1|1]),
                        insertTriangle(0, 3, BOARD15, BOARD16, [1|1]),
                        insertTriangle(1, 3, BOARD16, BOARD17, [1|1]),
                        insertTriangle(2, 3, BOARD17, BOARD18, [1|1]),
                        insertTriangle(3, 3, BOARD18, BOARD19, [1|1]),
                        insertTriangle(4, 3, BOARD19, BOARD20, [1|1]),
                        insertTriangle(0, 4, BOARD20, BOARD21, [1|1]),
                        insertTriangle(1, 4, BOARD21, BOARD22, [1|1]),
                        insertTriangle(2, 4, BOARD22, BOARD23, [1|1]),
                        insertTriangle(3, 4, BOARD23, BOARD24, [1|1]),
                        insertTriangle(4, 4, BOARD24, BOARD25, [1|1]),
                        hasAvailableCells(BOARD25).
:- end_tests(emptyCells).

% Validation check winner
:- begin_tests(winner).
test(BOARD, fail) :-    setup(BOARD),
                        checkWinner(BOARD, _).
%  ▲ 
% ▲▽▲ 
test(BOARD, true) :-    setup(BOARD),
                        insertTriangle(1, 1, BOARD, BOARD1, [1|2]),
                        insertTriangle(2, 1, BOARD1, BOARD2, [2|1]),
                        insertTriangle(3, 1, BOARD2, BOARD3, [1|2]),
                        insertTriangle(2, 0, BOARD3, BOARD4, [1|2]),
                        checkWinner(BOARD4, PLAYER),
                        PLAYER == 2.
%  ▲ 
% ▲▼▲ 
test(BOARD, true) :-    setup(BOARD),
                        insertTriangle(1, 1, BOARD, BOARD1, [1|2]),
                        insertTriangle(2, 1, BOARD1, BOARD2, [2|2]),
                        insertTriangle(3, 1, BOARD2, BOARD3, [1|2]),
                        insertTriangle(2, 0, BOARD3, BOARD4, [1|2]),
                        checkWinner(BOARD4, PLAYER),
                        PLAYER == 2.
% ▼△▼
%  ▼
test(BOARD, true) :-    setup(BOARD),
                        insertTriangle(1, 1, BOARD, BOARD1, [2|2]),
                        insertTriangle(2, 1, BOARD1, BOARD2, [1|1]),
                        insertTriangle(3, 1, BOARD2, BOARD3, [2|2]),
                        insertTriangle(2, 2, BOARD3, BOARD4, [2|2]),
                        checkWinner(BOARD4, PLAYER),
                        PLAYER == 2.
% ▼▲▼ 
%  ▼
test(BOARD, true) :-    setup(BOARD),
                        insertTriangle(1, 1, BOARD, BOARD1, [2|2]),
                        insertTriangle(2, 1, BOARD1, BOARD2, [1|2]),
                        insertTriangle(3, 1, BOARD2, BOARD3, [2|2]),
                        insertTriangle(2, 2, BOARD3, BOARD4, [2|2]),
                        checkWinner(BOARD4, PLAYER),
                        PLAYER == 2.
% ▽▲▼ 
%  ▼
test(BOARD, fail) :-    setup(BOARD),
                        insertTriangle(1, 1, BOARD, BOARD1, [2|1]),
                        insertTriangle(2, 1, BOARD1, BOARD2, [1|2]),
                        insertTriangle(3, 1, BOARD2, BOARD3, [2|2]),
                        insertTriangle(2, 2, BOARD3, BOARD4, [2|2]),
                        checkWinner(BOARD4, PLAYER),
                        PLAYER == 2.
:- end_tests(winner).
