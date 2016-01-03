% Player vs Player Game Loop
initialPlayPvP(BOARD) :-   clearConsole,
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
                        playPvP(NEW_BOARD, NEXT_PLAYER).

initialPlayPvP(BOARD, NEW_BOARD,PLAYER, X,Y, TYPE) :-
      getNumberCols(BOARD, NCOLS),
      getNumberRows(BOARD, NROWS),
      X < NCOLS, X >= 0,
      Y < NROWS, Y >= 0,
      insertTriangle(X, Y, BOARD, NEW_BOARD, [TYPE|PLAYER]).
% Invalid coordinates
initialPlayPvP(BOARD) :-   printInvalidCoord,
                        readAnyKey,
                        !, 
                        initialPlayPvP(BOARD).

% One player has won
playPvP(BOARD, PLAYER) :-  nextPlayer(PLAYER, PREVIOUS_PLAYER),
                        checkWinner(BOARD, PREVIOUS_PLAYER),
                        clearConsole,
                        printBoardIndex(BOARD),
                        printWinner(PREVIOUS_PLAYER), !.
% No one won yet, has playable cells
playPvP(BOARD, PLAYER) :-  hasAvailableCells(BOARD),
                        clearConsole,
                        printBoardIndex(BOARD),
                        printPlayer(PLAYER),
                        makeMovePvP(BOARD, NEW_BOARD, PLAYER),
                        nextPlayer(PLAYER, NEXT_PLAYER),
                        !,
                        playPvP(NEW_BOARD, NEXT_PLAYER).
% Draw
playPvP(_, _) :- printDraw. 

% Player make a move
makeMovePvP(BOARD, RESULT, PLAYER) :-  readCoord(X, Y),
                                    validCoords(BOARD, X, Y),
                                    calcTriangleType(BOARD, X, Y, TYPE),
                                    insertTriangle(X, Y, BOARD, RESULT, [TYPE | PLAYER]).

% Player make a move
makeMovePvP(BOARD, RESULT, PLAYER, X, Y) :-
      validCoords(BOARD, X, Y),
      calcTriangleType(BOARD, X, Y, TYPE),
      insertTriangle(X, Y, BOARD, RESULT, [TYPE | PLAYER]).

% Invalid movement coordinates
makeMovePvP(BOARD, _, PLAYER) :-   printInvalidCoord,
                                readAnyKey,
                                !,
                                playPvP(BOARD, PLAYER).
