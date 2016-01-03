% Bot vs Bot Game Loop
initialPlayBvB(BOARD, DIFFICULTY) :-   clearConsole,
                        printBoardIndex(BOARD),
                        PLAYER = 1,
                        printPlayer(PLAYER),
                        getNumberCols(BOARD, NCOLS),
                        randomColumn(NCOLS, X),
                        getNumberRows(BOARD, NROWS),
                        randomRow(NROWS, Y),
                        X < NCOLS, X >= 0,
                        Y < NROWS, Y >= 0,
                        insertTriangle(X, Y, BOARD, NEW_BOARD, [1|1]),
                        nextPlayer(PLAYER, NEXT_PLAYER),
                        playBvB(NEW_BOARD, NEXT_PLAYER, DIFFICULTY).
% Invalid coordinates
initialPlayBvB(BOARD, DIFFICULTY) :-   printInvalidCoord,
                        readAnyKey,
                        !, 
                        initialPlayBvB(BOARD, DIFFICULTY).

% One player has won
playBvB(BOARD, PLAYER, _) :-  nextPlayer(PLAYER, PREVIOUS_PLAYER),
                        checkWinner(BOARD, PREVIOUS_PLAYER),
                        clearConsole,
                        printBoardIndex(BOARD),
                        printWinner(PREVIOUS_PLAYER), !.
% No one won yet, has playable cells
playBvB(BOARD, PLAYER, DIFFICULTY) :-  hasAvailableCells(BOARD),
                        clearConsole,
                        printBoardIndex(BOARD),
                        printPlayer(PLAYER),
                        makeMoveBvB(BOARD, NEW_BOARD, PLAYER, DIFFICULTY),
                        nextPlayer(PLAYER, NEXT_PLAYER),
                        !,
                        playBvB(NEW_BOARD, NEXT_PLAYER, DIFFICULTY).
% Draw
playBvB(_, _, _) :- printDraw. 

% Player make a move
makeMoveBvB(BOARD, RESULT, PLAYER, DIFFICULTY) :-   botTurn(BOARD, RESULT, PLAYER, DIFFICULTY).

% Invalid movement coordinates
makeMoveBvB(BOARD, _, PLAYER, DIFFICULTY) :-   printInvalidCoord,
                                readAnyKey,
                                !,
                                playBvB(BOARD, PLAYER, DIFFICULTY).
