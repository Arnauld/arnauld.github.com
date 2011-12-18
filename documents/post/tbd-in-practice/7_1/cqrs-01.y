
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
  : AGGREGATE identifier optional_extends '{' '}'
    {$$ = new yy.aggregate_root($2,$3,[]);}
  | AGGREGATE identifier optional_extends '{' 
      featureList
    '}'
    {$$ = new yy.aggregate_root($2,$3,$5);}
  ;

optional_extends
  : EXTENDS identifier
    {$$ = [$2];}
  | 
    {$$ = [];}
  ;

featureList
  : feature featureList
    {$$ = $2; $2.unshift($1);}
  | feature
    {$$ = [$1];}
  ;

feature
  : behavioralFeature
    {$$=$1;}
  | structuralFeature
    {$$=$1;}
  ;

structuralFeature
  : identifier ':' identifier
    {$$ = new yy.field($1, $3);}
  ;

behavioralFeature
  : DEF      identifier '(' argumentList ')'
    {$$ = new yy.def($2, $4);}
  | FACTORY  identifier '(' argumentList ')'
    {$$ = new yy.factory($2, $4);}
  ;

argumentList
  : argument ',' argumentList
    {$$ = $3; $3.unshift($1);}
  | argument
    {$$ = [$1];}
  | 
    {$$ = [];}
  ;

argument
  : identifier ':' identifier
    {$$ = new yy.argument($1, $3);}
  ;

identifier
  : IDENTIFIER
    {$$ = yytext;}
  ;