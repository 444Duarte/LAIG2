% Input Methods
clearConsole :- clearConsole(50).
clearConsole(0).
clearConsole(LINES) :- 
                LINES \= 0,
                nl,
                N1 is LINES-1,
                clearConsole(N1).

readCoord(X, Y) :-  prompt(_, 'X: '),
                    get_char(X_CHAR),
                    get_char(_),
                    name(X_CHAR, [X_INT_CHAR]),
                    X_INT is X_INT_CHAR-48,
                    (X_INT < 10 ->
                            X = X_INT;
                            X_INT_2 is X_INT - 7,
                            X = X_INT_2),
                    prompt(_, 'Y: '),
                    get_char(Y_CHAR),
                    get_char(_),
                    name(Y_CHAR, [Y_INT_CHAR]),
                    Y_INT is Y_INT_CHAR-48,
                    (Y_INT < 10 ->
                            Y = Y_INT;
                            Y_INT_2 is Y_INT - 7,
                            Y = Y_INT_2),
                    prompt(_, '').

readAnyKey :-   get_char(_).

readBoardSize(C, R) :- prompt(_, 'Number of Columns: '),
                                get_char(C_CHAR),
                                get_char(_),
                                name(C_CHAR, [C_INT_CHAR]),
                                C_INT is C_INT_CHAR-48,
                                (C_INT < 10 ->
                                    C = C_INT;
                                    C_INT_2 is C_INT - 7,
                                C = C_INT_2),
                                prompt(_, 'Number of Rows: '),
                                get_char(R_CHAR),
                                get_char(_),
                                name(R_CHAR, [R_INT_CHAR]),
                                R_INT is R_INT_CHAR-48,
                                (R_INT < 10 ->
                                    R = R_INT;
                                    R_INT_2 is R_INT - 7,
                                R = R_INT_2),
                                prompt(_, '').


