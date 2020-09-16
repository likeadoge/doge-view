
import {
    LexerLoopNode,
    LexerIfNode,
    LexerElseNode,
    LexerEndNode,
    LexerOverNode,
    LexerCodeNode,
    LexerTextNode
} from "./lexer.mjs"
import { parser } from "./parser.mjs"

import {
    ParserProgarmNode,
    ParserExprNode,
    ParserExprListNode,
    ParserIfTailNode,
} from "./parser.mjs"

export class AstNode {
}

export class AstTextNode extends AstNode {
    content = ''
}

export class AstCodeNode extends AstNode {
    code = ''
}

export class AstIfNode extends AstNode {
    else = null
    code = ''
    children = []
}

export class AstLoopNode {
    valueField = ''
    indexField = ''
    code = ''

    children = []

    toHtml() { }
}

export class AstProgramNode {
    children = []
}

export function toAstNodeList(current) {

    if(!current){
        return []
    }

    if (current instanceof ParserProgarmNode) {
        const [node] = current.children
        const astNode = new AstProgramNode(current)
        astNode.children = toAstNodeList(node)
        return [astNode]
    }

    if (current instanceof ParserExprListNode) {
        const [expr, exprList] = current.children
        return [...toAstNodeList(expr), ...toAstNodeList(exprList)]
    }

    if (current instanceof ParserExprNode) {
        const [node, ...extra] = current.children

        if (node instanceof LexerTextNode) {
            const astNode = new AstTextNode(node)
            return [astNode]
        }

        if (node instanceof LexerCodeNode) {
            const astNode = new AstCodeNode(node)
            return [astNode]
        }

        if (node instanceof LexerLoopNode) {
            const astNode = new AstLoopNode(node)
            const [exprList,over] = extra
            astNode.children = toAstNodeList(exprList)
            return [astNode]
        }

        if (node instanceof LexerIfNode) {
            const astNode = new AstIfNode(node)
            const [exprList,tail] = extra
            astNode.children = toAstNodeList(exprList)
            astNode.else =  toAstNodeList(tail)[0] || null
            return [astNode]
        }
    }

    if(current instanceof ParserIfTailNode){
        const [node, ...extra] = current.children
        if(node instanceof LexerEndNode){
            return []
        }
        if(node instanceof LexerElseNode){
            const astNode = new AstIfNode(node)
            const [exprList,tail] = extra
            astNode.children = toAstNodeList(exprList)
            astNode.else =  toAstNodeList(tail)[0] || null
            return [astNode]
        }
    }
    debugger
    throw new Error('ast error!!!')
}






