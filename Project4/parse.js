var tokens;
var CurrentNode;
var symbols;
var warnings;
var errors;
var output;
var count;

function parseProgram(tokens, FirstNode, symbols, warnings, errors){
  console.log("Begin Parsing...");
  output = "";
  this.tokens = tokens;
  CurrentNode = FirstNode;
  this.symbols = symbols;
  this.warnings = warnings;
  this.errors = errors;
  this.count = 0;
  parseBlock();
  matchToken(tokens, "END_OF_PROGRAM_TOKEN");
  return output;
}

function matchToken(token, expectedValue){
  if(errors.length == 0){
    if(tokens[count].type == expectedValue){
      console.log("Match found");
      var NewNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
      CurrentNode.children.push(NewNode);
      output = output + "PARSER: Found " + tokens[count].type + "; Expecting " + expectedValue + "\n";
      this.count = this.count + 1;
    }
    else{
      console.log("Error: Found " + tokens[count].type + "; expected: " + expectedValue);
      var error = {type:"INCORRECT_CHARACTER_ERROR", value:tokens[count].type, expected:expectedValue, line:tokens[count].line};
      errors.push(error);
      output = output + "PARSER: INCORRECT_CHARACTER_ERROR! Found " + tokens[count].type + "; Expecting " + expectedValue + " on line " + tokens[count].line + "\n";
    }
  }
}

function parseBlock(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"BLOCK", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    matchToken(tokens, "OPEN_BRACKET_TOKEN");
    parseStatementList();
    matchToken(tokens, "CLOSE_BRACKET_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseStatementList(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"STATEMENT LIST", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if((tokens[count].type == "PRINT_TOKEN") || (tokens[count].type == "ID_TOKEN") || (tokens[count].type == "VAR_TYPE_TOKEN") || (tokens[count].type == "WHILE_TOKEN") || (tokens[count].type == "IF_TOKEN") || (tokens[count].type == "OPEN_BRACKET_TOKEN")){
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
    if(tokens[count].type == "PRINT_TOKEN"){
      parsePrintStatement();
    }
    else if(tokens[count].type == "ID_TOKEN"){
      parseAssignmentStatement();
    }
    else if(tokens[count].type == "VAR_TYPE_TOKEN"){
      parseVarDecl();
    }
    else if(tokens[count].type == "WHILE_TOKEN"){
      parseWhileStatement();
    }
    else if(tokens[count].type == "IF_TOKEN"){
      parseIfStatement();
    }
    else if(tokens[count].type == "OPEN_BRACKET_TOKEN"){
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
    matchToken(tokens, "PRINT_TOKEN");
    matchToken(tokens, "OPEN_PAREN_TOKEN");
    parseExpr();
    matchToken(tokens, "CLOSE_PAREN_TOKEN");
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
    matchToken(tokens, "ASSIGNMENT_TOKEN");
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
    var NewSymbol = {id:tokens[count + 1].value , type:tokens[count].value , line:tokens[count].line};
    symbols.push(NewSymbol);
    matchToken(tokens, "VAR_TYPE_TOKEN");
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
    matchToken(tokens, "WHILE_TOKEN");
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
    matchToken(tokens, "IF_TOKEN");
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
    if(tokens[count].type == "INTEGER_TOKEN"){
      parseIntExpr();
    }
    else if(tokens[count].type == "QUOTE_TOKEN"){
      parseStringExpr();
    }
    else if(tokens[count].type == "OPEN_PAREN_TOKEN" || tokens[count].type == "BOOL_VAL_TOKEN"){
      parseBooleanExpr();
    }
    else if(tokens[count].type == "ID_TOKEN"){
      parseId();
      if(tokens[count].type == "ADDITION_TOKEN"){
        matchToken(tokens, "ADDITION_TOKEN");
        parseExpr();
      }
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
    matchToken(tokens, "INTEGER_TOKEN");
    if(tokens[count].type == "ADDITION_TOKEN"){
      matchToken(tokens, "ADDITION_TOKEN");
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
    matchToken(tokens, "QUOTE_TOKEN");
    parseCharList();
    matchToken(tokens, "QUOTE_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseBooleanExpr(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"BOOLEAN EXPRESSION", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[count].type == "OPEN_PAREN_TOKEN"){
      matchToken(tokens, "OPEN_PAREN_TOKEN");
      parseExpr();
      parseBoolOp();
      parseExpr();
      matchToken(tokens, "CLOSE_PAREN_TOKEN");
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
    matchToken(tokens, "ID_TOKEN");
    CurrentNode = NewNode.parent;
  }
}

function parseCharList(){
  if(errors.length == 0){
    var NewNode = {parent:CurrentNode, value:"CHAR LIST", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    output = output + "PARSER: Parsing " + CurrentNode.value + "...\n";
    if(tokens[count].type == "CHARACTER_TOKEN"){
      matchToken(tokens, "CHARACTER_TOKEN");
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
    if(tokens[count].type == "INEQUALITY_COMPARATOR_TOKEN"){
      matchToken(tokens, "INEQUALITY_COMPARATOR_TOKEN");
    }
    else{
      matchToken(tokens, "EQUALITY_COMPARATOR_TOKEN");
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
    matchToken(tokens, "BOOL_VAL_TOKEN");
    CurrentNode = NewNode.parent;
  }
}
