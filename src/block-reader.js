class BlockReader {
    constructor(callback) {
        this.buffer = ''
        this.callback = callback
    }

    append(data) {
        // console.debug(data, data.length, JSON.stringify(this.buffer))
        if (data.length === 0) {
            this.processBlock()
            return
        }
        this.buffer += data + '\n'
    }

    processBlock() {
        // console.debug(this.buffer)
        this.callback(this.buffer)
        this.buffer = ''
    }
}

export default BlockReader