
import {
    LexerLoopNode,
    LexerIfNode,
    LexerElseNode,
    LexerEndNode,
    LexerOverNode,
    LexerCodeNode,
    LexerTextNode
} from "./lexer.mjs"

import {
    ParserProgarmNode,
    ParserExprNode,
    ParserExprListNode,
    ParserIfTailNode,
} from "./parser.mjs"

export class AstNode {
    scope = null
    children = []

    constructor(target, globe, parent) {
        this.scope = parent ? Scope.extend(parent.scope) : globe
    }

    toHtml(data){return ''}
}

export class AstTextNode extends AstNode {
    content = ''
    constructor(target, globe, parent) {
        super(target, globe, parent)
        this.content = target.content
    }
    toHtml(data){return this.content}
}

export class AstCodeNode extends AstNode {
    #code = ''
    #fn = null
    constructor(target, globe, parent) {
        super(target, globe, parent)
        this.#code = target.data.code
        this.#fn = new Func(this.scope,this.#code)
    }
    toHtml(data){return this.#fn.apply(data)}
}

export class AstIfNode extends AstNode {
    else = null
    #code = ''
    #fn = null
    constructor(target, globe, parent) {
        super(target, globe, parent)
        this.#code = target.data.code
        this.#fn = new Func(this.scope,this.#code)
    }

    toHtml(data){
        const s = this.#fn.apply(data)
        if(s){
            return this.children.map(v=>v.toHtml(data)).join('')
        }else if(this.else){
            return this.else.toHtml(data)
        }else{
            return ''
        }
    }

}

export class AstLoopNode extends AstNode {
    #valueField = ''
    #indexField = ''
    #code = ''
    #fn = null

    constructor(target, globe, parent) {
        super(target, globe, parent)
        this.#code = target.data.code
        this.#valueField = target.data.input[0] || null
        this.#indexField = target.data.input[1] || null
        this.scope = Scope.extend(parent.scope, [
            this.#valueField, this.#indexField
        ].filter(v=>v))
        this.#fn = new Func(this.scope,this.#code)
    }
    toHtml(data){
        const s = this.#fn.apply(data)
        return s.map((value,index)=>{
            return this.children.map(v=>v.toHtml(Object.assign(
                {},
                data,
                this.#valueField?{[this.#valueField]:value}:null,
                this.#indexField?{[this.#indexField]:index}:null
            )))
        }).flat().join('')
    }

}

export class AstProgramNode extends AstNode {
    children = []
    constructor(target, globe, parent) {
        super(target, globe, parent)
        this.scope = globe
    }
    toHtml(data){
        return this.children.map(v=>v.toHtml(data)).join('')
    }
}

export function toAstNodeList(current, globe, parent = null) {

    if (!current) {
        return []
    }

    if (current instanceof ParserProgarmNode) {
        const [node] = current.children
        const astNode = new AstProgramNode(current, globe, parent)
        astNode.children = toAstNodeList(node, globe, astNode)
        return [astNode]
    }

    if (current instanceof ParserExprListNode) {
        const [expr, exprList] = current.children
        return [...toAstNodeList(expr, globe, parent), ...toAstNodeList(exprList, globe, parent)]
    }

    if (current instanceof ParserExprNode) {
        const [node, ...extra] = current.children

        if (node instanceof LexerTextNode) {
            const astNode = new AstTextNode(node, globe, parent)
            return [astNode]
        }

        if (node instanceof LexerCodeNode) {
            const astNode = new AstCodeNode(node, globe, parent)
            return [astNode]
        }

        if (node instanceof LexerLoopNode) {
            const astNode = new AstLoopNode(node, globe, parent)
            const [exprList, over] = extra
            if (!over instanceof LexerOverNode) {
                throw new Error('ast error!!!')
            }
            astNode.children = toAstNodeList(exprList, globe, astNode)
            return [astNode]
        }

        if (node instanceof LexerIfNode) {
            const astNode = new AstIfNode(node, globe, parent)
            const [exprList, tail] = extra
            astNode.children = toAstNodeList(exprList, globe, astNode)
            astNode.else = toAstNodeList(tail, globe, parent)[0] || null
            return [astNode]
        }
    }

    if (current instanceof ParserIfTailNode) {
        const [node, ...extra] = current.children
        if (node instanceof LexerEndNode) {
            return []
        }
        if (node instanceof LexerElseNode) {
            const astNode = new AstIfNode(node, globe, parent)
            const [exprList, tail] = extra
            astNode.children = toAstNodeList(exprList, globe, astNode)
            astNode.else = toAstNodeList(tail, globe, parent)[0] || null
            return [astNode]
        }
    }

    throw new Error('ast error!!!')
}



export function toAst(parserNode, globeData) {
    return toAstNodeList(parserNode, new Scope(Object.keys(globeData)))[0]
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