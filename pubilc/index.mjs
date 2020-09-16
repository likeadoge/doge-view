import {
    lexer,
    LexerLoopNode,
    LexerIfNode,
    LexerElseNode,
    LexerEndNode,
    LexerOverNode,
    LexerCodeNode,
    LexerTextNode
} from './framework/Lexer.mjs'
import { parser } from './framework/parser.mjs'


lexer(document.getElementById('tpl').innerHTML).flatMap(v =>
    [
        [LexerLoopNode,'#FFA500'],
        [LexerOverNode,'#FFE211'],
        [LexerIfNode,'#FFC0CB'],
        [LexerElseNode,'#D80000'],
        [LexerEndNode,'#66ccff'],
        [LexerCodeNode,'#39C5BB'],
        [LexerTextNode,"#cccccc"]
    ].map(([Cls,color])=>{
        if(v instanceof Cls){
            const span = document.createElement('span')
            span.innerText = v.content.split(' ').join('-')
            span.style.background = color
            return span
        }else {
            return null
        }
    })
).filter(v=>!!v).forEach(span => {
    document.getElementById('app').appendChild(span)
})

<<<<<<< HEAD

console.log(parser(document.getElementById('tpl').innerHTML))



=======
console.log(parser(document.getElementById('tpl').innerHTML))
>>>>>>> parent of 023fdfd... 添加 LexerAttrNode 正则

