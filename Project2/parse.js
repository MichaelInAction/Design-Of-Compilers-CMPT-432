var tokens;
var CurrentNode;
var warnings;
var errors;

function parseProgram(tokens, FirstNode, warnings, errors){
  console.log("Begin Parsing...");
  this.tokens = tokens;
  CurrentNode = FirstNode;
  this.warnings = warnings;
  this.errors = errors;
  parseBlock();
  matchToken(tokens.shift(), "END_OF_PROGRAM_TOKEN");
}

function matchToken(token, expectedValue){
  if(errors.length == 0){
    if(token.type == expectedValue){
      console.log("Match found");
      var NewNode = {parent:CurrentNode, value:token.value, children:[]};
      CurrentNode.children.push(NewNode);
    }
    else{
      console.log("Error: Found " + token.type + "; expected: " + expectedValue);
      var error = {type:"INCORRECT_CHARACTER_ERROR", value:token.type, expected:expectedValue, line:token.line};
      errors.push(error);
    }
  }
}

function parseBlock(){
  var NewNode = {parent:CurrentNode, value:"BLOCK", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "OPEN_BRACKET_TOKEN");
  parseStatementList();
  matchToken(tokens.shift(), "CLOSE_BRACKET_TOKEN");
  CurrentNode = NewNode.parent;
}

function parseStatementList(){
  var NewNode = {parent:CurrentNode, value:"STATEMENT LIST", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  if((tokens[0].type == "PRINT_TOKEN") || (tokens[0].type == "ID_TOKEN") || (tokens[0].type == "VAR_TYPE_TOKEN") || (tokens[0].type == "WHILE_TOKEN") || (tokens[0].type == "IF_TOKEN") || (tokens[0].type == "OPEN_BRACKET_TOKEN")){
    parseStatement();
    parseStatementList();
  }
  else{
    //Epsilon Production
  }
  CurrentNode = NewNode.parent;
}

function parseStatement(){
  var NewNode = {parent:CurrentNode, value:"STATEMENT", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
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

function parsePrintStatement(){
  var NewNode = {parent:CurrentNode, value:"PRINT STATEMENT", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "PRINT_TOKEN");
  matchToken(tokens.shift(), "OPEN_PAREN_TOKEN");
  parseExpr();
  matchToken(tokens.shift(), "CLOSE_PAREN_TOKEN");
  CurrentNode = NewNode.parent;
}

function parseAssignmentStatement(){
  var NewNode = {parent:CurrentNode, value:"ASSIGNMENT STATEMENT", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  parseId();
  matchToken(tokens.shift(), "ASSIGNMENT_TOKEN");
  parseExpr();
  CurrentNode = NewNode.parent;
}

function parseVarDecl(){
  var NewNode = {parent:CurrentNode, value:"VARIABLE DECLARATION", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "VAR_TYPE_TOKEN");
  parseId();
  CurrentNode = NewNode.parent;
}

function parseWhileStatement(){
  var NewNode = {parent:CurrentNode, value:"WHILE STATEMENT", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "WHILE_TOKEN");
  parseBooleanExpr();
  parseBlock();
  CurrentNode = NewNode.parent;
}

function parseIfStatement(){
  var NewNode = {parent:CurrentNode, value:"IF STATEMENT", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "IF_TOKEN");
  parseBooleanExpr();
  parseBlock();
  CurrentNode = NewNode.parent;
}

function parseExpr(){
  var NewNode = {parent:CurrentNode, value:"EXPRESSION", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
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

function parseIntExpr(){
  var NewNode = {parent:CurrentNode, value:"INTEGER EXPRESSION", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "INTEGER_TOKEN");
  if(tokens[0].type == "ADDITION_TOKEN"){
    matchToken(tokens.shift(), "ADDITION_TOKEN");
    parseExpr();
  }
  CurrentNode = NewNode.parent;
}

function parseStringExpr(){
  var NewNode = {parent:CurrentNode, value:"STRING EXPRESSION", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "QUOTE_TOKEN");
  parseCharList();
  matchToken(tokens.shift(), "QUOTE_TOKEN");
  CurrentNode = NewNode.parent;
}

function parseBooleanExpr(){
  var NewNode = {parent:CurrentNode, value:"BOOLEAN EXPRESSION", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
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

function parseId(){
  var NewNode = {parent:CurrentNode, value:"ID", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "ID_TOKEN");
  CurrentNode = NewNode.parent;
}

function parseCharList(){
  var NewNode = {parent:CurrentNode, value:"CHAR LIST", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  if(tokens[0].type == "CHARACTER_TOKEN"){
    matchToken(tokens.shift(), "CHARACTER_TOKEN");
    parseCharList();
  }
  else {
    //Epsilon Production
  }
  CurrentNode = NewNode.parent;
}

function parseBoolOp(){
  var NewNode = {parent:CurrentNode, value:"BOOLEAN OPERATION", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  if(tokens[0].type == "INEQUALITY_COMPARATOR_TOKEN"){
    matchToken(tokens.shift(), "INEQUALITY_COMPARATOR_TOKEN");
  }
  else{
    matchToken(tokens.shift(), "EQUALITY_COMPARATOR_TOKEN");
  }
  CurrentNode = NewNode.parent;
}

function parseBoolVal(){
  var NewNode = {parent:CurrentNode, value:"BOOLEAN VALUE", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  matchToken(tokens.shift(), "BOOL_VAL_TOKEN");
  CurrentNode = NewNode.parent;
}
