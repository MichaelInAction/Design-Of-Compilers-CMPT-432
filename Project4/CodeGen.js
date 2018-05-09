var tokens;
var warnings;
var errors;
var count;
var output;
var currentByte;
var heapByte;
var currentScope;
var maximumScope;
var scopeTable;
var staticStorageByte;
var staticDataTable;
var jumpsTable;

function generateCode(tokens, warnings, errors){
  this.tokens = tokens;
  this.warnings = warnings;
  this.errors = errors;
  currentScope = null;
  maximumScope = 0;
  count = 0;
  currentByte = 0;
  heapByte = 244;
  staticStorageByte = 0;
  staticDataTable = [];
  scopeTable = [];
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
    maximumScope = maximumScope + 1;
    var newScope = {num:maximumScope, parent:currentScope};
    var temp = currentScope;
    currentScope = newScope;
    scopeTable.push(newScope);
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
    var id = tokens[count].value;
    var tempScope = currentScope;
    var found = false;
    var index = 0;
    while(tempScope != null){
      for(var i = 0; i < staticDataTable.length; i++){
        if(staticDataTable[i].scope == currentScope.num && staticDataTable[i].name == id){
          found = true;
          index = i;
          break;
        }
      }
      if(found){
        break;
      }
    }
    if(staticDataTable[index].type == "int"){
      output[currentByte] = "A2";
      currentByte = currentByte + 1;
      output[currentByte] = "01";
      currentByte = currentByte + 1;
      output[currentByte] = "AC";
      currentByte = currentByte + 1;
      output[currentByte] = staticDataTable[index].tempLoc;
      currentByte = currentByte + 1;
      output[currentByte] = "00";
      currentByte = currentByte + 1;
      output[currentByte] = "FF";
      currentByte = currentByte + 1;
    }
    else{
      output[currentByte] = "A2";
      currentByte = currentByte + 1;
      output[currentByte] = "02";
      currentByte = currentByte + 1;
      output[currentByte] = "AC";
      currentByte = currentByte + 1;
      output[currentByte] = staticDataTable[index].tempLoc;
      currentByte = currentByte + 1;
      output[currentByte] = "00";
      currentByte = currentByte + 1;
      output[currentByte] = "FF";
      currentByte = currentByte + 1;
    }
    count++;
  }
  count++;
}

function codeassignmentStatement(){
  var id = tokens[count].value;
  var tempScope = currentScope;
  var found = false;
  var index = 0;
  while(tempScope != null){
    for(var i = 0; i < staticDataTable.length; i++){
      if(staticDataTable[i].scope == currentScope.num && staticDataTable[i].name == id){
        found = true;
        index = i;
        break;
      }
    }
    if(found){
      break;
    }
  }
  if(staticDataTable[index].type == "int"){
    output[currentByte] = "A9";
    currentByte = currentByte + 1;
    output[currentByte] = "";
    currentByte = currentByte + 1;
    output[currentByte] = "8D";
    currentByte = currentByte + 1;
    output[currentByte] = staticDataTable[index].tempLoc;
    currentByte = currentByte + 1;
    output[currentByte] = "00";
    currentByte = currentByte + 1;
  }
  else if(staticDataTable[index].type == "boolean"){
    if(tokens[count+2].value == "true"){
      output[currentByte] = "A9";
      currentByte = currentByte + 1;
      output[currentByte] = "F4";
      currentByte = currentByte + 1;
      output[currentByte] = "8D";
      currentByte = currentByte + 1;
      output[currentByte] = staticDataTable[index].tempLoc;
      currentByte = currentByte + 1;
      output[currentByte] = "00";
      currentByte = currentByte + 1;
    }
    else{
      output[currentByte] = "A9";
      currentByte = currentByte + 1;
      output[currentByte] = "F9";
      currentByte = currentByte + 1;
      output[currentByte] = "8D";
      currentByte = currentByte + 1;
      output[currentByte] = staticDataTable[index].tempLoc;
      currentByte = currentByte + 1;
      output[currentByte] = "00";
      currentByte = currentByte + 1;
    }
  }
  else{

  }
  count++;
  count++;
  count++;
  //codeexpr();
}

function codevarDecl(){

  var declaredVariable = {name:tokens[count+1].value, type:tokens[count].value, scope:currentScope.num, tempLoc: "T" + (staticDataTable.length + 1), memoryLoc:""};
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
  codebooleanExpr();
  codeblock();
}

function codeifStatement(){
  count++;
  codebooleanExpr();
  codeblock();
}

function codeexpr(){
  if(tokens[count].type == "INTEGER_TOKEN"){
    codeintExpr();
  }
  else if(tokens[count].type == "QUOTE_TOKEN"){

  }
  else if(tokens[count].type == "OPEN_PAREN_TOKEN" || tokens[count].type == "BOOL_VAL_TOKEN"){
    codebooleanExpr();
  }
  else if(tokens[count].type == "ID_TOKEN"){
    count++;
  }
}

function codeintExpr(){
  if(tokens[count+1].type == "ADDITION_TOKEN"){
    count++;
    count++;
    codeexpr();
  }
  else{
    count++;
  }
}

function codebooleanExpr(){
  if(tokens[count].type == "OPEN_PAREN_TOKEN"){
    count++;
    if(tokens[count+1].type == "INEQUALITY_COMPARATOR_TOKEN"){

    }
    else{

    }
    codeexpr();
    count++;
    codeexpr();
    count++;
  }
  else {
    count++
  }
}
