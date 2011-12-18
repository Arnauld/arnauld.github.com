
%lex
digit                       [0-9]
esc                         "\\"
int                         "-"?(?:[0-9]|[1-9][0-9]+)
exp                         (?:[eE][-+]?[0-9]+)
frac                        (?:\.[0-9]+)

%%
\s+                                                           /* skip whitespace */
\/\/[^\n]*                                                    /* skip comment */
":"                                                           return ':'
","                                                           return ','
"("                                                           return '('
")"                                                           return ')'
"{"                                                           return '{'
"}"                                                           return '}'
"["                                                           return '['
"]"                                                           return ']'
"aggregateRoot"                                               return 'AGGREGATE'
"def"                                                         return 'DEF'
"extends"                                                     return 'EXTENDS'
"factory"                                                     return 'FACTORY'
\"(?:{esc}["bfnrt/{esc}]|{esc}"u"[a-fA-F0-9]{4}|[^"{esc}])*\" return 'STRING_LIT';
{int}{frac}?{exp}?\b                                          return 'NUMBER_LIT';
[A-Za-z_0-9-]+                                                return 'IDENTIFIER';
<<EOF>>                                                       return 'EOF';

/lex

%%

file
    : aggregateDefList EOF
        {return $1;}
    ;

aggregateDefList
    : aggregateDef aggregateDefList
        {$$ = $2; $2.unshift($1);}
    | aggregateDef
        {$$ = [$1];}
    ;

aggregateDef
    : AGGREGATE IDENTIFIER optional_extends '{' '}'
        {$$ = [$2, $3];}
    ;

optional_extends
    : EXTENDS IDENTIFIER
        {$$ = [$2];}
    | 
        {$$ = [];}
    ;