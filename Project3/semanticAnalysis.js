var tokens;
var symbols;
var warnings;
var errors;
var output;
var count;
var scopes;
var currentScope;
var nextScope;
var CurrentNode;

function checkSemantics(tokens, FirstNode, symbols, warnings, errors){
  console.log("Begin Semantic Analysis...");
  output = "";
  scopes = [];
  currentScope = 0;
  nextScope = 1;
  count = 0;
  this.tokens = tokens;
  CurrentNode = FirstNode;
  this.symbols = symbols;
  this.warnings = warnings;
  this.errors = errors;
  block();
  return output;
}

function block(){
  if(errors.length == 0){
    console.log("SA: Block");
    //Next token is a {
    count++;
    var temp = {scope:nextScope, outerScope:currentScope};
    scopes.push(temp);
    currentScope = nextScope;
    nextScope = nextScope + 1;
    var NewNode = {parent:CurrentNode, value:"BLOCK", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    statementList();
    CurrentNode = NewNode.parent;
    currentScope = temp.outerScope;
    //Next token is a }
    count++;
  }
}

function statementList(){
  if((tokens[count].type == "PRINT_TOKEN") || (tokens[count].type == "ID_TOKEN") || (tokens[count].type == "VAR_TYPE_TOKEN") || (tokens[count].type == "WHILE_TOKEN") || (tokens[count].type == "IF_TOKEN") || (tokens[count].type == "OPEN_BRACKET_TOKEN")){
    console.log("SA: Statement List");
    count++;
    statement();
    statementList();
  }
  else{
    //Epsilon Production
  }
}

function statement(){
  if(tokens[count].type == "PRINT_TOKEN"){
    printStatement();
  }
  else if(tokens[count].type == "ID_TOKEN"){
    sssignmentStatement();
  }
  else if(tokens[count].type == "VAR_TYPE_TOKEN"){
    varDecl();
  }
  else if(tokens[count].type == "WHILE_TOKEN"){
    whileStatement();
  }
  else if(tokens[count].type == "IF_TOKEN"){
    ifStatement();
  }
  else if(tokens[count].type == "OPEN_BRACKET_TOKEN"){
    block();
  }
}

function printStatement(){

}

function assignmentStatement(){

}

function varDecl(){

}

function whileStatement(){

}

function ifStatement(){

}

function expr(){

}

function intExpr(){

}

function stringExpr(){

}

function booleanExpr(){

}

function id(){

}

function charList(){

}

function type(){

}

function char(){

}

function space(){

}

function digit(){

}

function boolop(){

}

function boolval(){

}

function intop(){

}
