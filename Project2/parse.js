var tokens;
var tree;
var warnings;
var errors;

function parseProgram(tokens, tree, warnings, errors){
  console.log("Begin Parsing...");
  this.tokens = tokens;
  this.tree = tree;
  this.warnings = warnings;
  this.errors = errors;
  parseBlock();
  matchToken(tokens.shift(), "END_OF_PROGRAM_TOKEN");
}

function matchToken(token, expectedValue){
  if(errors.length == 0){
    if(token.type == expectedValue){
      console.log("Match found");
      tree.push(token.type);
    }
    else{
      console.log("Error: Found " + token.type + "; expected: " + expectedValue);
      var error = {type:"INCORRECT_CHARACTER_ERROR", value:token.type, expected:expectedValue, line:token.line};
      errors.push(error);
    }
  }
}

function parseBlock(){
  matchToken(tokens.shift(), "OPEN_BRACKET_TOKEN", errors, tree);
  parseStatementList();
  matchToken(tokens.shift(), "CLOSE_BRACKET_TOKEN", errors, tree);
}

function parseStatementList(){
  if((tokens[0].type == "PRINT_TOKEN") || (tokens[0].type == "ID_TOKEN") || (tokens[0].type == "VAR_TYPE_TOKEN") || (tokens[0].type == "WHILE_TOKEN") || (tokens[0].type == "IF_TOKEN") || (tokens[0].type == "OPEN_BRACKET_TOKEN")){
    parseStatement();
    parseStatementList();
  }
  else{
    //Epsilon Production
  }
}

function parseStatement(){
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
}

function parsePrintStatement(){
  matchToken(tokens.shift(), "PRINT_TOKEN");
  matchToken(tokens.shift(), "OPEN_PAREN_TOKEN");
  parseExpr();
  matchToken(tokens.shift(), "CLOSE_PAREN_TOKEN");
}

function parseAssignmentStatement(){
  parseId();
  matchToken(tokens.shift(), "ASSIGNMENT_TOKEN");
  parseExpr();
}

function parseVarDecl(){
  matchToken(tokens.shift(), "VAR_TYPE_TOKEN");
  parseId();
}

function parseWhileStatement(){
  matchToken(tokens.shift(), "WHILE_TOKEN");
  parseBooleanExpr();
  parseBlock();
}

function parseIfStatement(){
  matchToken(tokens.shift(), "IF_TOKEN");
  parseBooleanExpr();
  parseBlock();
}

function parseExpr(){
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
}

function parseIntExpr(){
  matchToken(tokens.shift(), "INTEGER_TOKEN");
  if(tokens[0].type == "ADDITION_TOKEN"){
    matchToken(tokens.shift(), "ADDITION_TOKEN");
    parseExpr();
  }
}

function parseStringExpr(){
  matchToken(tokens.shift(), "QUOTE_TOKEN");
  parseCharList();
  matchToken(tokens.shift(), "QUOTE_TOKEN");
}

function parseBooleanExpr(){
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
}

function parseId(){
  matchToken(tokens.shift(), "ID_TOKEN");
}

function parseCharList(){
  if(tokens[0].type == "CHARACTER_TOKEN"){
    matchToken(tokens.shift(), "CHARACTER_TOKEN");
  }
  else {
    //Epsilon Production
  }
}

function parseBoolOp(){
  if(tokens[0].type == "INEQUALITY_COMPARATOR_TOKEN"){
    matchToken(tokens.shift(), "INEQUALITY_COMPARATOR_TOKEN");
  }
  else{
    matchToken(tokens.shift(), "EQUALITY_COMPARATOR_TOKEN");
  }
}

function parseBoolVal(){
  matchToken(tokens.shift(), "BOOL_VAL_TOKEN");
}
