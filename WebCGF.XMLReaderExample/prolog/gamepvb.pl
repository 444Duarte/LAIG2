% Player vs Bot Game Loop
initialPlayPvB(BOARD, DIFFICULTY) :-   clearConsole,
                        printBoardIndex(BOARD),
                        PLAYER = 1,
                        printPlayer(PLAYER),
                        readCoord(X, Y),
                        getNumberCols(BOARD, NCOLS),
                        getNumberRows(BOARD, NROWS),
                        X < NCOLS, X >= 0,
                        Y < NROWS, Y >= 0,
                        insertTriangle(X, Y, BOARD, NEW_BOARD, [1|1]),
                        nextPlayer(PLAYER, NEXT_PLAYER),
                        playPvB(NEW_BOARD, NEXT_PLAYER, DIFFICULTY).
% Invalid coordinates
initialPlayPvB(BOARD, DIFFICULTY) :-   printInvalidCoord,
                        readAnyKey,
                        !, 
                        initialPlayPvB(BOARD, DIFFICULTY).

% One player has won
playPvB(BOARD, PLAYER, _) :-  nextPlayer(PLAYER, PREVIOUS_PLAYER),
                        checkWinner(BOARD, PREVIOUS_PLAYER),
                        clearConsole,
                        printBoardIndex(BOARD),
                        printWinner(PREVIOUS_PLAYER), !.
% No one won yet, has playable cells
playPvB(BOARD, PLAYER, DIFFICULTY) :-  hasAvailableCells(BOARD),
                        clearConsole,
                        printBoardIndex(BOARD),
                        printPlayer(PLAYER),
                        makeMovePvB(BOARD, NEW_BOARD, PLAYER, DIFFICULTY),
                        nextPlayer(PLAYER, NEXT_PLAYER),
                        !,
                        playPvB(NEW_BOARD, NEXT_PLAYER, DIFFICULTY).
% Draw
playPvB(_, _, _) :- printDraw. 

% Player make a move
makeMovePvB(BOARD, RESULT, 2, DIFFICULTY) :-   botTurn(BOARD, RESULT, 2, DIFFICULTY).
makeMovePvB(BOARD, RESULT, 1, _) :-   readCoord(X, Y),
                                validCoords(BOARD, X, Y),
                                calcTriangleType(BOARD, X, Y, TYPE),
                                insertTriangle(X, Y, BOARD, RESULT, [TYPE | 1]).
% Invalid movement coordinates
makeMovePvB(BOARD, _, PLAYER, DIFFICULTY) :-   printInvalidCoord,
                                readAnyKey,
                                !,
                                playPvB(BOARD, PLAYER, DIFFICULTY).
