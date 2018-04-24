function lexInput(input, tokens, warnings, errors, startingLineNumber){
    //Log in the console that we are beginning the lexing process
    console.log("Beginning Lexing");
    /*
     Trim the input to remove any unnecesary leading or trailing whitespace
    */
    input.trim();
    //Used to check whether a given character is between quotes
    var inQuotes = false;
    //Used to check whether a given character is part of a comment, and should be ignored
    var inComment = false;
    //Used to tell what line number a given token is found on
    var lineNumber = startingLineNumber;
    //Regular expression of the valid letters in our language
    var validLetters = new RegExp(/[a-z]/);
    //Regular expression of the valid numbers in our language
    var validNumbers = new RegExp(/[0-9]/);

    /*
     If there is nothing but whitespace in the input (which will be removed by trim()
     Give a warning about the empty input
    */
    if(input.length == 0){
        var warning = {type:"EMPTY_INPUT_WARNING", line:lineNumber};
        console.log("Empty Input Detected");
        warnings.push(warning);
    }
    //Loop through the string, looking at every individual character
    for(i = 0; i < input.length; i++){
        //Check if the character is an opening to a comment
        if(input.substring(i, i+2) == "/*"){
            //Move past the comment, log in the console that we are entering a comment
            //and set inComment to true, then continue
            i = i + 1;
            console.log("Starting a comment");
            inComment = true;
            continue;
        }
        //If we are not starting a comment or currently in a comment, we must
        //look at the character to determine what token it is a part of or if it's
        //an error
        else if(!inComment){
            if(input.substring(i, i+1) == "\""){
                //If it's a quote, flip in quotes to switch whether we are in a quote or not, and
                //push a quote token, log so in the console, then continue
                var token = {type:"QUOTE_TOKEN", value:"\"", line:lineNumber};
                tokens.push(token);
                inQuotes = !inQuotes
                console.log("flipping inQuotes");
                continue;
            }
            else if(input.substring(i, i+1) == " " && inQuotes){
              var token = {type:"CHARACTER_TOKEN", value:input.substring(i, i+1), line:lineNumber};
              console.log("pushing ".concat(token.value));
              tokens.push(token);
              continue;
            }
            //Otherwise, check if it's a letter
            else if(validLetters.test(input.substring(i, i+1))){
                if(inQuotes){
                    //If it's a letter and in quotes, push a character token with the character as a value
                    //log it in the console, then continue
                    var token = {type:"CHARACTER_TOKEN", value:input.substring(i, i+1), line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    continue;
                }
                //Otherwise, we check for any of the valid keywords in our language
                //If we find it's a valid keyword, we increment i to move past that keyword, push
                //a token for it, log it in the console, then continue
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
                    //Otherwise, if it's a valid letter that is not part of a keyword, it must be an identifier
                    //so we push an ID token with the value of the character, log that in the console, then continue
                    var token = {type:"ID_TOKEN", value:input.substring(i, i+1), line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    continue;
                }
            }
            else if(validNumbers.test(input.substring(i, i+1))){
                //If we are in quotes and it's a numeric character, return an error, as we cannot have numbers in strings
                if(inQuotes){
                    var error = {type:"INTEGER_IN_STRING_ERROR", value:input.substring(i, i+1), line:lineNumber};
                    console.log("pushing ".concat(error.value));
                    errors.push(error);
                    continue
                }
                //Otherwise, create an integer token, log it, and push it, then continue
                else {
                    var token = {type:"INTEGER_TOKEN", value:input.substring(i, i+1), line:lineNumber};
                    console.log("pushing ".concat(token.value));
                    tokens.push(token);
                    continue;
                }
            }
            //Next, we check if we are in quotes, because symbols are also not allowed in quotes
            else if(inQuotes) {
                var error = {type:"SYMBOL_IN_STRING_ERROR", value:input.substring(i, i+1), line:lineNumber};
                console.log("pushing ".concat(error.value));
                errors.push(error);
                continue;
            }
            //Otherwise, we check if it's any of the valid symbolic characters. If it is, we push the appropriate token,
            //log it in the console, then continue
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
                var token = {type:"END_OF_PROGRAM_TOKEN", value:"$", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            //Otherwise, we check if it's a space between quotes, because the only whitespace we need to preserve is between quotes
            //If it is, we push a character token of a space, log that in the console, then continue
            else if(input.substring(i, i+1) == " " && inQuotes){
                var token = {type:"CHARACTER_TOKEN", value:" ", line:lineNumber};
                console.log("pushing ".concat(token.value));
                tokens.push(token);
                continue;
            }
            //Next, we check if there is a newline character inside of a string
            else if(inQuotes && (input.substring(i, i+1) == "\n" || input.substring(i, i+1) == "\r")){
                var error = {type:"NEWLINE_IN_STRING_ERROR", line:lineNumber};
                console.log("pushing ".concat(error.value));
                errors.push(error);
                lineNumber = lineNumber + 1;
                continue;
            }
            //Finally, if it has not yet been found to be a valid character, and it is not a space, carriage return, or newline character,
            //it must be an invalid character, so we push an invalid character error, log so in the console, and continue to see if
            //there are other errors
            else if(input.substring(i, i+1) != " " && input.substring(i, i+1) != "\r" && input.substring(i, i+1) != "\n" && input.substring(i, i+1) != "\t"){
                var error = {type:"INVALID_CHARACTER_ERROR", value:input.substring(i, i+1), line:lineNumber};
                console.log("Found ".concat(error.type, " ", error.value));
                errors.push(error);
                continue;
            }
        }
        //If we are in a comment and we reach an end comment character, we increment i past the end comment character,
        //and set inComment to false, signifying that we have left a comment, log so in the console, then continue
        if(input.substring(i, i+2) == "*/"){
            i = i + 1;
            console.log("Ending a comment");
            inComment = false;
            continue;
        }
        //If we reach a carriage return or newline character, we increment lineNumber to signify that
        //We have reached a new line
        if(input.substring(i, i+1) == "\n" || input.substring(i, i+1) == "\r"){
            lineNumber = lineNumber + 1;
        }
    }
    //If the last character of the input is not an end of program character, we issue a warning
    //and log it in the console
    if(input.substring(input.length-1, input.length) != "$"){
        var warning = {type:"MISSING_END_PROGRAM_WARNING", line:lineNumber};
        console.log("Missing End of Program Character");
        warnings.push(warning);
    }
    //If we are still in a string, throw an unfinished string error
    if(inQuotes){
        var error = {type:"UNFINISHED_STRING_ERROR", line:lineNumber};
        console.log("Found Unterminated String");
        errors.push(error);
    }
    //If we are still in a comment, throw an unfinished comment error
    if(inComment){
        var error = {type:"UNFINISHED_COMMENT_ERROR", line:lineNumber};
        console.log("Found Unterminated Comment");
        errors.push(error);
    }
    //Log in the console that we have finished
    console.log("Lexing complete");
    return lineNumber;
}
