// TODO:add runtime to the differnt methods with runtime tag
import * as path from "node:path";

/**
 * TODO: add set operatitons: union,*,...
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
     * @param word
     * @return whether the Language is Infinite -> contains an infinite amount of words
     */
    abstract isInfinite(word: string): boolean;

    abstract equals(regularLanguage: Language): boolean;

}

export abstract class regularLanguage extends Language {
    abstract convertToRE(): RegularExpression;

    abstract convertToDFA(): DFA;

    abstract convertToNFA(): NFA;
    abstract convertToNFA(): NFA;
}

/**
 * This class represents a DFA according to Textbook definition.
 * Since a DFA is not else than a Directed Graph with some meaning Behind it,
 * I will display it as an Adjacency Matrix. By Convention the first Row will be the staring state of the automaton.
 * Furthermore, the Dimensions will at most be: |Numbers of States| x |Number of Elements|
 * Functions that would change the state of the NFA return a new instance
 *  TODO: remove unreachable nodes ? -> just nicer to work with.
 *  TODO: implement epsilon-NFA
 */
export class NFA extends regularLanguage {
    adjacencyMatrix: string[][];
    acceptingStates: Set<number>;

    /*
        constructor(alphabet: Set<string>, adjacencyMatrix: string[][], acceptingStates: Set<number>) {
        super(alphabet);
        this.adjacencyMatrix = adjacencyMatrix;
        this.acceptingStates = acceptingStates;
    }
     */

    constructor(adjacencyMatrix: string[][], acceptingStates: Set<number>) {
        let alphabet = new Set<string>();
        for (let i = 0; i < adjacencyMatrix.length; i++) {
            for (let j = 0; j < adjacencyMatrix[i].length; j++) {
                alphabet.add(adjacencyMatrix[i][j])
            }
        }
        super(alphabet);
        this.adjacencyMatrix = adjacencyMatrix;
        this.acceptingStates = acceptingStates;
    }

    /**
     * This function simply tries to simulate the word in the automaton.
     * @param word
     * returns True if the state after running through the word is an Accepting one #
     * False if it isn't or an edge was massing somewhere along the way.
     */
    contains(word: string): boolean {

        let currentStates: Set<number> = new Set<number>([0]);
        let workingStates: Set<number> = new Set<number>();
        let found: boolean = false;

        for (const char of word) {
            for (const state of currentStates) {
                for (let i = 0; i < this.adjacencyMatrix[state].length; i++) {
                    if (this.adjacencyMatrix[state][i] === char) {
                        found = true;
                        workingStates.add(i);
                    }
                }
            }
            // transfer from one set to the other ? maybe nicer
            currentStates.clear();
            for (const state of workingStates) {
                currentStates.add(state);
            }
            workingStates.clear();


            if (!found) {
                return false;
            }
        }
        // return true if one of the possible states is an accepting one.
        for (const state of currentStates) {
            if (this.isAcceptingState(state)) {
                return true;
            }
        }
        return false;
    }


    equals(regularLanguage: Language): boolean {
        return false;
    }

    /**
     * To check if an Automaton is Empty simplifies down to checking if an accepting State is reachable.
     * We will add a reachable nodes to a set using Breadth-First Search(BFS).
     */
    isEmpty(): boolean {
        return !hasIntersection(this.acceptingStates, this.reach());
    }

    /**
     * The Language of a NFA is infinite if the Reachable states from the starting Node
     * contain a loop -> executing this loop generate new words and so the Language is infinite.

     */
    isInfinite(word: string): boolean {
        return false;
    }

    convertToRE(): RegularExpression {
        throw new Error("Method not implemented.");
    }

    /**
     * @runtime O (2^n) n= states
     * 1.
     */
    convertToDFA(): DFA {
        let matrix: string[][] = [];
        let dfaAcceptingStates = new Set<number>();
        // iterate and create combination states ?

        for (let i = 0; i < this.adjacencyMatrix.length; i++) {

        }
        return new DFA(this.adjacencyMatrix, this.acceptingStates);

    }

    convertToNFA(): NFA {
        return this
    }

