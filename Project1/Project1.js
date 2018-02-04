function lexInput(input, tokens, warnings, errors){
  /*
  The valid character in the language are:
  { - OPEN_BRACKET_TOKEN
  } - CLOSE_BRACKET_TOKEN
  ( - OPEN_PAREN_TOKEN
  ) - CLOSE_PAREN_TOKEN
  = - ASSIGNMENT_TOKEN
  == - EQUALS_COMPARATOR_TOKEN
  != - NOT_EQUALS_COMPARATOR_TOKEN
  " - QUOTE_TOKEN
  a-z
  0-9
  +
  space
  $ - END_PROGRAM_TOKEN
  
  Valid statements are:
  print ()
  while
  if
  int
  boolean
  string
  false
  true
  */
    input.trim();
    var inQuotes = false;
    var inComment = false;
    var lineNumber = 1;
    var validLetters = new RegExp(/[a-z]/);
    var validNumbers = new RegExp(/[0-9]/);

    if(input.length == 0){
        var warning = {type:"EMPTY_INPUT_WARNING", line:lineNumber};
        console.log("Empty Input Detected");
        warnings.push(warning);
    }

    for(i = 0; i < input.length; i++){
        if(input.substring(i, i+2) == "/*"){
            i = i + 1;
            console.log("Starting a comment");
            inComment = true;
            continue;
        }
        else if(!inComment){
            if(input.substring(i, i+1) == "\""){
                var token = {type:"QUOTE_TOKEN", value:"\"", line:lineNumber};
                tokens.push(token);
                inQuotes = !inQuotes
                console.log("flipping inQuotes");
                continue;
            }
            else if(validLetters.test(input.substring(i, i+1))){
                if(inQuotes){
                    var token = {type:"CHARACTER_TOKEN", value:input.substring(i, i+1), line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    continue;
                }
                else if(input.substring(i).search(/print/) == 0){
                    var token = {type:"PRINT_TOKEN", value:"print", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 4;
                    continue;
                }
                else if(input.substring(i).search(/while/) == 0){
                    var token = {type:"WHILE_TOKEN", value:"while", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 4;
                    continue;
                }
                else if(input.substring(i).search(/if/) == 0){
                    var token = {type:"IF_TOKEN", value:"if", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 1;
                    continue;
                }
                else if(input.substring(i).search(/int/) == 0){
                    var token = {type:"VAR_TYPE_TOKEN", value:"int", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 2;
                    continue;
                }
                else if(input.substring(i).search(/string/) == 0){
                    var token = {type:"VAR_TYPE_TOKEN", value:"string", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 5;
                    continue;
                }
                else if(input.substring(i).search(/boolean/) == 0){
                    var token = {type:"VAR_TYPE_TOKEN", value:"boolean", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 6;
                    continue;
                }
                else if(input.substring(i).search(/true/) == 0){
                    var token = {type:"BOOL_VAL_TOKEN", value:"true", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 3;
                    continue;
                }
                else if(input.substring(i).search(/false/) == 0){
                    var token = {type:"BOOL_VAL_TOKEN", value:"false", line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    i = i + 4;
                    continue;
                }
                else{
                    var token = {type:"ID_TOKEN", value:input.substring(i, i+1), line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    continue;
                }
            }
            else if(validNumbers.test(input.substring(i, i+1))){
                var token = {type:"INTEGER_TOKEN", value:input.substring(i, i+1), line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i).search(/!=/) == 0){
                var token = {type:"INEQUALITY_COMPARATOR_TOKEN", value:"!=", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                i = i + 1;
                continue;
            }
            else if(input.substring(i).search(/==/) == 0){
                var token = {type:"EQUALITY_COMPARATOR_TOKEN", value:"==", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                i = i + 1;
                continue;
            }
            else if(input.substring(i, i+1) == "{"){
                var token = {type:"OPEN_BRACKET_TOKEN", value:"{", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == "}"){
                var token = {type:"CLOSE_BRACKET_TOKEN", value:"}", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == "("){
                var token = {type:"OPEN_PAREN_TOKEN", value:"(", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == ")"){
                var token = {type:"CLOSE_PAREN_TOKEN", value:")", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == "="){
                var token = {type:"ASSIGNMENT_TOKEN", value:"=", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == "+"){
                var token = {type:"ADDITION_TOKEN", value:"+", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == "$"){
                var token = {type:"END_OF_FILE_TOKEN", value:"$", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) == " " && inQuotes){
                var token = {type:"CHARACTER_TOKEN", value:" ", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            else if(input.substring(i, i+1) != " " && input.substring(i, i+1) != "\r" && input.substring(i, i+1) != "\n"){
                var error = {type:"INVALID_CHARACTER_ERROR", value:input.substring(i, i+1), line:lineNumber};
                console.log("Found ".concat(error.type, " ", error.value));
                errors.push(error);
                continue;
            }
        }
        if(input.substring(i, i+2) == "*/"){
            i = i + 1;
            console.log("Ending a comment");
            inComment = false;
            continue;
        }
        if(input.substring(i, i+1) == "\n" || input.substring(i, i+1) == "\r"){
            lineNumber = lineNumber + 1;
        }
    }
    if(input.substring(input.length-1, input.length) != "$"){
        var warning = {type:"MISSING_END_PROGRAM_WARNING", line:lineNumber};
        console.log("Missing End of Program Character");
        warnings.push(warning);
    }
    console.log("Done");
}
