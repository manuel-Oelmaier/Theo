import {NFA,unorderedPair} from './NFA'
import {regularLanguage} from "../LanugageDefinitions";


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
     * minimizes a DFA by 1. removing all
     *  2.all accepting states are surely different from non accepting states.
     *  3.check the others manually by comparing transitions
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
        // iterate over pairs, if State a and State b of pair have an edge marked with the same symbol of the Alphabet
        // to the same marked State -> add it to marked.
        // and remove from pairs ?.
        let changed = true;
        while (changed) {
            changed = false;
            pairs.forEach((pair: unorderPair) => {
                for (const char of this.alphabet) {
                    let connectedState = new unorderPair(this.findChar(char, pair.x), this.findChar(char, pair.y));
                    if (differentStates.has(connectedState)) {
                        differentStates.add(pair);
                        pairs.delete(pair);
                        changed = true;
                    }
                }
            })
        }
        // construct automaton out of
        console.log(differentStates);
        return this;
    }

    findChar(char: string, matrixRow: number): number {
        for (let i = 0; i < this.adjacencyMatrix[matrixRow].length; i++) {
            if (this.adjacencyMatrix[matrixRow][i] === char) {
                return i;
            }
        }
        return matrixRow;
    }

    residualLanguages(): regularLanguage[] {
        return [];
    }

}