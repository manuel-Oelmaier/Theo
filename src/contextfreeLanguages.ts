import {Language} from "./languagesLogic";

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

    isInfinite(word: string): boolean {
        return false;
    }



}

/**
 * One cannot convert a 
 */
class pushDownAutomaton extends contextFreeLanguage {

}