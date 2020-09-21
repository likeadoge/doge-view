

/**
* <progarm>   => <expr_list> $$
* 
* <expr_list> => <expr> <expr_list>
*             => ε
* 
* <expr>      => text
*             => html 
*             => head <expr_list> <next>
* 
* <next>      => subhead <expr_list> <next>
*             => tail
*/


import Token,{
    Html,
    Text,
    Head,
    SubHead,
    Tail,
} from './Token.mjs'

class ParserNode {
    children = []
}

export class ParserProgarmNode extends ParserNode {

}
export class ParserExprNode extends ParserNode {
}
export class ParserExprListNode extends ParserNode {
}
export class ParserNextNode extends ParserNode {
}

class Parser {
    static $$ = undefined

    constructor(list) {
        this.#tokens = list
    }

    #tokens = []
    #token() { return this.#tokens[0] }
    #error() {
        console.error("error token:", this.#tokens)
        return new Error('Parse Error!')
    }
    #is(target) {
        return target === Parser.$$
            ? this.#token() === Parser.$$
            : this.#token() instanceof target
    }
    #exist(...args) {
        return args.findIndex(v => this.#is(v)) >= 0
    }
    #match(target) {
        return this.#is(target)
            ? this.#tokens.shift()
            : this.error()
    }
    program() {
        const node = new ParserProgarmNode()

        if (this.#exist(
            Text,
            Html,
            Head
        )) {
            node.children = node.children.concat([
                this.expr_list(),
                this.#match(Parser.$$)
            ])

        } else {
            this.#error()
        }

        return node
    }
    expr_list() {
        const node = new ParserExprListNode()
        if (this.#exist(
            Text,
            Html,
            Head
        )) {
            node.children = node.children.concat([
                this.expr(),
                this.expr_list()
            ])
        }
        return node
    }
    expr() {
        const node = new ParserExprNode()

        if (this.#exist(Text)) {
            node.children = node.children.concat([
                this.#match(Text)
            ])
        } else if (this.#exist(Html)) {
            node.children = node.children.concat([
                this.#match(Html)
            ])
        } else if (this.#exist(Head)) {
            node.children = node.children.concat([
                this.#match(Head),
                this.expr_list(),
                this.next(),
            ])
        } else {
            this.#error()
        }

        return node
    }
    next() {
        const node = new ParserNextNode()
        if (this.#exist(SubHead)) {
            node.children = node.children.concat([
                this.#match(SubHead),
                this.expr_list(),
                this.next(),
            ])
        } else if (this.#exist(Tail)) {
            node.children = node.children.concat([
                this.#match(Tail)
            ])
        } else {
            this.#error()
        }

        return node
    }
}

export function parser(tmpl) {
    const tokens = Token.scan(tmpl)
    const s = new Parser(tokens)
    return s.program()
}


