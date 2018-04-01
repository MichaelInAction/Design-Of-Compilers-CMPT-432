var tokens;
var CurrentNode;
var symbols;
var warnings;
var errors;
var output;

function parseProgram(tokens, FirstNode, symbols, warnings, errors){
  console.log("Begin Parsing...");
  output = "";
  this.tokens = tokens;
  CurrentNode = FirstNode;
  this.symbols = symbols;
  this.warnings = warnings;
  this.errors = errors;
  parseBlock();
  matchToken(tokens.shift(), "END_OF_PROGRAM_TOKEN");
  return output;
}

function matchToken(token, expectedValue){
  if(errors.length == 0){
    if(token.type == expectedValue){
      console.log("Match found");
      var NewNode = {parent:CurrentNode, value:token.value, children:[]};
      CurrentNode.children.push(NewNode);
      output = output + "PARSER: Found " + token.type + "; Expecting " + expectedValue + "\n";
    }
    else{
      console.log("Error: Found " + token.type + "; expected: " + expectedValue);
      var error = {type:"INCORRECT_CHARACTER_ERROR", value:token.type, expected:expectedValue, line:token.line};
      errors.push(error);
      output = output + "PARSER: INCORRECT_CHARACTER_ERROR! Found " + token.type + "; Expecting " + expectedValue + " on line " + token.line + "\n";
    }
  }
}

function parseBlock(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"BLOCK", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "OPEN_BRACKET_TOKEN");
    parseStatementList();
    matchToken(tokens.shift(), "CLOSE_BRACKET_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseStatementList(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"STATEMENT LIST", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if((tokens[0].type == "PRINT_TOKEN") || (tokens[0].type == "ID_TOKEN") || (tokens[0].type == "VAR_TYPE_TOKEN") || (tokens[0].type == "WHILE_TOKEN") || (tokens[0].type == "IF_TOKEN") || (tokens[0].type == "OPEN_BRACKET_TOKEN")){
      parseStatement();
      parseStatementList();
    }
    else{
      //Epsilon Production
      output = output + "PARSER: Processing \u03B5 Production...\n";
    }
    CurrentNode = NewNode.parent;
  }
}

function parseStatement(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"STATEMENT", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[0].type == "PRINT_TOKEN"){
      parsePrintStatement();
    }
    else if(tokens[0].type == "ID_TOKEN"){
      parseAssignmentStatement();
    }
    else if(tokens[0].type == "VAR_TYPE_TOKEN"){
      parseVarDecl();
    }
    else if(tokens[0].type == "WHILE_TOKEN"){
      parseWhileStatement();
    }
    else if(tokens[0].type == "IF_TOKEN"){
      parseIfStatement();
    }
    else if(tokens[0].type == "OPEN_BRACKET_TOKEN"){
      parseBlock();
    }
    CurrentNode = NewNode.parent;
  }
}

function parsePrintStatement(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"PRINT STATEMENT", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "PRINT_TOKEN");
    matchToken(tokens.shift(), "OPEN_PAREN_TOKEN");
    parseExpr();
    matchToken(tokens.shift(), "CLOSE_PAREN_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseAssignmentStatement(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"ASSIGNMENT STATEMENT", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    parseId();
    matchToken(tokens.shift(), "ASSIGNMENT_TOKEN");
    parseExpr();
    CurrentNode = NewNode.parent;
  }
}

function parseVarDecl(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"VARIABLE DECLARATION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    var NewSymbol = {id:tokens[1].value , type:tokens[0].value , line:tokens[0].line};
    symbols.push(NewSymbol);
    matchToken(tokens.shift(), "VAR_TYPE_TOKEN");
    parseId();
    CurrentNode = NewNode.parent;
  }
}

function parseWhileStatement(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"WHILE STATEMENT", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "WHILE_TOKEN");
    parseBooleanExpr();
    parseBlock();
    CurrentNode = NewNode.parent;
  }
}

function parseIfStatement(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"IF STATEMENT", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "IF_TOKEN");
    parseBooleanExpr();
    parseBlock();
    CurrentNode = NewNode.parent;
  }
}

function parseExpr(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"EXPRESSION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[0].type == "INTEGER_TOKEN"){
      parseIntExpr();
    }
    else if(tokens[0].type == "QUOTE_TOKEN"){
      parseStringExpr();
    }
    else if(tokens[0].type == "OPEN_PAREN_TOKEN"){
      parseBooleanExpr();
    }
    else if(tokens[0].type == "ID_TOKEN"){
      parseId();
    }
    CurrentNode = NewNode.parent;
  }
}

function parseIntExpr(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"INTEGER EXPRESSION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "INTEGER_TOKEN");
    if(tokens[0].type == "ADDITION_TOKEN"){
      matchToken(tokens.shift(), "ADDITION_TOKEN");
      parseExpr();
    }
    CurrentNode = NewNode.parent;
  }
}

function parseStringExpr(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"STRING EXPRESSION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "QUOTE_TOKEN");
    parseCharList();
    matchToken(tokens.shift(), "QUOTE_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseBooleanExpr(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"BOOLEAN EXPRESSION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[0].type == "OPEN_PAREN_TOKEN"){
      matchToken(tokens.shift(), "OPEN_PAREN_TOKEN");
      parseExpr();
      parseBoolOp();
      parseExpr();
      matchToken(tokens.shift(), "CLOSE_PAREN_TOKEN");
    }
    else {
      parseBoolVal();
    }
    CurrentNode = NewNode.parent;
  }
}

function parseId(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"ID", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "ID_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseCharList(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"CHAR LIST", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[0].type == "CHARACTER_TOKEN"){
      matchToken(tokens.shift(), "CHARACTER_TOKEN");
      parseCharList();
    }
    else {
      //Epsilon Production
      output = output + "PARSER: Processing \u03B5 Production...\n";
    }
    CurrentNode = NewNode.parent;
  }
}

function parseBoolOp(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"BOOLEAN OPERATION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[0].type == "INEQUALITY_COMPARATOR_TOKEN"){
      matchToken(tokens.shift(), "INEQUALITY_COMPARATOR_TOKEN");
    }
    else{
      matchToken(tokens.shift(), "EQUALITY_COMPARATOR_TOKEN");
    }
    CurrentNode = NewNode.parent;
  }
}

function parseBoolVal(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"BOOLEAN VALUE", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens.shift(), "BOOL_VAL_TOKEN");
    CurrentNode = NewNode.parent;
  }
}
