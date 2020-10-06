# 实现一个基础的模板引擎(其二)


话接上节，我们用 BNF 定义了一个语法，本节要通过递归下将其转变为代码。但在做这件事情以前，我们还需要对原 BNF 进行转换，原来那个并不好直接转为代码。首先我们定义一·符号 ε，用它来表示为空。像 <expr> = loop over 则可以表示为 <expr> = loop ε over，因为它什么都不匹配，于是可以插入进任意两个符号之间去。定义这个符号自然是为了简化我们的 BNF 表达式。有了它，我们的表达式则可以书写为更易读的形式。

```javascript
/**
* <progarm>  => <expr> $$

* <expr>     => <expr> <expr>
*            => text
*            => code 
*            => loop <expr> over
*            => if <expr> <if_tail> 
*            => ε
* 
* <if_tail>  => else <expr> <if_tail>
*            => end
*/
```

到了这里还不算完，并不是所有的 BNF 表达式都能转变为代码。根据转化的方法不同，对于 BNF 的限制也不一样。我们使用的递归下降法是一个经典的用于解析 LL 语法的表达式，由于我们只向后检查一个单词，所以我们对语法的要求限于 LL(1) 语法。对于 LL 的定义，这里不做深究。但 LL 语法有个特别要求就是不能出现左递归。
何谓左递归即，一个表达式的右侧第一个元素引用了自身。如 

    <expr>     => <expr> <expr>

这就是一个左递归的表达式。这是一种直接左递归的形式，还有一种间接左递归的形式，譬如这样，`<a>` 最左侧引用了 `<b>` 而 `<b>` 最左侧又引用了 `<a>` 。

    <a> => <b> c
    <b> => <a> d

如何在我们的 BNF 表达式中消除左递归呢，只需要构造一个 expr_list 就行了

```javascript
/**
* <progarm>   => <expr_list> $$
* 
* <expr_list> => <expr> <expr_list>
*             => ε
* 
* <expr>      => text
*             => code 
*             => loop <expr_list> over
*             => if <expr_list> <if_tail> 
* 
* <if_tail>   => else <expr_list> <if_tail>
*             => end
*/
```

接下来构建 Parser 代码。首先定义一个 #tokens 属性，代表所有待解析的词，这是一个 LexerNode 的数组。然后 #error 方法用于反馈解析时出现的错误，抛出当前栈的元素方便咱们自己 debug。继续定义 #token 方法，查看 #tokens 顶层的元素。#is 方法传入一个构造函数用于检查顶层元素是否是对应的节点，#exist 则是传入多个构造函数检查顶层节点是否存在其中。#match 方法不仅检查对应项，若是对应项则从顶层取出一个元素，否则报错。还记得我们定义字符结束的 $$ 符号吗，当取出所有字符后，顶层自然是 undefined，于是我们定义个静态属性表示这个元素。顺便修改下 #is 方法。


```javascript
class Parser {
    static $$ = undefined

    constructor(list) {
        this.#tokens = list
    }

    #tokens = []
    #token() { return this.#tokens[0] }
    #error() {
        console.error("error token:", this.#tokens)
        return new Error('Parse Error!')
    }
    #is(target) {
        return target === Parser.$$
            ? this.#token() === Parser.$$
            : this.#token() instanceof target
    }
    #exist(...args) {
        return args.findIndex(v => this.#is(v)) >= 0
    }
    #match(target) {
        return this.#is(target)
            ? this.#tokens.shift()
            : this.error()
    }
}
```

做完准备工作，正式开始 Parser 的构造。对于每个非终结符，都是这个 Parser 上的一个公有方法，于是我们又 progarm / expr_list / expr / if_tail 四个方法。在 program 中找第一个符号。第一个是非终结符 expr_list,在找 expr_list 第一个符号。直到找到 expr 这里第一个为终结符的。 expr 分别可以 text/code/loop/if 开始，于是我们有第一个判断，当下个字符为 text/code/loop/if 时执行 expr_list 方法，也就是对 expr_list 进行解析。解析完成后，看到下个字符为终结符 $$,于是用 #match 把它取出来。如果都无法匹配，意味着输入的字符流有问题，于是调用 #error 报错。按此逻辑我们可以把接下来的几个方法也推出来。只不过 expr_list 需要注意一下有个 ε，因为可以为空所以当什么都没有匹配上的时候不需要报错就行。


