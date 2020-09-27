
import {
    TokenHeadNode,
    TokenSubHeadNode,
    TokenTailNode,
    TokenTextNode,
    TokenHtmlNode
} from "./Token.mjs"

import {
    ParserProgarmNode,
    ParserExprNode,
    ParserExprListNode,
    ParserNextNode,
    Parser
} from "./Parser.mjs"

import {
    TextNode,
    GroupNode,
    RootNode,
    HtmlNode
} from "./ViewNode.mjs"

import * as rand from '/pubilc/utils/rand.mjs'

export class Ast {
    static gen(tmpl, argus) {
        const program = Parser.gen(tmpl)

        const toAstNodeList = (current, globe, parent = null) => {
            if (!current) {
                return []
            }

            if (current instanceof ParserProgarmNode) {
                const [node] = current.children
                const astNode = new AstRootNode(current, globe, parent)
                astNode.children = toAstNodeList(node, globe, astNode)
                return [astNode]
            }

            if (current instanceof ParserExprListNode) {
                const [expr, exprList] = current.children
                return [...toAstNodeList(expr, globe, parent), ...toAstNodeList(exprList, globe, parent)]
            }


            if (current instanceof ParserExprNode) {
                const [node, ...extra] = current.children

                if (node instanceof TokenHtmlNode) {
                    const astNode = new AstHtmlNode(node, globe, parent)
                    return [astNode]
                }

                if (node instanceof TokenTextNode) {
                    const astNode = new AstTextNode(node, globe, parent)
                    return [astNode]
                }

                if (node instanceof TokenHeadNode) {
                    const [exprlist, next] = extra
                    const astNode = new AstFragmentNode(node, globe, parent)
                    const astChildNode = new AstElemntNode(node, globe, astNode)

                    astChildNode.children = toAstNodeList(exprlist, globe, astChildNode)

                    astNode.children = [
                        astChildNode,
                        ...toAstNodeList(next, globe, parent)
                    ]
                    return [astNode]
                }
            }

            if (current instanceof ParserNextNode) {
                const [node, ...extra] = current.children
                if (node instanceof TokenTailNode) {
                    return []
                }
                if (node instanceof TokenSubHeadNode) {
                    const [exprlist, next] = extra
                    const astNode = new AstElemntNode(node, globe, parent)
                    astNode.children = toAstNodeList(exprlist, globe, astNode)
                    return [astNode, ...toAstNodeList(next, globe, parent)]
                }
            }
        }

        return toAstNodeList(program, new Scope(argus))[0]
    }
    scope = null
    children = []
    id = ''

    constructor(current, globe, parent) {
        this.id = 'el-' + rand.uuid()
        this.scope = Scope.extend(parent ? parent.scope : globe)
    }

}

export class AstRootNode extends Ast {

    render(pa = null, data) {
        const node = new RootNode()
        node.children = this.children.map(v => v.render(node, data))
        return node
    }
}

export class AstTextNode extends Ast {
    #fn = null

    constructor(current, globe, parent) {
        super(current, globe, parent)
        this.#fn = new Func(this.scope, current.data.code)
    }
    render(pa = null, data) {
        const node = new TextNode(pa, this.#fn.apply(data))
        return node
    }
}

export class AstHtmlNode extends Ast {
    #content = ''
    constructor(current, globe, parent) {
        super(current, globe, parent)
        this.#content = current.content
    }

    render(pa = null, data) {
        const node = new HtmlNode(pa, this.#content)
        return node
    }
}

export class AstFragmentNode extends Ast {

    render(pa = null, data) {
        return this.children[0].render(pa, data)
    }
}

export class AstElemntNode extends Ast {
    render(pa = null, data) {
        const node = new GroupNode(pa)
        node.children = this.children.map(v => v.render(node, data))
        return node
    }
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