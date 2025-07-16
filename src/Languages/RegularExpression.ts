import {regularLanguage} from "../LanugageDefinitions.ts";
import {DFA} from "./DFA.ts";
import {NFA} from "./NFA.ts";

/**
 *  A regular expression consists out of Paranthesis () , chars of the Alphabet + epsilon (empty word),
 *  *,+, and | as or.
 */
export class RegularExpression extends regularLanguage {
    expression:string;

    constructor(alphabet:Set<string>,expression: string) {
        super(alphabet);
        this.parathesisCheck(expression);
        this.expression = expression;
    }

    contains(word: string): boolean {
        return false;
    }

    convertToDFA(): DFA {
        return this.convertToNFA().convertToDFA();
    }

    /**
     * this will convert a Regex to a NFA using Thompsons Construction
     */
    convertToNFA(): NFA {
        throw new Error("Not implemented");
    }

    convertToRE(): RegularExpression {
        return this;
    }

    equals(regularLanguage: regularLanguage): boolean {
        const  DFA = this.convertToDFA().minimize();
        return DFA.equals(regularLanguage);
    }

    isEmpty(): boolean {
        return this.expression === "";
    }

    isInfinite(): boolean {
        return this.expression.includes("*") || this.expression.includes("+");
    }

    private parathesisCheck(expression: string): void {
        let nested = 0;
        for (let i = 0; i < expression.length; i++) {
            let char = expression.charAt(i);
            if(char === "(" ){
                nested++;
            }else if(char === ")"){
                nested--;
                if(nested < 0){
                    throw new Error("Expected a well formed expression with matching (),Error at:  "+i);
                }
            }
        }
        if(nested !== 0){
            throw new Error("There is an unequal amount of Paranthesis by: "+nested);
        }
    }

}