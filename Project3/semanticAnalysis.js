var tokens;
var symbols;
var warnings;
var errors;
var output;

function checkSemantics(tokens, symbols, warnings, errors){
  console.log("Begin Semantic Analysis...");
  output = "";
  var scopes = [];
  var currentScope = 0;
  var nextScope = 1;
  this.tokens = tokens;
  this.symbols = symbols;
  this.warnings = warnings;
  this.errors = errors;
  for(var i = 0; i < tokens.length; i++){
    output = output + tokens[i].value + currentScope + "\n";
    if(tokens[i].value == "{"){
      var temp = {scope:nextScope, outerScope:currentScope};
      scopes.push(temp);
      currentScope = nextScope;
      nextScope = nextScope + 1;
      continue;
    }
    if(tokens[i].value == "}"){
      for(var j = 0; j < scopes.length; j++){
        if(scopes[j].scope == currentScope){
          currentScope = scopes[j].outerScope;
          break;
        }
      }
      continue;
    }
  }
  return output;
}
