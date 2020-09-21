

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


import {
    lexer,
    LexerLoopNode,
    LexerIfNode,
    LexerElseNode,
    LexerEndNode,
    LexerOverNode,
    LexerCodeNode,
    LexerTextNode
} from './lexer.mjs'

class ParserNode {
    children = []
}

export class ParserProgarmNode extends ParserNode {

}
export class ParserExprNode extends ParserNode {
}
export class ParserExprListNode extends ParserNode {
}
export class ParserIfTailNode extends ParserNode {
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
            LexerTextNode,
            LexerCodeNode,
            LexerLoopNode,
            LexerIfNode
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
            LexerTextNode,
            LexerCodeNode,
            LexerLoopNode,
            LexerIfNode
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

        if (this.#exist(LexerTextNode)) {
            node.children = node.children.concat([
                this.#match(LexerTextNode)
            ])
        } else if (this.#exist(LexerCodeNode)) {
            node.children = node.children.concat([
                this.#match(LexerCodeNode)
            ])
        } else if (this.#exist(LexerLoopNode)) {
            node.children = node.children.concat([
                this.#match(LexerLoopNode),
                this.expr_list(),
                this.#match(LexerOverNode)
            ])
        } else if (this.#exist(LexerIfNode)) {
            node.children = node.children.concat([
                this.#match(LexerIfNode),
                this.expr_list(),
                this.if_tail()
            ])
        } else {
            this.#error()
        }

        return node
    }
    if_tail() {
        const node = new ParserIfTailNode()
        if (this.#exist(LexerElseNode)) {
            node.children = node.children.concat([
                this.#match(LexerElseNode),
                this.expr_list(),
                this.if_tail(),
            ])
        } else if (this.#exist(LexerEndNode)) {
            node.children = node.children.concat([
                this.#match(LexerEndNode)
            ])
        } else {
            this.#error()
        }

        return node
    }
}

export function parser(tmpl) {
    const tokens = lexer(tmpl)
    const s = new Parser(tokens)
    return s.program()
}


