import {instance} from "@viz-js/viz";

import {regularLanguage} from "../LanugageDefinitions.ts";
import {DFA} from "./DFA.ts";
import {RegularExpression} from "./RegularExpression.ts";

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


    equals(regularLanguage: regularLanguage): boolean {
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
    isInfinite(): boolean {
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

    display(): HTMLDivElement {
        const div = document.createElement("div");
        div.id = "graph";

        instance().then(viz => {
            const svg = viz.renderSVGElement(this.toDigraph());

            document.getElementById("graph")!.appendChild(svg);
        });

        return div;
    }

    toDigraph(): string {
        let Matrix = ""

        // circle finalstates twice
        const finalStates = Array.from(this.acceptingStates).join(',');
        Matrix+="node [shape = doublecircle];"+ finalStates+";"
        Matrix+="node [shape = circle];"

        // add starting arrow from an invisible node
        Matrix+='"" [shape = point];"" -> 0 '

        // add transitions
        for (let i = 0; i < this.adjacencyMatrix.length; i++) {
            for (let j = 0; j < this.adjacencyMatrix[i].length; j++) {
                if (this.adjacencyMatrix[i][j] !== "") {
                    // use ' because viz.js seems to require " as label
                    Matrix+= i+ ' -> '+j+'[label="'+this.adjacencyMatrix[i][j]+'"]';
                }
            }
        }
        return "digraph {" + Matrix + "}"
    }

    /**
     *
     * @private
     * @runtime O(n^2)
     * @return returns a set of number listing all nodes that can be reached from the starting Node.
     */
    protected reach(): Set<number> {
        const reachable = new Set<number>([0]);
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

function hasIntersection<T>(A: Set<T>, B: Set<T>): boolean {
    for (const elem of A) {
        if (B.has(elem)) {
            return true;
        }
    }
    return false;
}

export class unorderPair {
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