    /**
     *
     * @private
     * @runtime O(n^2)
     * @return returns a set of number listing all nodes that can be reached from the starting Node.
     */
    protected reach(): Set<number> {
        const reachable = new Set<number>();
        let que = [0];

        while (que.length > 0) {
            let x: number = <number>que.shift();
            for (let i = 0; i < this.adjacencyMatrix[x].length; i++) {
                if (this.adjacencyMatrix[x][i] !== "") {
                    reachable.add(i);
                    if (!reachable.has(i)) {
                        que.push(i);

                    }
                }
            }
        }
        return reachable;
    }

    protected isAcceptingState(x: number): boolean {
        return this.acceptingStates.has(x);
    }

    protected nonAcceptingStates(): Set<number> {
        let nonAcceptingStates = new Set<number>();
        for (let i = 0; i < this.adjacencyMatrix.length; i++) {
            if (!this.isAcceptingState(i)) {
                nonAcceptingStates.add(i);
            }
        }
        return nonAcceptingStates;
    }
}

/**
 * A DFA is just a further specification of an NFA,
 * each Node of its graph has at most |Alphabet| number of Edges to another.
 */
export class DFA extends NFA {

    constructor(adjacencyMatrix: string[][], acceptingStates: Set<number>) {
        super(adjacencyMatrix, acceptingStates);
    }

    /**
     * //TODO move up into regular Language after Testing ?
     * convert to DFA and then minimize both this automaton and the
     * @param regularLanguage
     */
    override equals(regularLanguage: regularLanguage): boolean {
        let thisMinimized = this.minimize();
        let inputMinimized = regularLanguage.convertToDFA().minimize();
        return thisMinimized === inputMinimized;
    }

    /**
     * TODO: implement Hopcroft´s algorithm later with complexity of n log n
     * TODO: remove unreachable states first.
     * minmizes a DFA by 1. removing all
     *  2.all accepting states are surely different from non accepting states.
     *  3.check the others manualy by comparing transitions
     */
    minimize(): DFA {
        let pairs = new Set<unorderPair>;
        for (let i = 0; i < this.adjacencyMatrix.length; i++) {
            for (let j = 0; j < this.adjacencyMatrix.length - i; j++) {
                pairs.add(new unorderPair(i, j));
            }
        }
        let differentStates = new Set<unorderPair>();
        let nonAcceptingStates = this.nonAcceptingStates();
        for (const nonAcceptingState of nonAcceptingStates) {
            for (const acceptingState of this.acceptingStates) {
                differentStates.add(new unorderPair(nonAcceptingState, acceptingState));
            }
        }
        // iterate over pairs, if State a and State b of pair have a edge marked with the same symbol of the Alphabet
        // to the same marked State -> add it to marked.
        // and remove from pairs ?.
        let changed = true;
        while (changed) {
            changed = false;
            pairs.forEach((pair: unorderPair) => {
                for (const char of this.alphabet) {
                    let connectedState = new unorderPair(this.findChar(char,pair.x),this.findChar(char,pair.y));
                    if(differentStates.has(connectedState)){
                        differentStates.add(pair);
                        pairs.delete(pair);
                        changed = true;
                    }
                }
            })
        }
        // konstruct automaton out of
        console.log(differentStates);
        return this;
    }

    findChar(char: string,matrixrow:number): number {
        for (let i = 0; i <this.adjacencyMatrix[matrixrow].length ; i++) {
            if(this.adjacencyMatrix[matrixrow][i] === char){
                return i;
            }
        }
        return matrixrow;
    }
    residualLanguages(): regularLanguage[]{
        return [];
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

    isInfinite(word: string): boolean {
        return false;
    }

    reachableSymbols(): Set<string> {
        return new Set<string>();
    }
}

export class RegularExpression extends regularLanguage {
    contains(word: string): boolean {
        return false;
    }

    convertToDFA(): DFA {
        return this.convertToNFA().convertToDFA();
    }

    convertToNFA(): NFA {
        throw new Error("Not implemented");
    }

    convertToRE(): RegularExpression {
        return this;
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

function hasIntersection<T>(A: Set<T>, B: Set<T>): boolean {
    for (const elem of A) {
        if (B.has(elem)) {
            return true;
        }
    }
    return false;
}

class unorderPair {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(Pair: unorderPair) {
        return (this.x === Pair.x && this.y === Pair.y) || (this.y === Pair.x && this.x === Pair.y);
    }

}