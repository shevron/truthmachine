/* Sentential logic grammar in Jison-flavored Bison grammar file */

/* lexical grammar */
%lex

%%
\s+                   { /* skip whitespace */ }
"."|"•"|"*"           { return 'CON';   }
"v"|"∨"|"+"           { return 'DIS';   }
">"|"⊃"               { return 'IMP';   }
"="|"≡"               { return 'EQV';   }
"~"|"!"               { return 'NEG';   }
"TRUE"|"FALSE"        { return 'CONST'; }
[a-zA-Z]              { return 'VAR';   }
"("|"{"|"["           { return '(';     }
")"|"}"|"]"           { return ')';     }
<<EOF>>               { return 'EOF';   }

/lex

/* operator associations and precedence */

%left  'CON' 'DIS' 'IMP' 'EQV'
%left  'CONST' 'VAR'
%right 'NEG'

%% /* language grammar */

sentence
    : outerwff EOF { return $1; }
    ;

outerwff
    : wff
    | wff binaryconnector wff { $$ = [$2, $1, $3]; }
    ;

wff
    : atomicprop
        { $$ = $1; }
    | '(' wff ')'
        { $$ = $2; }
    | '(' wff binaryconnector wff ')'
        { $$ = [$3, $2, $4]; }
    | unaryconnector wff
        { $$ = [$1, $2]; }
    ;

/* TODO: is there a better way to do this? */
binaryconnector
    : CON { $$ = 'CON'; }
    | DIS { $$ = 'DIS'; }
    | IMP { $$ = 'IMP'; }
    | EQV { $$ = 'EQV'; }
    ;

unaryconnector
    : NEG    { $$ = 'NEG'; }
    ;

atomicprop
    : CONST
        { $$ = ($1 == 'TRUE'); }
    | VAR
        { $$ = $1; }
    ;