```javascript
class Parser {
    static $$ = undefined

    constructor(list) {
        this.#tokens = list
    }

    #tokens = []
    #token() { return this.#tokens[0] }
    #error() {
        console.error("error token:", this.#tokens)
        return new Error('Parse Error!')
    }
    #is(target) {
        return target === Parser.$$
            ? this.#token() === Parser.$$
            : this.#token() instanceof target
    }
    #exist(...args) {
        return args.findIndex(v => this.#is(v)) >= 0
    }
    #match(target) {
        return this.#is(target)
            ? this.#tokens.shift()
            : this.error()
    }

    program() {
        if (this.#exist(
            LexerTextNode,
            LexerCodeNode,
            LexerLoopNode,
            LexerIfNode
        )) {
            this.expr_list()
            this.#match(Parser.$$)
        } else {
            this.#error()
        }
    }

    expr_list() {
        if (this.#exist(
            LexerTextNode,
            LexerCodeNode,
            LexerLoopNode,
            LexerIfNode
        )) {
            this.expr();
            this.expr_list()
        }
    }

    expr() {
        if (this.#exist(LexerTextNode)) {
            this.#match(LexerTextNode)
        } else if (this.#exist(LexerCodeNode)) {
            this.#match(LexerCodeNode)
        } else if (this.#exist(LexerLoopNode)) {
            this.#match(LexerLoopNode)
            this.expr_list()
            this.#match(LexerOverNode)
        } else if (this.#exist(LexerIfNode)) {
            this.#match(LexerIfNode)
            this.expr_list()
            this.if_tail()
        } else {
            this.#error()
        }
    }

    if_tail() {
        if (this.#exist(LexerElseNode)) {
            this.#match(LexerElseNode)
            this.expr_list()
            this.if_tail()
        } else if (this.#exist(LexerEndNode)) {
            this.#match(LexerEndNode)
        } else {
            this.#error()
        }
    }
}
```

 接下来构建一个 parser 函数测试下代码

```javascript
export function parser(tmpl){
    const tokens = lexer(tmpl)
    const target = new Parser(tokens)
    target.program()
    console.log(target)
}
```

如果执行完成后并没有报错，且最后 target 的 #tokens 为空，那么代表着代码执行成功。不过，这一段代码似乎只仅仅验证了 token 是否正确，并没有返回一个树状的结构。我们希望所得的结果应该和我们 BNF 所定义的那样， 每一个终结符为这个数的叶子节点，而非终结符节点则包含 children 属性，将整颗树组织起来。
于是我们为所有的非终结符定义一个 class。


```javascript
class ParserNode {
    childeren = []
}

export class ParserProgarmNode extends ParserNode {
}
export class ParserExprNode extends ParserNode {
}
export class ParserExprListNode extends ParserNode {
}
export class ParserIfTailNode extends ParserNode {
}
```

而于此对应的是 Parser 中每一个方法都要返回一个对应的 ParserNode 实例，而他们的 children ，其实我们在逐步的解析过程中就可以收集到。

```javascript
   program() {
        const node = new ParserProgarmNode()

        if (this.#exist(
            LexerTextNode,
            LexerCodeNode,
            LexerLoopNode,
            LexerIfNode
        )) {
            node.childeren = node.childeren.concat([
                this.expr_list(),
                this.#match(Parser.$$)
            ])
        } else {
            this.#error()
        }
        return node
    }
```

修改一下 parser 代码，就能看到我们需要的 parserNode。

```javascript
export function parser(tmpl) {
    const tokens = lexer(tmpl)
    const s = new Parser(tokens)
    return s.program()
}
```

