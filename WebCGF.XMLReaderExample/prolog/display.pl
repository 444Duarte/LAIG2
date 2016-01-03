% Print Triangles
printTriangle([0|_]) :-     write('|   ').
printTriangle([1|1]) :- 	write('| '),
							name(C,[9651]), 
							write(C),
							write(' ').
printTriangle([1|2]) :- 	write('| '),
							name(C,[9650]), 
							write(C),
							write(' ').
printTriangle([2|1]) :- 	write('| '),
							name(C,[9661]), 
							write(C),
							write(' ').
printTriangle([2|2]) :- 	write('| '),
							name(C,[9660]), 
							write(C),
							write(' ').							

% Print Border
printBoarder([]):- write('-\n').
printBoarder([_| NEXT_COLUMNS]):-   write('----'),
									printBoarder(NEXT_COLUMNS).

% Print Row
printRow([]):- write('|\n').
printRow([TRIANGLE | NEXT_TRIANGLES]) :-    printTriangle(TRIANGLE),
										    printRow(NEXT_TRIANGLES).			


% Print board
printBoard(N, [ROW|[]]) :-	printBoarder([_|ROW]),
							printIndexRow(N),
							printRow(ROW),
							printBoarder([_|ROW]). % Last row
printBoard(N,[ROW | NEXT_ROWS]) :-  NEXT_ROWS \= [],
                                    printBoarder([_|ROW]),
									printIndexRow(N),
								    printRow(ROW),
								    NEXT is N+1,
								    printBoard(NEXT, NEXT_ROWS).

%Print index
printBoardIndex([ROW | NEXT_ROWS]):-write('    '),
									printBoarder(ROW),
									write('    '),
									printIndexCol(0, ROW),		
									printBoarder([_|ROW]),
							    	printIndexRow(0),
							    	printRow(ROW),
							    	printBoard(1,NEXT_ROWS).

printIndexCol(_,[]):- write('|\n').
printIndexCol(N, [_|NEXT_COLUMNS]):-N<10,		
									write('| '),
									CHAR is N+48,
									name(C,[CHAR]),
									write(C),
									write(' '),
									NEXT is N+1,
									printIndexCol(NEXT, NEXT_COLUMNS). 

printIndexCol(N, [_|NEXT_COLUMNS]):-N >= 10,
                                    write('| '),
									CHAR is N+48+7,
									name(C,[CHAR]),
									write(C),
									write(' '),
									NEXT is N+1,
									printIndexCol(NEXT, NEXT_COLUMNS).
printIndexRow(N):-	N<10,
					write('| '),
					CHAR is N+48,
					name(C,[CHAR]),
					write(C),
					write(' ').

printIndexRow(N):-	N>=10,
                    write('| '),
					CHAR is N+48+7,
					name(C,[CHAR]),
					write(C),
					write(' ').

% Print player
printPlayer(PLAYER) :-  write('Player '),
                        write(PLAYER),
                        write(':'), nl.

% Print Winner
printWinner(PLAYER) :-  write('Player '),
                        write(PLAYER),
                        write(' won the game!'), nl.
printDraw :-  write('There is no more available cells to be played! This is a draw!'), nl.

% Invalid
printInvalidCoord :- write('Invalid position! Press any key to retry...'), nl.
