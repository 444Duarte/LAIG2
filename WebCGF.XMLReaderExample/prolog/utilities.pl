% Create the board
createBoard([], _, 0).
createBoard([ROW | NEXT_ROWS], COLUMNS, ROWS):-     ROWS \= 0,
                                                    createRow(ROW, COLUMNS),
                                                    R1 is ROWS - 1,
                                                    createBoard(NEXT_ROWS, COLUMNS, R1).
createRow([], 0).
createRow([COLUMN | NEXT_COLUMNS], COLUMNS) :-  COLUMNS \= 0,
                                                C1 is COLUMNS - 1,
                                                createColumn(COLUMN),
                                                createRow(NEXT_COLUMNS, C1).
createColumn([0|0]).

% Get a triangle in a column. 1. row, 2. column number, 3. value [type | player]

getTriangleCol([VALUE | _], 0, VALUE).
getTriangleCol([_ | NCOLS], COLUMN, VALUE) :-    COLUMN \= 0,
                                                        C1 is COLUMN - 1,
                                                        getTriangleCol(NCOLS, C1, VALUE).
% Get a triangle in a board. 1. board, 2. column number, 3. row number, 4. value [type | player]
getTriangle([ROW | _], COLUMN, 0, VALUE) :- getTriangleCol(ROW, COLUMN, VALUE).
getTriangle([_ | NROWS], COLUMN, ROW, VALUE) :-     ROW \= 0,
                                                    R1 is ROW - 1,
                                                    getTriangle(NROWS, COLUMN, R1, VALUE).

% Insert triangle - 1. column, 2. row, 3. result row, 4. value [triangle, player]
insertTriangleCol(0, [_ | NCOLUMNS], [VALUE | NCOLUMNS], VALUE).
insertTriangleCol(C, [COL | NCOLUMNS], [COL | RESULT_NCOLUMNS], VALUE) :-   C \= 0,
                                                                            C1 is C - 1,
                                                                            insertTriangleCol(C1, NCOLUMNS, RESULT_NCOLUMNS, VALUE).
% Insert triangle - 1. column, 2. row, 3. board, 4. result board, 5. value [triangle, player]
insertTriangle(C, 0, [ROW | NROW], [RESULT_ROW | NROW], VALUE) :- insertTriangleCol(C, ROW, RESULT_ROW, VALUE). 
insertTriangle(C, R, [ROW | NROW], [ROW | RESULT_NROW], VALUE) :-   R \= 0,
                                                                    R1 is R - 1,
                                                                    insertTriangle(C, R1, NROW, RESULT_NROW, VALUE).

% Calculate triangle type on a given cell. 1. board, 2. column, 3. row, 4. type
% Check right triangle
calcTriangleType(BOARD, C, R, TYPE) :-  C1 is C + 1,
                                        getTriangle(BOARD, C1, R, [TYPE1 | PLAYER]),
                                        PLAYER \= 0,
                                        (TYPE1 == 1 ->
                                                TYPE = 2;
                                                TYPE = 1).
% Check left triangle                                        
calcTriangleType(BOARD, C, R, TYPE) :-  C1 is C - 1,
                                        getTriangle(BOARD, C1, R, [TYPE1 | PLAYER]),
                                        PLAYER \= 0,
                                        (TYPE1 == 1 ->
                                                TYPE = 2;
                                                TYPE = 1).
% Check top triangle
calcTriangleType(BOARD, C, R, TYPE) :-  R1 is R - 1,
                                        getTriangle(BOARD, C, R1, [TYPE1 | PLAYER]),
                                        PLAYER \= 0,
                                        TYPE1 == 1,
                                        TYPE = 2. 
% Check bottom triangle
calcTriangleType(BOARD, C, R, TYPE) :-  R1 is R + 1,
                                        getTriangle(BOARD, C, R1, [TYPE1 | PLAYER]),
                                        PLAYER \= 0,
                                        TYPE1 == 2,
                                        TYPE = 1. 
% Default triangle type Default triangle type
calcTriangleType(_, _, _, 1).

% Available cells
numberEmptyCols([], 0).
numberEmptyCols([[_ | PLAYER] | NCOL], N) :-    numberEmptyCols(NCOL, N1),
                                                (PLAYER == 0 ->
                                                        N is N1 + 1;
                                                        N is N1).
numberEmptyCells([], 0).                                
numberEmptyCells([ROW | NROW], N) :-    numberEmptyCols(ROW, N1),
                                        numberEmptyCells(NROW, N2),
                                        N is N1 + N2.
hasAvailableCells(BOARD) :- numberEmptyCells(BOARD, N),
                            N \= 0.

% Board dimensions
numberCols([], 0).
numberCols([_ | NEXT_COLS], N) :-   numberCols(NEXT_COLS, N1),
                                    N is N1 + 1.
getNumberCols([ROW | _], N) :- numberCols(ROW, N). 

getNumberRows([], 0).
getNumberRows([_ | NEXT_ROWS], N) :-    getNumberRows(NEXT_ROWS, N1),
                                        N is N1 + 1. 
