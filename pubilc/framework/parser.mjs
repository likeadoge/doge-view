

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


import Token, {
    TokenHtmlNode,
    TokenTextNode,
    TokenHeadNode,
    TokenSubHeadNode,
    TokenTailNode,
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

export class Parser {
    static gen(tmpl){
        const tokens = Token.scan(tmpl)
        const s = new Parser(tokens)
        return s.program()
    }

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
            TokenTextNode,
            TokenHtmlNode,
            TokenHeadNode
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
            TokenTextNode,
            TokenHtmlNode,
            TokenHeadNode
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

        if (this.#exist(TokenTextNode)) {
            node.children = node.children.concat([
                this.#match(TokenTextNode)
            ])
        } else if (this.#exist(TokenHtmlNode)) {
            node.children = node.children.concat([
                this.#match(TokenHtmlNode)
            ])
        } else if (this.#exist(TokenHeadNode)) {
            node.children = node.children.concat([
                this.#match(TokenHeadNode),
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
        if (this.#exist(TokenSubHeadNode)) {
            node.children = node.children.concat([
                this.#match(TokenSubHeadNode),
                this.expr_list(),
                this.next(),
            ])
        } else if (this.#exist(TokenTailNode)) {
            node.children = node.children.concat([
                this.#match(TokenTailNode)
            ])
        } else {
            this.#error()
        }

        return node
    }
}

