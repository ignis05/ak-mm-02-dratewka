class Location {
    constructor(id, label, img, color, ways, items) {
        this.id = id
        this.label = label
        this.img = img
        this.color = color
        this.ways = ways
        this.items = (items ? items : []) //define empty array if no items given
    }
    get avlDirections() { //returns string with avalible directions
        var string = ""
        this.ways.forEach(el => {
            switch (el) {
                case "N":
                    string += "NORTH"
                    break;
                case "S":
                    string += "SOUTH"
                    break;
                case "W":
                    string += "WEST"
                    break;
                case "E":
                    string += "EAST"
                    break;
                default:
                    console.error("ways list error")
            }
            string += ", "
        });
        string = string.substring(0, string.length - 2);
        return string
    }
    get avlItems() { //returns string with avalible items
        var string = ""
        if (!this.items) {
            string += " nothing"
        }
        else {
            for (let z of this.items) {
                string += " " + map.items[z].displayName + ","
            }
            string = string.substring(0, string.length - 1);
        }
        return string
    }
    get interactiveItemsCount() {
        var count = 0;
        this.items.forEach(el => {
            if (map.items[el].flag) {
                count++
            }
        })
        return count;
    }
    wayTarget(direction) { //returnes id of location placed n/s/w/e of this one, or false if way not avalible
        console.log(this.id);
        if (this.ways.includes(direction)) {
            return this.getTarget(direction)
        }
        else {
            return false
        }
    }
    getTarget(direction) { //returnes id of location n/s/w/e, autoused by wayTarget
        var loc
        switch (direction) {
            case "E":
                loc = (this.id[0]) + (parseInt(this.id[1]) + 1).toString()
                break;
            case "W":
                loc = (this.id[0]) + (parseInt(this.id[1]) - 1).toString()
                break;
            case "N":
                loc = (parseInt(this.id[0]) - 1).toString() + (this.id[1])
                break;
            case "S":
                loc = (parseInt(this.id[0]) + 1).toString() + (this.id[1])
                break;
            default:
                console.error("Error in 'ways table' of location " + this.id)
        }
        return loc
    }
}