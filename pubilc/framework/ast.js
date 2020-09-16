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



class AstNode {
    toFragment(){}
}
