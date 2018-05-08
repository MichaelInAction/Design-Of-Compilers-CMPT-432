var tokens;
var warnings;
var errors;
var count;
var output;
var currentByte;
var heapByte;
var currentScope;
var maximumScope;
var staticStorageByte;
var staticDataTable;
var jumpsTable;

function generateCode(tokens, warnings, errors){
  this.tokens = tokens;
  this.warnings = warnings;
  this.errors = errors;
  count = 0;
  currentByte = 0;
  heapByte = 255;
  staticStorageByte = 0;
  staticDataTable = [];
  jumpsTable = [];
  output = [ "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "00", "00", "00", "00",
             "00", "00", "00", "00", "74", "72", "75", "65",
             "00", "66", "61", "6C", "73", "65", "00"];
  console.log("Starting code gen...");
  block();
  return output;
}

function block(){
  if(errors.length == 0){
    console.log("CG: Block");
    //Next token is a {
    count++;
    var temp = currentScope;
    maximumScope = maximumScope + 1;
    currentScope = maximumScope;
    statementList();
    currentScope = temp;
    //Next token is a }
    count++;
  }
}

function statementList(){
  if((tokens[count].type == "PRINT_TOKEN") || (tokens[count].type == "ID_TOKEN")
  || (tokens[count].type == "VAR_TYPE_TOKEN") || (tokens[count].type == "WHILE_TOKEN")
  || (tokens[count].type == "IF_TOKEN") || (tokens[count].type == "OPEN_BRACKET_TOKEN")){
    console.log("CG: Statement List");
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
  if(tokens[count].type == "INTEGER_TOKEN"){
    if(tokens[count+1].type == "CLOSE_PAREN_TOKEN"){
      output[currentByte] = "A2";
      currentByte = currentByte + 1;
      output[currentByte] = "01";
      currentByte = currentByte + 1;
      output[currentByte] = "A0";
      currentByte = currentByte + 1;
      var value = "";
      var temp1 = tokens[count].value % 16;
      var temp2 = Math.floor(tokens[count].value / 16);
      if(temp2 > 9){
        switch(temp2){
          case 10: value = value + "A"; break;
          case 11: value = value + "B"; break;
          case 12: value = value + "C"; break;
          case 13: value = value + "D"; break;
          case 14: value = value + "E"; break;
          case 15: value = value + "F"; break;
        }
      }
      else{
        value = value + temp2;
      }
      if(temp1 > 9){
        switch(temp1){
          case 10: value = value + "A"; break;
          case 11: value = value + "B"; break;
          case 12: value = value + "C"; break;
          case 13: value = value + "D"; break;
          case 14: value = value + "E"; break;
          case 15: value = value + "F"; break;
        }
      }
      else{
        value = value + temp1;
      }
      output[currentByte] = value;
      currentByte = currentByte + 1;
      output[currentByte] = "FF";
      currentByte = currentByte + 1;
    }
  }
  expr();

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
        tempScope.variables[i].initialized = true;
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
    console.log(varType);
    typeCheckExpr(varType);
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
    var newVar = {id:varNode.value, type:typeNode.value, initialized:false, used:false, line:tokens[count].line};
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

function typeCheckExpr(type){
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
    typeCheckExpr("int");
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
