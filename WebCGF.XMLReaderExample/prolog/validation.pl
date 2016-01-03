% Triangle on the right
validCoords(BOARD, _, ROW) :-  getNumberRows(BOARD, NROWS),
                                    ROW >= NROWS,
                                    !,
                                    fail.
validCoords(_, _, ROW) :-       ROW < 0,
                                    !,
                                    fail.
validCoords(BOARD, COLUMN, _) :-    getNumberCols(BOARD, NCOLS),
                                    COLUMN >= NCOLS,
                                    !,
                                    fail.
validCoords(_, COLUMN, _) :-  COLUMN < 0,
                                    !,
                                    fail.
validCoords(BOARD, COLUMN, ROW) :-  getTriangle(BOARD, COLUMN, ROW, [_ | PLAYER]),
                                    PLAYER \= 0,
                                    !,
                                    fail.

validCoords(BOARD, COLUMN, ROW) :-  C1 is COLUMN + 1,
                                    getTriangle(BOARD, C1, ROW, [_ | PLAYER]),
                                    PLAYER \= 0.
% Triangle on the left
validCoords(BOARD, COLUMN, ROW) :-  C1 is COLUMN - 1,
                                    getTriangle(BOARD, C1, ROW, [_ | PLAYER]),
                                    PLAYER \= 0.
% Triangle on the top
validCoords(BOARD, COLUMN, ROW) :-  R1 is ROW - 1,
                                    getTriangle(BOARD, COLUMN, R1, [TYPE | PLAYER]),
                                    TYPE == 1,
                                    PLAYER \= 0.
% Triangle on the bottom
validCoords(BOARD, COLUMN, ROW) :-  R1 is ROW + 1,
                                    getTriangle(BOARD, COLUMN, R1, [TYPE | PLAYER]),
                                    TYPE == 2,
                                    PLAYER \= 0.

% Check if a player is winner                            
checkWinner(BOARD,PLAYER):- checkWinnerRow(BOARD, 0, BOARD, PLAYER).

checkWinnerRow(_, _, [], _):- false.
checkWinnerRow(BOARD, ROW, [CURR_ROW|NEXT_ROW], PLAYER):-   NEXT_ROW \= [],
                                                            ((R is ROW+1, checkWinnerRow(BOARD, R, NEXT_ROW, PLAYER)) ;
                                                             startCheckWinnerCol(BOARD, ROW, CURR_ROW, PLAYER)).


startCheckWinnerCol(BOARD, ROW , [FIRST_ROW|SECOND_ROW], PLAYER):- checkWinnerCol(BOARD, 1, ROW, FIRST_ROW, SECOND_ROW, PLAYER).


checkWinnerCol(_, _, _, _, [_|[]], _):- fail.

checkWinnerCol(BOARD, COL, ROW, _, [CURR_CELL|NEXT_CELL], PLAYER):-     NEXT_CELL \= [],
                                                                        C is COL+1,
                                                                        checkWinnerCol(BOARD, C, ROW, CURR_CELL, NEXT_CELL, PLAYER).
checkWinnerCol(BOARD, COL, ROW, PREVIOUS_CELL, [_|NEXT_CELL], PLAYER):- NEXT_CELL \= [],
                                                                        checkWinnerCell(BOARD, COL, ROW, PREVIOUS_CELL, NEXT_CELL, PLAYER).

checkWinnerCell(BOARD,COL, ROW, [_|PLAYER_LEFT], [[_|PLAYER_RIGHT]|_], PLAYER):-    PLAYER_LEFT =\= 0,
                                                                                    PLAYER_LEFT == PLAYER_RIGHT,
                                                                                    R is ROW+1,
                                                                                    getTriangle(BOARD, COL, R, [TYPE|PLAYER]),
                                                                                    [TYPE|PLAYER] \= [],
                                                                                    PLAYER == PLAYER_LEFT,
                                                                                    TYPE == 2.

checkWinnerCell(BOARD,COL, ROW, [_|PLAYER_LEFT], [[_|PLAYER_RIGHT]|_], PLAYER):-ROW > 0,
                                                                                PLAYER_LEFT =\= 0,
                                                                                PLAYER_LEFT =:= PLAYER_RIGHT,
                                                                                R is ROW-1,
                                                                                getTriangle(BOARD, COL, R, [TYPE|PLAYER]),
                                                                                PLAYER =:= PLAYER_LEFT,
                                                                                TYPE =:= 1.
