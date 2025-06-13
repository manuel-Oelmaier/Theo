import {DFA, NFA} from "../src/regularLanguages";

describe('NFA', () => {
    let emptyNFA: NFA;
    let onlyaNFA: NFA;
    let evenbinaryNFA: NFA;

    beforeEach(() => {
        // Initialize emptyNFA properly
        let matrixEmpty = [[""]];  // or whatever defines empty NFA in your class
        let finalStatesEmpty = new Set<number>([0]);
        emptyNFA = new NFA(matrixEmpty, finalStatesEmpty);

        let matrixOnlyA = [["a"]];
        let finalStatesOnlyA = new Set<number>([0]);
        onlyaNFA = new NFA(matrixOnlyA, finalStatesOnlyA);

        let matrixEvenBinary = [["0", "1"], ["0", "1"]];
        let finalStatesEvenBinary = new Set<number>([0]);
        evenbinaryNFA = new NFA(matrixEvenBinary, finalStatesEvenBinary);
    });

    test.each([
        ['emptyNFA', () => emptyNFA, true],
        ['onlyaNFA', () => onlyaNFA, false],
        ['evenbinaryNFA', () => evenbinaryNFA, false],
    ])('%s.isEmpty() returns %s', (name, nfaGetter, expected) => {
        const nfa = nfaGetter();
        expect(nfa.isEmpty()).toBe(expected);
    });
    describe("NFA.contains()",() => {
        test.each([
            ["a",false],
            ["aa",false],
            ["b",false],
            ["aaaaaaa",false],
        ])('emptyNFA.contains(%s) returns %s', (word,  expected) => {
            expect(emptyNFA.contains(word)).toBe(expected);
        })

        test.each([
            ["a",true],
            ["aa",true],
            ["b",false],
            ["aaaaaaa",true],
        ])('onlyaNFA.contains(%s) returns %s', (word,  expected) => {
            expect(onlyaNFA.contains(word)).toBe(expected);
        })

        test.each([
            ["00000000000",true],
            ["010",true],
            ["1",false],
            ["11111111",false],
            ["000000001111101010110",true],
        ])('evenbinaryNFA.contains(%s) returns %s', (word,  expected) => {
            expect(evenbinaryNFA.contains(word)).toBe(expected);
        })



        test.each([
            [ () => emptyNFA, 'digraph {node [shape = doublecircle];0;node [shape = circle];"" [shape = point];"" -> 0 }'],
            [() => onlyaNFA, 'digraph {node [shape = doublecircle];0;node [shape = circle];"" [shape = point];"" -> 0 0 -> 0[label="a"]}'],
            [ () => evenbinaryNFA, 'digraph {0 -> 0[label="a"]}'],
        ])('.toDigraph() returns %s', ( getNFA:() => NFA, expected: string) => {
            const nfa = getNFA()
            expect(nfa.toDigraph()).toBe(expected);
        });
    })

});