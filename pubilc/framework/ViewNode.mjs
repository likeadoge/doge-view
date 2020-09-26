class ViewableNode {
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


class TextNode extends ViewableNode {
    nodeList = []
    text = ''
    constructor(pa) {
        super(`el_${Math.floor(Math.random() * 1e17)}`, pa)
    }
    render() {
        this.remove()

        this.nodeList = [document.createTextNode(this.text)]
    }
}

class GroupNode extends ViewableNode {
    nodeList = []

    attr = {}
    event = {}
    children = []

    constructor(pa) {
        super(`el_${Math.floor(Math.random() * 1e17)}`, pa)
    }

    render() {
        this.remove()

        const target = document.createElement('template')
        target.innerHTML = this.children.map(v => v.toHtml()).join('')

        this.children.forEach(v => {
            v.render()
            v.insertTo(target.content)
        })

        this.nodeList = Array.from(target.content.childNodes)

        // 添加属性
        this.nodeList.filter(v => v.setAttribute).forEach(element => {
            Object.entries(this.attr).forEach(([name, value]) => {
                element.setAttribute(name, value)
            })
        })

        // 绑定事件
        this.nodeList.filter(v => v.addEventListener).forEach(element => {
            Object.entries(this.event).forEach(([type, listener]) => {
                element.addEventListener(type, listener)
            })
        })
    }

}


