


/**
 * <progarm>  => <expr>  $$
 *            => $$

 * <expr>     => <expr> <expr>
 *            => text
 *            => code 
 *            => loop <expr> over
 *            => loop over
 *            => if <expr> <if_tail> 
 *            => if <if_tail>  
 * 
 * <if_tail>  => end
 *            => else <expr> <if_tail>
 *            => else <if_tail>
 */

/**
* <progarm>  => <expr> $$

* <expr>     => <expr> <expr>
*            => text
*            => code 
*            => loop <expr> over
*            => if <expr> <if_tail> 
*            => ε
* 
* <if_tail>  => else <expr> <if_tail>
*            => end
*/


/**
* <progarm>   => <expr_list> $$
* 
* <expr_list> => <expr> <expr_list>
*             => ε
* 
* <expr>      => text
*             => code 
*             => loop <expr_list> over
*             => if <expr_list> <if_tail> 
* 
* <if_tail>   => else <expr_list> <if_tail>
*             => end
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
} from './lexer.js'

class ParserNode {
    childeren = []
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
            node.childeren = node.childeren.concat([
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
            node.childeren = node.childeren.concat([
                this.expr(),
                this.expr_list()
            ])
        }
        return node
    }
    expr() {
        const node = new ParserExprNode()

        if (this.#exist(LexerTextNode)) {
            node.childeren = node.childeren.concat([
                this.#match(LexerTextNode)
            ])
        } else if (this.#exist(LexerCodeNode)) {
            node.childeren = node.childeren.concat([
                this.#match(LexerCodeNode)
            ])
        } else if (this.#exist(LexerLoopNode)) {
            node.childeren = node.childeren.concat([
                this.#match(LexerLoopNode),
                this.expr_list(),
                this.#match(LexerOverNode)
            ])
        } else if (this.#exist(LexerIfNode)) {
            node.childeren = node.childeren.concat([
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
            node.childeren = node.childeren.concat([
                this.#match(LexerElseNode),
                this.expr_list(),
                this.if_tail(),
            ])
        } else if (this.#exist(LexerEndNode)) {
            node.childeren = node.childeren.concat([
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


