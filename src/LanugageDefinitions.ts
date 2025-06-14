// TODO:add runtime to the different methods with runtime tag

/**
 * TODO: add set operations: union,*,...
 * This is the most basic Thing all constructs of theoretical Informatics have in common.
 * At its core this is only a Set of Words consisting only of Chars in The Alphabet.
 *
 *  Depending on what kind of Words this Language/set can display it is split into 4 Classes:
 *
 *  regulär : simple Patterns
 *  kontextfrei : Single nested patterns aka a^n b^n
 *  kontextsensitiv : Multiple Patterns aka a^n b^n c^n
 *  everything : rekursiv aufzählbar
 */
export abstract class Language {
    alphabet: Set<string>;

    constructor(alphabet: Set<string>) {
        this.alphabet = alphabet;
    }

    abstract contains(word: string): boolean;

    /**
     * @return if the Language doesn't contain any word at all.
     */
    abstract isEmpty(): boolean;

    /**
     * @return whether the Language is Infinite -> contains an infinite amount of words
     */
    abstract isInfinite(): boolean;

    /**
     * TODO: decide if i want to Do: convert both to DFA -> minimize -> compare
     * TODO or do: NFA/DFA -> Intersection -> isEmpty.
     * @param language
     */
    abstract equals(language: Language): boolean;

}

export abstract class regularLanguage extends Language {
    abstract convertToRE(): RegularExpression;

    abstract convertToDFA(): DFA;

    abstract convertToNFA(): NFA;
    abstract convertToNFA(): NFA;
    abstract override equals(regularLanguage: regularLanguage): boolean;
}



class contextFreeLanguage extends Language {
    contains(word: string): boolean {
        return false;
    }

    equals(regularLanguage: Language): boolean {
        return false;
    }

    isEmpty(): boolean {
        return false;
    }

    isInfinite(): boolean {
        return false;
    }



}



/**
 Defines a Grammar according to Textbock Tuple: G = (N, Σ, P, S):
 N	Set of non-terminals
 Σ	Set of terminal symbols -> in super class
 P	Set of production rules (specific dependent on Kind of Grammar)
 S	Start symbol, S ∈ N
 */
export class Grammar extends Language {
    contains(word: string): boolean {
        return false;
    }

    equals(regularLanguage: Language): boolean {
        return false;
    }

    isEmpty(): boolean {
        return false;
    }

    isInfinite(): boolean {
        return false;
    }

    reachableSymbols(): Set<string> {
        return new Set<string>();
    }
}



