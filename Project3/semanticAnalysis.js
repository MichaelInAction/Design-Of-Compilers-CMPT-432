var tokens;
var symbols;
var warnings;
var errors;
var output;
var count;

function checkSemantics(tokens, symbols, warnings, errors){
  console.log("Begin Semantic Analysis...");
  output = "";
  this.tokens = tokens;
  this.symbols = symbols;
  this.warnings = warnings;
  this.errors = errors;
  this.count = 0;
}
