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
  heapByte = 244;
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
  codeblock();

  backpatch();
  return output;
}

function backpatch(){
  staticStorageByte = currentByte + 1;
  for(var i = 0; i < staticDataTable.length; i++){
    console.log(i);
    var value = "";
    var temp1 = staticStorageByte % 16;
    var temp2 = Math.floor(staticStorageByte / 16);
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
    console.log(value);
    staticDataTable[i].memoryLoc = value;
    staticStorageByte = staticStorageByte + 1;
  }
  for(var i = 0; i < currentByte; i++){
    console.log(i);
    for(var j = 0; j < staticDataTable.length; j++){
      console.log(output[i]);
      console.log(staticDataTable[j].tempLoc);
      if(output[i] === staticDataTable[j].tempLoc){
        output[i] = staticDataTable[j].memoryLoc;
      }
    }
  }
}

function codeblock(){
  if(errors.length == 0){
    console.log("CG: Block");
    //Next token is a {
    count++;
    var temp = currentScope;
    maximumScope = maximumScope + 1;
    currentScope = maximumScope;
    codestatementList();
    currentScope = temp;
    //Next token is a }
    count++;
  }
}

function codestatementList(){
  if((tokens[count].type == "PRINT_TOKEN") || (tokens[count].type == "ID_TOKEN")
  || (tokens[count].type == "VAR_TYPE_TOKEN") || (tokens[count].type == "WHILE_TOKEN")
  || (tokens[count].type == "IF_TOKEN") || (tokens[count].type == "OPEN_BRACKET_TOKEN")){
    console.log("CG: Statement List");
    codestatement();
    codestatementList();
  }
  else{
    //Epsilon Production
  }
}

function codestatement(){
  if(tokens[count].type == "PRINT_TOKEN"){
    codeprintStatement();
  }
  else if(tokens[count].type == "ID_TOKEN"){
    codeassignmentStatement();
  }
  else if(tokens[count].type == "VAR_TYPE_TOKEN"){
    codevarDecl();
  }
  else if(tokens[count].type == "WHILE_TOKEN"){
    codewhileStatement();
  }
  else if(tokens[count].type == "IF_TOKEN"){
    codeifStatement();
  }
  else if(tokens[count].type == "OPEN_BRACKET_TOKEN"){
    codeblock();
  }
}

function codeprintStatement(){
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
  else if(tokens[count].type == "BOOL_VAL_TOKEN"){
    output[currentByte] = "A2";
    currentByte = currentByte + 1;
    output[currentByte] = "02";
    currentByte = currentByte + 1;
    output[currentByte] = "A0";
    currentByte = currentByte + 1;
    if(tokens[count].value == "true"){
      output[currentByte] = "F4";
      currentByte = currentByte + 1;
    }
    else{
      output[currentByte] = "F9";
      currentByte = currentByte + 1;
    }

    output[currentByte] = "FF";
    currentByte = currentByte + 1;
  }
  else if(tokens[count].type == "QUOTE_TOKEN"){
    var word = "";
    count = count + 1;
    while(tokens[count].type != "QUOTE_TOKEN"){
      word = word + tokens[count].value;
      count++;
      console.log(count);
    }
    heapByte = heapByte - word.length - 1;
    var newLocation = heapByte;
    for(var i = 0; i < word.length; i++){
      output[newLocation] = (word.charCodeAt(i)).toString(16).toUpperCase();
      newLocation++;
    }
    count++;
    output[currentByte] = "A2";
    currentByte = currentByte + 1;
    output[currentByte] = "02";
    currentByte = currentByte + 1;
    output[currentByte] = "A0";
    currentByte = currentByte + 1;
    output[currentByte] = heapByte.toString(16).toUpperCase();
    currentByte = currentByte + 1;
    output[currentByte] = "FF";
    currentByte = currentByte + 1;
  }
  else if(tokens[count].type == "ID_TOKEN"){

  }
  count++;
}

function codeassignmentStatement(){
  console.log(tokens[count].value);
  var staticTableLocation = 0;
  for(var i = 0; i < staticDataTable.length; i++){
    if(tokens[count].value === staticDataTable[i]){

    }
  }

  count++;
  count++;
  codeexpr();
}

function codevarDecl(){

  var declaredVariable = {name:tokens[count+1].value, type:tokens[count].value, scope:currentScope, tempLoc: "T" + (staticDataTable.length + 1), memoryLoc:""};
  output[currentByte] = "A9";
  currentByte = currentByte + 1;
  if(declaredVariable.type == "boolean"){
    output[currentByte] = "F9";
    currentByte = currentByte + 1;
  }
  else if(declaredVariable.type == "string"){
    output[currentByte] = "FF";
    currentByte = currentByte + 1;
  }
  else{
    output[currentByte] = "00";
    currentByte = currentByte + 1;
  }
  output[currentByte] = "8D";
  currentByte = currentByte + 1;
  output[currentByte] = declaredVariable.tempLoc;
  currentByte = currentByte + 1;
  output[currentByte] = "00";
  currentByte = currentByte + 1;
  staticDataTable.push(declaredVariable);
  count++;
  count++;
}

function codewhileStatement(){
  count++;
  var NewNode = {parent:CurrentNode, value:"While", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  codebooleanExpr();
  codeblock();
  CurrentNode = NewNode.parent;
}

function codeifStatement(){
  count++;
  var NewNode = {parent:CurrentNode, value:"If", children:[]};
  CurrentNode.children.push(NewNode);
  CurrentNode = NewNode;
  codebooleanExpr();
  codeblock();
  CurrentNode = NewNode.parent;
}

function codeexpr(){
  if(tokens[count].type == "INTEGER_TOKEN"){
    codeintExpr();
  }
  else if(tokens[count].type == "QUOTE_TOKEN"){
    codestringExpr();
  }
  else if(tokens[count].type == "OPEN_PAREN_TOKEN" || tokens[count].type == "BOOL_VAL_TOKEN"){
    codebooleanExpr();
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

function codetypeCheckExpr(type){
  if(tokens[count].type == "INTEGER_TOKEN" && type == "int"){
    codeintExpr();
  }
  else if(tokens[count].type == "QUOTE_TOKEN" && type == "string"){
    codestringExpr();
  }
  else if((tokens[count].type == "OPEN_PAREN_TOKEN" || tokens[count].type == "BOOL_VAL_TOKEN") && type == "boolean"){
    codebooleanExpr();
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

function codeintExpr(){
  if(tokens[count+1].type == "ADDITION_TOKEN"){
    var NewNode = {parent:CurrentNode, value:"Addition", children:[]};
    CurrentNode.children.push(NewNode);
    CurrentNode = NewNode;
    var numNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(numNode);
    count++;
    count++;
    codetypeCheckExpr("int");
    CurrentNode = NewNode.parent;
  }
  else{
    var numNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(numNode);
    count++;
  }
}

function codestringExpr(){
  count++;
  codecharList();
  count++;
}

function codebooleanExpr(){
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
    codeexpr();
    count++;
    codeexpr();
    count++;
    CurrentNode = NewNode.parent;
  }
  else {
    var NewNode = {parent:CurrentNode, value:tokens[count].value, children:[]};
    CurrentNode.children.push(NewNode);
    count++
  }
}

function codecharList(){
  //This
  var tempString = "";
  while(tokens[count].type != "QUOTE_TOKEN"){
    tempString = tempString + tokens[count].value;
    count++;
  }
}
