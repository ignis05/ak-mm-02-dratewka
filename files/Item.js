class Item {
    constructor(id, displayName, flag, name, reqLocation) {
        this.id = id
        this.displayName = displayName
        this.flag = flag
        this.name = name
        this.reqLocation = reqLocation
    }
    use() {
        if (this.id == "36") {
            map.interactions[this.id]()
            return
        }
        if (map.currentLocation().id == this.reqLocation) {
            console.log("using");
            map.carry = null;
            map.interactions[this.id]()
        }
        else {
            console.log("cant use that here");
            gameConsole.setTempMsg("Nothing happened")
        }
    }
}