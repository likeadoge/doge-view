
import {
    LexerLoopNode,
    LexerIfNode,
    LexerElseNode,
    LexerEndNode,
    LexerOverNode,
    LexerCodeNode,
    LexerTextNode
} from "./lexer.js"

import {
    ParserProgarmNode,
    ParserExprNode,
    ParserExprListNode,
    ParserIfTailNode,
} from "./parser.js"

export class AstNode {
    scope = null

    constructor(parent) {
        this.scope = Scope.extend(parent)
    }

    toHtml(data) { return '' }
}

export class AstParentNode extends AstNode {
    #children = []
    toHtml(data) { return this.#children.map(v => v.toHtml(data)).join('') }
    getChildren() { return this.#children }
    setChildren(children) { this.#children = children }
}

export class AstHtmlNode extends AstNode {
    content = ''
    constructor(scope, content) {
        super(scope)
        this.content = content
    }
    toHtml(data) { return this.content }
}

export class AstTextNode extends AstNode {
    #code = ''
    #fn = null
    constructor(scope, code) {
        super(scope)
        this.#code = code
        this.#fn = new Func(this.scope, this.#code)
    }
    toHtml(data) { return this.#fn.apply(data) }
}

export class AstIfNode extends AstParentNode {
    else = null
    #code = ''
    #fn = null
    constructor(parent, code) {
        super(parent)
        this.#code = code
        this.#fn = new Func(this.scope, this.#code)
    }

    toHtml(data) {
        const s = this.#fn.apply(data)
        if (s) {
            return this.getChildren().map(v => v.toHtml(data)).join('')
        } else if (this.else) {
            return this.else.toHtml(data)
        } else {
            return ''
        }
    }

}

export class AstLoopNode extends AstParentNode {
    #valueField = ''
    #indexField = ''
    #code = ''
    #fn = null

    constructor(parent, code, valueField = null, indexField = null) {
        super(parent)
        this.#code = code
        this.#valueField = valueField
        this.#indexField = indexField
        this.scope = Scope.extend(parent, [
            this.#valueField, this.#indexField
        ].filter(v => v))
        this.#fn = new Func(this.scope, this.#code)
    }
    toHtml(data) {
        const s = this.#fn.apply(data)
        return s.map((value, index) => {
            return this.getChildren().map(v => v.toHtml(Object.assign(
                {},
                data,
                this.#valueField ? { [this.#valueField]: value } : null,
                this.#indexField ? { [this.#indexField]: index } : null
            )))
        }).flat().join('')
    }

}

export class AstProgramNode extends AstParentNode {
    constructor(globe) {
        super(globe)
    }
}

function dealParserNode(current, parent = null) {

    if (!current) {
        return []
    }

    if (current instanceof ParserProgarmNode) {
        const [node] = current.children
        const astNode = new AstProgramNode(parent)
        astNode.setChildren(dealParserNode(node, astNode.scope))
        return [astNode]
    }

    if (current instanceof ParserExprListNode) {
        const [expr, exprList] = current.children
        return [...dealParserNode(expr, parent), ...dealParserNode(exprList, parent)]
    }

    if (current instanceof ParserExprNode) {
        const [node, ...extra] = current.children

        if (node instanceof LexerTextNode) {
            const astNode = new AstHtmlNode(parent, node.content)
            return [astNode]
        }

        if (node instanceof LexerCodeNode) {
            const astNode = new AstTextNode(parent, node.data.code)
            return [astNode]
        }

        if (node instanceof LexerLoopNode) {
            const astNode = new AstLoopNode(parent, node.data.code, node.data.input[0], node.data.input[1])
            const [exprList, over] = extra
            if (!over instanceof LexerOverNode) {
                throw new Error('ast error!!!')
            }
            astNode.setChildren(dealParserNode(exprList, astNode.scope))
            return [astNode]
        }

        if (node instanceof LexerIfNode) {
            const astNode = new AstIfNode(parent, node.data.code)
            const [exprList, tail] = extra
            astNode.setChildren(dealParserNode(exprList, astNode.scope))
            astNode.else = dealParserNode(tail, parent)[0] || null
            return [astNode]
        }
    }

    if (current instanceof ParserIfTailNode) {
        const [node, ...extra] = current.children
        if (node instanceof LexerEndNode) {
            return []
        }
        if (node instanceof LexerElseNode) {
            const astNode = new AstIfNode(parent, node.data.code)
            const [exprList, tail] = extra
            astNode.setChildren(dealParserNode(exprList, astNode.scope))
            astNode.else = dealParserNode(tail, parent)[0] || null
            return [astNode]
        }
    }

    throw new Error('ast error!!!')
}



export function toAst(parserNode, globeData) {
    return dealParserNode(parserNode, new Scope(Object.keys(globeData)))[0]
}


class Scope {
    #vars = []

    static extend(parent, vars = []) {
        return new Scope(Array.from(new Set(
            parent.getVars().concat(vars)
        )))

    }

    constructor(vars) {
        this.#vars = vars.map(v => v.trim())
    }

    getVars() { return this.#vars }
}



class Func {
    #body = ''
    #scope = null
    #fn = () => { }
    constructor(scope, body) {
        this.#body = body
        this.#scope = scope
        this.#fn = new Function(
            ...this.#scope.getVars(),
            `return (${this.#body || 'undefined'})`
        )
    }
    apply(input) {
        return this.#fn.apply(
            input,
            this.#scope.getVars().map(key => input[key])
        )
    }
}