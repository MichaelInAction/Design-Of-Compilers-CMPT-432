var tokens;
var warnings;
var errors;
var output;
var count;
var CurrentNode;
var scopes;
var currentScope;
var nextScopeNum;

function checkSemantics(tokens, FirstNode, scopes, warnings, errors){
  console.log("Begin Semantic Analysis...");
  output = "";
  count = 0;
  this.tokens = tokens;
  CurrentNode = FirstNode;
  this.warnings = warnings;
  this.errors = errors;
  this.scopes = scopes;
  currentScope = null;
  nextScopeNum = 0;
  block();
  return output;
}

function block(){
  if(errors.length == 0){
    console.log("SA: Block");
    //Next token is a {
    count++;
    var NewNode = {parent:CurrentNode, value:"BLOCK", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    var tempScope = {outerScope:currentScope, scopeNum:nextScopeNum, variables:[]};
    scopes.push(tempScope);
    currentScope = tempScope;
    nextScopeNum = nextScopeNum + 1;
    statementList();
    CurrentNode = NewNode.parent;
    currentScope = tempScope.outerScope;
    //Next token is a }
    count++;
  }
}

function statementList(){
  if((tokens[count].type == "PRINT_TOKEN") || (tokens[count].type == "ID_TOKEN")
  || (tokens[count].type == "VAR_TYPE_TOKEN") || (tokens[count].type == "WHILE_TOKEN")
  || (tokens[count].type == "IF_TOKEN") || (tokens[count].type == "OPEN_BRACKET_TOKEN")){
    console.log("SA: Statement List");
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
    assignmentStatement();
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
  count++;
  count++;
  var NewNode = {parent:CurrentNode, value:"Print", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  expr();
  CurrentNode = NewNode.parent;
  count++;
}

function assignmentStatement(){
  var NewNode = {parent:CurrentNode, value:"Assignment", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  var varNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
  CurrentNode.children.push(varNode);
  var alreadyDeclared = false;
  var tempScope = currentScope;
  var varType = "";
  while(tempScope != null){
    console.log("checking scope");
    for(var i = 0; i < tempScope.variables.length; i++){
      console.log(tempScope.variables[i].id);
      if(tempScope.variables[i].id == varNode.value){
        varType = tempScope.variables[i].type;
        alreadyDeclared = true;
        break;
      }
    }
    if(alreadyDeclared){
      break;
    }
    tempScope = tempScope.outerScope;
  }
  if(!alreadyDeclared){
    var error = {type:"UNDECLARED_VARIABLE_ERROR", line:tokens[count].line};
    errors.push(error);
    output = output + "SA: UNDECLARED_VARIABLE_ERROR! Variable " +
    varNode.value + " in scope " + currentScope.scopeNum + " on line "
    + tokens[count].line + "\n";
  }
  count++;
  count++;
  if(errors.length == 0){
    expr(varType);
  }
  else{
    expr();
  }
  CurrentNode = NewNode.parent;
}

function varDecl(){
  var NewNode = {parent:CurrentNode, value:"Variable Declaration", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  var typeNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
  CurrentNode.children.push(typeNode);
  count++;
  var varNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
  CurrentNode.children.push(varNode);
  var tempNode = CurrentNode;
  var alreadyDeclared = false;
  console.log(currentScope.variables.length);
  for(var i = 0; i < currentScope.variables.length; i++){
    if(currentScope.variables[i].id == varNode.value){
      alreadyDeclared = true;
      console.log("Found a redeclaration error");
      break;
    }
  }
  if(!alreadyDeclared){
    var newVar = {id:varNode.value, type:typeNode.value, line:tokens[count].line};
    currentScope.variables.push(newVar);
  }
  else{
    var error = {type:"VARIABLE_REDECLARATION_ERROR", line:tokens[count].line};
    errors.push(error);
    output = output + "SA: VARIABLE_REDECLARATION_ERROR! Variable " +
    varNode.value + " in scope " + currentScope.scopeNum + " on line "
    + tokens[count].line + "\n";
  }
  count++;
  CurrentNode = NewNode.parent;
}

function whileStatement(){
  count++;
  var NewNode = {parent:CurrentNode, value:"While", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  booleanExpr();
  block();
  CurrentNode = NewNode.parent;
}

function ifStatement(){
  count++;
  var NewNode = {parent:CurrentNode, value:"If", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  booleanExpr();
  block();
  CurrentNode = NewNode.parent;
}

function expr(){
  if(tokens[count].type == "INTEGER_TOKEN"){
    intExpr();
  }
  else if(tokens[count].type == "QUOTE_TOKEN"){
    stringExpr();
  }
  else if(tokens[count].type == "OPEN_PAREN_TOKEN" || tokens[count].type == "BOOL_VAL_TOKEN"){
    booleanExpr();
  }
  else if(tokens[count].type == "ID_TOKEN"){
    var varNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(varNode);
    var alreadyDeclared = false;
    var tempScope = currentScope;
    while(tempScope != null){
      console.log("checking scope");
      for(var i = 0; i < tempScope.variables.length; i++){
        console.log(tempScope.variables[i].id);
        if(tempScope.variables[i].id == varNode.value){

          alreadyDeclared = true;
          break;
        }
      }
      if(alreadyDeclared){
        break;
      }
      tempScope = tempScope.outerScope;
    }
    if(!alreadyDeclared){
      var error = {type:"UNDECLARED_VARIABLE_ERROR", line:tokens[count].line};
      errors.push(error);
      output = output + "SA: UNDECLARED_VARIABLE_ERROR! Variable " +
      varNode.value + " in scope " + currentScope.scopeNum + " on line "
      + tokens[count].line + "\n";
    }
    count++;
  }
}

function expr(type){
  if(tokens[count].type == "INTEGER_TOKEN" && type == "int"){
    intExpr();
  }
  else if(tokens[count].type == "QUOTE_TOKEN" && type == "string"){
    stringExpr();
  }
  else if((tokens[count].type == "OPEN_PAREN_TOKEN" || tokens[count].type == "BOOL_VAL_TOKEN") && type == "boolean"){
    booleanExpr();
  }
  else if(tokens[count].type == "ID_TOKEN"){
    var varNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(varNode);
    var alreadyDeclared = false;
    var tempScope = currentScope;
    var tempType = "";
    while(tempScope != null){
      console.log("checking scope");
      for(var i = 0; i < tempScope.variables.length; i++){
        console.log(tempScope.variables[i].id);
        if(tempScope.variables[i].id == varNode.value){
          tempType = tempScope.variables[i].type;
          alreadyDeclared = true;
          break;
        }
      }
      if(alreadyDeclared){
        break;
      }
      tempScope = tempScope.outerScope;
    }
    if(!alreadyDeclared){
      var error = {type:"UNDECLARED_VARIABLE_ERROR", line:tokens[count].line};
      errors.push(error);
      output = output + "SA: UNDECLARED_VARIABLE_ERROR! Variable " +
      varNode.value + " in scope " + currentScope.scopeNum + " on line "
      + tokens[count].line + "\n";
    }
    if(type != tempType){
      var error = {type:"TYPE_MISMATCH_ERROR", line:tokens[count].line};
      errors.push(error);
      output = output + "SA: TYPE_MISMATCH_ERROR! Variable " +
      varNode.value + " in scope " + currentScope.scopeNum + " on line "
      + tokens[count].line + ". Found type " + tempType + ", expected type "
      + type + "\n";
    }
    count++;
  }
  else{
    if(tokens[count].type == "INTEGER_TOKEN"){
      var error = {type:"TYPE_MISMATCH_ERROR", line:tokens[count].line};
      errors.push(error);
      output = output + "SA: TYPE_MISMATCH_ERROR! On line "
      + tokens[count].line + ". Found type int, expected type "
      + type + "\n";
    }
    else if(tokens[count].type == "QUOTE_TOKEN"){
      var error = {type:"TYPE_MISMATCH_ERROR", line:tokens[count].line};
      errors.push(error);
      output = output + "SA: TYPE_MISMATCH_ERROR! On line "
      + tokens[count].line + ". Found type string, expected type "
      + type + "\n";
    }
    else{
      var error = {type:"TYPE_MISMATCH_ERROR", line:tokens[count].line};
      errors.push(error);
      output = output + "SA: TYPE_MISMATCH_ERROR! On line "
      + tokens[count].line + ". Found type boolean, expected type "
      + type + "\n";
    }
  }
}

function intExpr(){
  if(tokens[count+1].type == "ADDITION_TOKEN"){
    var NewNode = {parent:CurrentNode, value:"Addition", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    var numNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(numNode);
    count++;
    count++;
    expr("int");
    CurrentNode = NewNode.parent;
  }
  else{
    var numNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(numNode);
    count++;
  }
}

function stringExpr(){
  count++;
  charList();
  count++;
}

function booleanExpr(){
  if(tokens[count].type == "OPEN_PAREN_TOKEN"){
    count++;
    if(tokens[count+1].type == "INEQUALITY_COMPARATOR_TOKEN"){
      var NewNode = {parent:CurrentNode, value:"Not Equals", children:[]};
      CurrentNode.children.push(NewNode);
      CurrentNode = NewNode;
    }
    else{
      var NewNode = {parent:CurrentNode, value:"Is Equal", children:[]};
      CurrentNode.children.push(NewNode);
      CurrentNode = NewNode;
    }
    expr();
    count++;
    expr();
    count++;
    CurrentNode = NewNode.parent;
  }
  else {
    var NewNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(NewNode);
    count++
  }
}

function charList(){
  //This
  var tempString = "";
  while(tokens[count].type != "QUOTE_TOKEN"){
    tempString = tempString + tokens[count].value;
    count++;
  }
  var NewNode = {parent:CurrentNode, value:tempString, children:[]};
  CurrentNode.children.push(NewNode);
}
