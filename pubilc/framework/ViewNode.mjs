export class ViewableNode {
    parent = null
    anchorId = ''
    nodeList = []

    constructor(anchorId, parent = null) {
        this.anchorId = anchorId
        this.parent = parent
    }

    genHtml() { return `<template id="${this.anchorId}"></template>` }

    render() {
        this.remove()
        this.nodeList = []
    }

    insertTo(target) {
        const anchor = target.querySelector(`#${this.anchorId}`)
        if (anchor) {
            const fragment = document.createDocumentFragment()
            this.nodeList.forEach(v => fragment.appendChild(v))
            anchor.after(fragment)
        } else {
            console.warn('AnchorElement is not found!', this)
        }
    }

    remove() {
        this.nodeList.forEach(v => v.remove())
    }
}

export class TextNode extends ViewableNode {
    nodeList = []
    text = ''
    constructor(pa, text) {
        super(`el_${Math.floor(Math.random() * 1e17)}`, pa)
        this.text = text
    }
    render() {
        this.remove()

        this.nodeList = [document.createTextNode(this.text)]
    }
}

export class HtmlNode extends ViewableNode {
    html = ''
    constructor(pa, html) {
        super(`el_${Math.floor(Math.random() * 1e17)}`, pa)
        this.html = html
    }

    genHtml() {
        return this.html
    }

    render() { }

    insertTo() { }

    remove() { }
}

export class GroupNode extends ViewableNode {
    nodeList = []

    #attr = {}
    #event = {}
    children = []

    constructor(pa) {
        super(`el_${Math.floor(Math.random() * 1e17)}`, pa)
    }

    render() {
        this.remove()

        const target = document.createElement('template')
        target.innerHTML = this.children.map(v => v.genHtml()).join('')

        this.children.forEach(v => {
            v.render()
            v.insertTo(target.content)
        })

        this.nodeList = Array.from(target.content.childNodes)

        // 添加属性
        this.nodeList.filter(v => v.setAttribute).forEach(element => {
            Object.entries(this.#attr).forEach(([name, value]) => {
                element.setAttribute(name, value)
            })
        })

        // 绑定事件
        this.nodeList.filter(v => v.addEventListener).forEach(element => {
            Object.entries(this.#event).forEach(([type, listener]) => {
                element.addEventListener(type, listener)
            })
        })
    }
    setAttr(name, value) {
        this.#attr[name] = value
    }
    bindEvent(type, event) {
        this.#event[type] = event
    }

}

export class RootNode extends ViewableNode {
    constructor(pa) {
        super(`el_${Math.floor(Math.random() * 1e17)}`, pa)
    }

    render() {
        this.remove()

        const target = document.createElement('template')
        target.innerHTML = this.children.map(v => v.genHtml()).join('')

        this.children.forEach(v => {
            v.render()
            v.insertTo(target.content)
        })

        this.nodeList = Array.from(target.content.childNodes)

    }

    mount(cntr) {
        cntr.innerHTML = this.genHtml()
        this.render()
        this.insertTo(cntr)
    }


}

export class LoopNode extends GroupNode {
    nodeList = []

    children = []


    #items = []
    constructor(pa) {
        super(pa)
    }


    render() {
        this.remove()

        const target = document.createElement('template')
        target.innerHTML = this.children.map(v => v.genHtml()).join('')

        this.children.forEach(v => {
            v.render()
            v.insertTo(target.content)
        })

        this.nodeList = Array.from(target.content.childNodes)
    }
    setAttr(name, value, index) {
        this.#items[index]?.setAttr(name, value)
    }
    bindEvent(type, event, index) {
        this.#items[index]?.bindEvent(type, event)
    }
}

