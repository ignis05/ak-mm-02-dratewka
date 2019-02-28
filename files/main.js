var gameConsole = {
    caps: true,
    cheats: false,
    inputInterpreter: function () {
        this.input = document.getElementById("consoleIn").value.toUpperCase() //read
        document.getElementById("consoleIn").value = "" //clear
        console.log("Input: ", this.input);
        if (this.cheats && this.input.split(" ")[0] == "GET") { //get command
            if (isNaN(this.input.split(" ")[1])) { //if name
                let item = Object.values(map.items).find(x => x.name == this.input.split(" ")[1])
                console.log(item.id);
                map.carry = item.id
            }
            else { //if id
                map.carry = this.input.split(" ")[1]
            }
            this.display()
            return
        }
        if (this.cheats && this.input.split(" ")[0] == "TP") { //tp command
            map.position = this.input.split(" ")[1]
            this.display()
            return
        }
        if (this.cheats && this.input.split(" ")[0] == "SKIP") { //skip command (gives ship) and tp to 43
            map.position = "43"
            map.carry = "37"
            this.display()
            return
        }
        switch (this.input.split(" ")[0]) {

            case "N": case "NORTH":
                this.move("N")
                break;

            case "S": case "SOUTH":
                this.move("S")
                break;

            case "E": case "EAST":
                this.move("E")
                break;

            case "W": case "WEST":
                this.move("W")
                break;

            case "D": case "DROP":
                this.drop()
                break

            case "T": case "TAKE":
                this.take()
                break

            case "U": case "USE":
                this.use()
                break

            case "V": case "VOCABULARY":
                this.vocabulary()
                break

            case "G": case "GOSSIPS":
                this.gossips()
                break

            default:
                console.log("invalid command");
                this.setTempMsg("Try another word or V for vocabulary")
        }
    },
    input: null,
    move: function (direction) {
        console.log("moving: " + direction);
        if (map.currentLocation().id == "42" && direction == "W" & !map.dragonDead) { //trying to go to 41 with dragon alive
            console.log("cant - special trigger");
            document.getElementById("consoleIn").disabled = true
            document.getElementById("consoleIn").style.display = "none"
            document.getElementById("consoleOut").innerText = "You can't go that way..."
            setTimeout(() => {
                document.getElementById("consoleOut").innerText = "The dragon sleeps in a cave!"
                setTimeout(() => {
                    document.getElementById("consoleOut").innerText = "What now?"
                    document.getElementById("consoleIn").disabled = false
                    document.getElementById("consoleIn").style.display = "inline-block"
                    document.getElementById("consoleIn").focus()
                }, 2000)
            }, 2000)
            return
        }
        if (map.currentLocation().wayTarget(direction)) {
            map.position = map.currentLocation().wayTarget(direction)
            document.getElementById("consoleIn").disabled = true
            document.getElementById("consoleIn").style.display = "none"
            var fulldirection;
            switch (direction) {
                case "W":
                    fulldirection = "west"
                    break;
                case "E":
                    fulldirection = "east"
                    break;
                case "N":
                    fulldirection = "north"
                    break;
                case "S":
                    fulldirection = "south"
                    break;
            }
            document.getElementById("consoleOut").innerText = `You are going ${fulldirection}`
            setTimeout(() => {
                document.getElementById("consoleOut").innerText = "What now?"
                document.getElementById("consoleIn").disabled = false
                document.getElementById("consoleIn").style.display = "inline-block"
                document.getElementById("consoleIn").focus()
                this.display()
            }, 300)
        }
        else {
            console.log("cant");
            this.setTempMsg("You can't go that way!")
        }
    },
    display: () => {
        let location = map.position
        console.log(`displaying location ${location}`);
        document.getElementById("image").src = "./img/" + map.locations[location].img
        document.getElementById("image").style.backgroundColor = map.locations[location].color
        document.getElementById("label").innerText = map.locations[location].label
        let display = document.getElementById("display")
        display.innerText = "You can go " + map.locations[location].avlDirections + "\n"
        display.innerText += "You see " + (map.locations[location].avlItems ? map.locations[location].avlItems : "nothing") + "\n"
        display.innerText += "You are carrying " + (map.items[map.carry] ? map.items[map.carry].displayName : "nothing")
        gameConsole.compass.render()
    },
    compass: {
        coverN: null,
        coverS: null,
        coverE: null,
        coverW: null,
        render: () => {
            let location = map.position
            if (map.locations[location].ways.includes("N")) {
                this.coverN.style.display = "none"
            }
            else {
                this.coverN.style.display = "block"
            }
            if (map.locations[location].ways.includes("S")) {
                this.coverS.style.display = "none"
            }
            else {
                this.coverS.style.display = "block"
            }
            if (map.locations[location].ways.includes("E")) {
                this.coverE.style.display = "none"
            }
            else {
                this.coverE.style.display = "block"
            }
            if (map.locations[location].ways.includes("W")) {
                this.coverW.style.display = "none"
            }
            else {
                this.coverW.style.display = "block"
            }
        }
    },
    drop: function () {
        if (map.carry) {
            var itemName = gameConsole.input.split(" ")[1]
            if (map.items[map.carry].name == itemName) {
                if (map.currentLocation().interactiveItemsCount < 3) {
                    console.log("success");
                    map.currentLocation().items.push(map.carry)
                    map.carry = null
                    this.display()
                    this.setTempMsg(`You are about to drop ${itemName}`)
                }
                else {
                    console.log("to many items on location");
                    this.setTempMsg(`You can't store any more here`)
                }
            }
            else {
                console.log("wrong item");
                this.setTempMsg(`You are not carrying it`)
            }
        }
        else {
            console.log("not carrying anythng");
        }
    },
    take: function () {
        if (map.carry != null) {
            console.log("already carrying sth");
            gameConsole.setTempMsg("You are already carrying something!")
            return
        }
        var itemName = this.input.split(" ")[1];
        console.log("picking up " + itemName);
        var id = (Object.values(map.items).find(el => el.name == itemName) ? Object.values(map.items).find(el => el.name == itemName).id : false)
        if (id) {
            //prawidlowa nazwa przedmiotu
            console.log(map.currentLocation().items);
            console.log(id);
            if (!map.currentLocation().items) {
                console.log("brak przedmiotow w lokacji");
                gameConsole.setTempMsg("There isn't anything like that here")
            }
            else if (map.currentLocation().items.includes(id)) {
                console.log("jest w lokacji");
                if (Object.values(map.items).find(el => el.name == itemName).flag) {
                    console.log("flaga ok");
                    map.currentLocation().items.splice(map.currentLocation().items.indexOf(id), 1)
                    map.carry = id
                    this.display()
                    gameConsole.setTempMsg(`You are taking ${itemName}`)
                }
                else {
                    console.log("flaga be");
                    gameConsole.setTempMsg("You can't carry it")
                }
            }
            else {
                console.error("zla lokacja");
            }
        }
        else {
            console.log("wrong item name");
            gameConsole.setTempMsg("There isn't anything like that here")
        }
    },
    use: function () {
        var itemName = gameConsole.input.split(" ")[1]
        var itemCarry = map.items[map.carry]
        if (itemCarry) {
            if (itemName == itemCarry.name) {
                map.items[map.carry].use()
                console.log("success");
            }
            else {
                console.log("not carrying that item");
                gameConsole.setTempMsg("You aren't carrying anything like that")
            }
        }
        else {
            console.log("not carrying anything");
            gameConsole.setTempMsg("You aren't carrying anything like that")
        }

    },
    setTempMsg: msg => {
        document.getElementById("consoleIn").disabled = true
        document.getElementById("consoleIn").style.display = "none"
        document.getElementById("consoleOut").innerText = msg
        setTimeout(() => {
            document.getElementById("consoleOut").innerText = "What now?"
            document.getElementById("consoleIn").disabled = false
            document.getElementById("consoleIn").style.display = "inline-block"
            document.getElementById("consoleIn").focus()
        }, 2000)
    },
    vocabulary: function () {
        let display = document.getElementById("display")
        display.innerText = "NORTH or N, SOUTH or S \n"
        display.innerText += "WEST or W, EAST or E \n"
        display.innerText += "TAKE (object) or T (object) \n"
        display.innerText += "DROP (object) or D (object) \n"
        display.innerText += "USE (object) or U (object) \n"
        display.innerText += "GOSSIPS or G, VOCABULARY or V \n"

        var consoleIn = document.getElementById("consoleIn")
        consoleIn.disabled = true
        consoleIn.style.display = "none"
        document.getElementById("consoleOut").innerText = "Press any key"

        var listener = document.addEventListener("keypress", e => {
            document.getElementById("consoleOut").innerText = "What now?"
            consoleIn.style.display = "inline-block"
            consoleIn.focus()
            document.removeEventListener("keypress", listener)
            gameConsole.display()
            setTimeout(() => {
                consoleIn.disabled = false
            }, 100)
        })
    },
    gossips: function () {
        let display = document.getElementById("display")
        display.innerText = "The  woodcutter lost  his home key..."
        display.innerText += " The butcher likes fruit... The cooper"
        display.innerText += " is greedy... Dratewka plans to make a"
        display.innerText += " poisoned  bait for the dragon...  The"
        display.innerText += " tavern owner is buying food  from the"
        display.innerText += " pickers... Making a rag from a bag..."

        var consoleIn = document.getElementById("consoleIn")
        consoleIn.disabled = true
        consoleIn.style.display = "none"
        document.getElementById("consoleOut").innerText = "Press any key"

        var listener = document.addEventListener("keypress", e => {
            document.getElementById("consoleOut").innerText = "What now?"
            consoleIn.style.display = "inline-block"
            consoleIn.focus()
            document.removeEventListener("keypress", listener)
            gameConsole.display()
            setTimeout(() => {
                consoleIn.disabled = false
            }, 100)
        })
    },
}

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

var map = {
    progress: 0,
    dragonDead: false,
    position: 47, //start position
    carry: null,
    locations: {
        //WIERSZ 1
        11: new Location(`11`, "You are inside a brimstone mine", "11.gif", "rgb(235,211,64)", ["E"]),
        12: new Location(`12`, "You are at the entrance to the mine", "12.gif", "rgb(89,93,87)", ["W", "E"]),
        13: new Location(`13`, "A hill", "13.gif", "rgb(117,237,243)", ["S", "W", "E"], [`31`]),
        14: new Location(`14`, "Some bushes", "14.gif", "rgb(202,230,51)", ["W", "E"]),
        15: new Location(`15`, "An old deserted hut", "15.gif", "rgb(220,204,61)", ["W", "E"], [`27`]),
        16: new Location(`16`, "The edge of a forest", "16.gif", "rgb(167,245,63)", ["W", "E"]),
        17: new Location(`17`, "A dark forest", "17.gif", "rgb(140,253,99)", ["S", "W"], [`14`]),

        //WIERSZ 2
        21: new Location(`21`, "A man nearby making tar", "21.gif", "rgb(255,190,99)", ["S", "E"]),
        22: new Location(`22`, "A timber yard", "22.gif", "rgb(255,190,99)", ["S", "W", "E"]),
        23: new Location(`23`, "You are by a roadside shrine", "23.gif", "rgb(167,245,63)", ["N", "S", "W", "E"], ["10"]),
        24: new Location(`24`, "You are by a small chapel", "24.gif", "rgb(212,229,36)", ["W", "E"]),
        25: new Location(`25`, "You are on a road leading to a wood", "25.gif", "rgb(167,245,63)", ["S", "W", "E"]),
        26: new Location(`26`, "You are in a forest", "26 i 65.gif", "rgb(167,245,63)", ["W", "E"]),
        27: new Location(`27`, "You are in a deep forest", "27 i 67.gif", "rgb(140,253,99)", ["N", "W"], [`18`]),

        //WIERSZ 3
        31: new Location(`31`, `You are by the Vistula River`, `31.gif`, `rgb(122,232,252)`, ["N", "E"]),
        32: new Location(`32`, `You are by the Vistula River`, `32.gif`, `rgb(140,214,255)`, ["N", "W"], [`32`]),
        33: new Location(`33`, `You are on a bridge over river`, `33.gif`, `rgb(108,181,242)`, ["N", "S"]),
        34: new Location(`34`, `You are by the old tavern`, `34.gif`, `rgb(255,189,117)`, ["E"]),
        35: new Location(`35`, `You are at the town's end`, `35.gif`, `rgb(255,190,99)`, ["N", "S", "W"]),
        36: new Location(`36`, `You are in a butcher's shop`, `36.gif`, `rgb(255,188,102)`, ["S"]),
        37: new Location(`37`, `You are in a cooper's house`, `37.gif`, `rgb(255,188,102)`, ["S"]),

        //WIERSZ 4
        41: new Location(`41`, `You are in the Wawel Castle`, `41.gif`, `rgb(255,176,141)`, ["E"]),
        42: new Location(`42`, `You are inside a dragon's cave`, `42.gif`, `rgb(198,205,193)`, ["E"]),
        43: new Location(`43`, `A perfect place to set a trap`, `43.gif`, `rgb(255,176,141)`, ["N", "W"]),
        44: new Location(`44`, `You are by the water mill`, `44.gif`, `rgb(255,190,99)`, ["E"], [`21`]),
        45: new Location(`45`, `You are at a main crossroad`, `45.gif`, `rgb(255,190,99)`, ["N", "S", "W", "E"]),
        46: new Location(`46`, `You are on a town street`, `46.gif`, `rgb(255,190,99)`, ["N", "W", "E"]),
        47: new Location(`47`, `You are in a frontyard of your house`, `47.gif`, `rgb(255,190,99)`, ["N", "S", "W"]),

        //WIERSZ 5
        54: new Location(`54`, `You are by a swift stream`, `54.gif`, `rgb(108,181,242)`, ["E"]),
        55: new Location(`55`, `You are on a street leading forest`, `55.gif`, `rgb(255,190,99)`, ["N", "S", "W"], [`33`]),
        56: new Location(`56`, `You are in a woodcutter's backyard`, `56.gif`, `rgb(255,190,99)`, ["S"]),
        57: new Location(`57`, `You are in a shoemaker's house`, `57.gif`, `rgb(254,194,97)`, ["N"]),

        //WIERSZ 6
        64: new Location(`64`, `You are in a bleak funeral house`, `64.gif`, `rgb(254,194,97)`, ["E"], [`24`]),
        65: new Location(`65`, `You are on a path leading to the wood`, `26 i 65.gif`, `rgb(167,245,63)`, ["N", "W", "E"]),
        66: new Location(`66`, `You are at the edge of a forest`, `66.gif`, `rgb(167,245,63)`, ["N", "W", "E"]),
        67: new Location(`67`, `You are in a deep forest`, `27 i 67.gif`, `rgb(140,253,99)`, ["W"]),
    },
    currentLocation() {
        return this.locations[this.position]
    },
    items: {
        10: new Item(`10`, "a KEY", 1, "KEY", "56"),
        11: new Item(`11`, "an AXE", 1, "AXE", `67`),
        12: new Item(`12`, `STICKS`, 1, `STICKS`, `43`),
        13: new Item(`13`, `sheeplegs`, 0, `sheeplegs`),
        14: new Item(`14`, `MUSHROOMS`, 1, `MUSHROOMS`, `34`),
        15: new Item(`15`, `MONEY`, 1, `MONEY`, `37`),
        16: new Item(`16`, `a BARREL`, 1, `BARREL`, `43`),
        17: new Item(`17`, `a sheeptrunk`, 0, `sheeptrunk`),
        18: new Item(`18`, `BERRIES`, 1, `BERRIES`, `36`),
        19: new Item(`19`, `WOOL`, 1, `WOOL`, `43`),
        20: new Item(`20`, `a sheepskin`, 0, `sheepskin`),
        21: new Item(`21`, `a BAG`, 1, `BAG`, `57`),
        22: new Item(`22`, `a RAG`, 1, `RAG`, `43`),
        23: new Item(`23`, `a sheephead`, 0, `sheephead`),
        24: new Item(`24`, `a SPADE`, 1, `SPADE`, `11`),
        25: new Item(`25`, `SULPHUR`, 1, `SULPHUR`, `43`),
        26: new Item(`26`, `a solid poison`, 0, `solid poison`),
        27: new Item(`27`, `a BUCKET`, 1, `BUCKET`, `21`),
        28: new Item(`28`, `TAR`, 1, `TAR`, `43`),
        29: new Item(`29`, `a liquid poison`, 0, `liquid poison`),
        30: new Item(`30`, `a dead dragon`, 0, `dead dragon`),
        31: new Item(`31`, `a STONE`, 1, `STONE`),
        32: new Item(`32`, `a FISH`, 1, `FISH`),
        33: new Item(`33`, `a KNIFE`, 1, `KNIFE`, `43`),
        34: new Item(`34`, `a DRAGONSKIN`, 1, `DRAGONSKIN`, `57`),
        35: new Item(`35`, `a dragonskin SHOES`, 1, `SHOES`, `41`),
        36: new Item(`36`, `a PRIZE`, 1, `PRIZE`, true),
        37: new Item(`37`, `a SHEEP`, 1, `SHEEP`, `43`),
    },
    interactions: {
        "10": () => {
            console.log("You opened a tool shed and took an axe");
            map.carry = "11"
            gameConsole.display()
            gameConsole.setTempMsg("You opened a tool shed and took an axe")
        },
        "11": () => {
            console.log("You cut sticks for sheeplegs");
            map.carry = "12"
            gameConsole.display()
            gameConsole.setTempMsg("You cut sticks for sheeplegs")
        },
        "12": () => {
            console.log("You prepared legs for your fake sheep");
            map.currentLocation().items.push("13")
            gameConsole.display()
            gameConsole.setTempMsg("You prepared legs for your fake sheep")
            map.progress++
            map.checkProgress()
        },
        "14": () => {
            console.log("The tavern owner paid you money");
            map.carry = "15"
            gameConsole.display()
            gameConsole.setTempMsg("The tavern owner paid you money")
        },
        "15": () => {
            console.log("The cooper sold you a new barrel");
            map.carry = "16"
            gameConsole.display()
            gameConsole.setTempMsg("The cooper sold you a new barrel")
        },
        "16": () => {
            console.log("You made a nice sheeptrunk");
            map.currentLocation().items.push("17")
            gameConsole.display()
            gameConsole.setTempMsg("You made a nice sheeptrunk")
            map.progress++
            map.checkProgress()
        },
        "18": () => {
            console.log("The butcher gave you wool");
            map.carry = "19"
            gameConsole.display()
            gameConsole.setTempMsg("The butcher gave you wool")
        },
        "19": () => {
            console.log("You prepared skin for your fake sheep");
            map.currentLocation().items.push("20")
            gameConsole.display()
            gameConsole.setTempMsg("You prepared skin for your fake sheep")
            map.progress++
            map.checkProgress()
        },
        "21": () => {
            console.log("You used your tools to make a rag");
            map.carry = "22"
            gameConsole.display()
            gameConsole.setTempMsg("You used your tools to make a rag")
        },
        "22": () => {
            console.log("You made a fake sheephead");
            map.currentLocation().items.push("23")
            gameConsole.display()
            gameConsole.setTempMsg("You made a fake sheephead")
            map.progress++
            map.checkProgress()
        },
        "24": () => {
            console.log("You are digging...");
            document.getElementById("consoleIn").disabled = true
            document.getElementById("consoleIn").style.display = "none"
            document.getElementById("consoleOut").innerText = "You are digging..."
            setTimeout(() => {
                document.getElementById("consoleOut").innerText = "and digging..."
                setTimeout(() => {
                    document.getElementById("consoleOut").innerText = "That's enough sulphur for you"
                    setTimeout(() => {
                        document.getElementById("consoleOut").innerText = "What now?"
                        document.getElementById("consoleIn").disabled = false
                        document.getElementById("consoleIn").style.display = "inline-block"
                        document.getElementById("consoleIn").focus()
                        map.carry = "25"
                        gameConsole.display()
                    }, 2000)
                }, 2000)
            }, 2000)
        },
        "25": () => {
            console.log("You prepared a solid poison");
            map.currentLocation().items.push("26")
            gameConsole.display()
            gameConsole.setTempMsg("You prepared a solid poison")
            map.progress++
            map.checkProgress()
        },
        "27": () => {
            console.log("You got a bucket full of tar");
            map.carry = "28"
            gameConsole.display()
            gameConsole.setTempMsg("You got a bucket full of tar")
        },
        "28": () => {
            console.log("You prepared a liquid poison");
            map.currentLocation().items.push("29")
            gameConsole.display()
            gameConsole.setTempMsg("You prepared a liquid poison")
            map.progress++
            map.checkProgress()
        },
        "37": () => { //dragone xDD
            console.log("used sheep");
            gameConsole.display()
            document.getElementById("consoleIn").disabled = true
            document.getElementById("consoleIn").style.display = "none"
            document.getElementById("consoleOut").innerText = "The dragon noticed your gift..."
            setTimeout(() => {
                document.getElementById("consoleOut").innerText = "The dragon ate your sheep and died!"
                map.dragonDead = true;
                map.currentLocation().img = "DS68.bmp"
                map.locations["42"].ways.push("W")
                map.currentLocation().items.push(30)
                gameConsole.display()
                setTimeout(() => {
                    document.getElementById("consoleOut").innerText = "What now?"
                    document.getElementById("consoleIn").disabled = false
                    document.getElementById("consoleIn").style.display = "inline-block"
                    document.getElementById("consoleIn").focus()
                }, 2000)
            }, 2000)
        },
        "33": () => {
            if (map.dragonDead) {
                console.log("You cut a piece of dragon's skin");
                map.carry = "34"
                gameConsole.display()
                gameConsole.setTempMsg("You cut a piece of dragon's skin")
            }
            else {
                console.log("dragon not dead - returning knife");
                map.carry = "33"
                gameConsole.display()
                gameConsole.setTempMsg("Nothing happened")
            }
        },
        "34": () => {
            console.log("You used your tools to make shoes");
            map.carry = "35"
            gameConsole.display()
            gameConsole.setTempMsg("You used your tools to make shoes")
        },
        "35": () => {
            console.log("The King is impressed by your shoes");
            map.carry = "36"
            gameConsole.display()
            gameConsole.setTempMsg("The King is impressed by your shoes")
        },
        "36": () => {
            document.body.innerHTML = ""
            var img = new Image()
            img.src = "./img/end.jpg"
            img.classList.add("center")
            document.body.appendChild(img)
        }
    },
    checkProgress() {
        if (this.progress == 6) {
            console.log("ship done");
            map.currentLocation().items = map.currentLocation().items.filter(x => x != "29" && x != "26" && x != "23" && x != "20" && x != "17" && x != "13")
            map.carry = "37"
            gameConsole.display()
            gameConsole.setTempMsg("Your fake sheep is full of poison and ready to be eaten by the dragon")
        }
        else {
            console.log("ship not done yet");
        }
    }
}

function start() {
    document.body.innerHTML = ""
    var overlay = new Image()
    overlay.id = "overlay"
    overlay.src = "./img/start.jpg"
    document.body.appendChild(overlay)

    var audioDIV = document.createElement("div");
    audioDIV.id = "audioDIV"
    document.body.appendChild(audioDIV)
    audioDIV.innerHTML = `<audio controls id='audio'><source src="./files/hejnal.mp3" type="audio/mpeg"></audio>`


    document.getElementById("audio").play().catch(err => {
        window.alert("Autoplay of sound was prevented by browser\nYou can play sound with manual control")
        audioDIV.id = ""
    })

    document.getElementById("audio").addEventListener("ended", next)
    document.addEventListener("keypress", next)
    document.addEventListener("click", next)
    var i = 0
    function next() {
        if (i == 0) {
            document.getElementById("audio").removeEventListener("ended", next)
            document.getElementById("audio").pause()
            audioDIV.remove()
            overlay.src = "./img/opis_A.jpg"
            i++;
        }
        else if (i == 1) {
            overlay.src = "./img/opis_B.jpg"
            i++
        }
        else {
            document.removeEventListener("keypress", next)
            document.removeEventListener("click", next)
            overlay.remove()
            setTimeout(loadPage, 100)
        }
    }
}

function loadPage() {
    document.body.innerHTML = "" //reset strony

    //root
    var root = document.createElement("div")
    root.id = "root"
    document.body.appendChild(root)

    var label = document.createElement("div")
    label.id = "label"
    label.innerText = "You are useless"
    root.appendChild(label)

    var img = new Image()
    img.id = "image"
    img.src = "./img/placeholder.png"
    root.appendChild(img)

    var compassObj = new Image()
    compassObj.id = "compass"
    compassObj.src = "./img/kompas.bmp"
    root.appendChild(compassObj)

    var displayGo = document.createElement("div")
    displayGo.id = "display"
    displayGo.innerText = "You can go KYS"
    root.appendChild(displayGo)

    var gameConsoleA = document.createElement("div")
    gameConsoleA.id = "gameConsole"
    root.appendChild(gameConsoleA)

    var consoleOut = document.createElement("div")
    consoleOut.id = "consoleOut"
    consoleOut.innerText = "What now? "
    gameConsoleA.appendChild(consoleOut)

    var input = document.createElement("input")
    input.type = "text"
    input.id = "consoleIn"
    input.onblur = () => input.focus()
    gameConsoleA.appendChild(input)
    input.focus()
    input.addEventListener("keyup", function () {
        if (event.keyCode === 13) {
            gameConsole.inputInterpreter()
        }
    })

    //#region compass display
    gameConsole.compass.coverN = document.createElement("div")
    gameConsole.compass.coverN.id = "coverN"
    gameConsole.compass.coverN.classList.add("compassCover")
    root.appendChild(gameConsole.compass.coverN)

    gameConsole.compass.coverS = document.createElement("div")
    gameConsole.compass.coverS.id = "coverS"
    gameConsole.compass.coverS.classList.add("compassCover")
    root.appendChild(gameConsole.compass.coverS)

    gameConsole.compass.coverE = document.createElement("div")
    gameConsole.compass.coverE.id = "coverE"
    gameConsole.compass.coverE.classList.add("compassCover")
    root.appendChild(gameConsole.compass.coverE)

    gameConsole.compass.coverW = document.createElement("div")
    gameConsole.compass.coverW.id = "coverW"
    gameConsole.compass.coverW.classList.add("compassCover")
    root.appendChild(gameConsole.compass.coverW)

    //#endregion


    document.body.onclick = (e) => {
        if (e.altKey) {
            gameConsole.cheats = !gameConsole.cheats
            console.log("cheats are now " + gameConsole.cheats);
        }
    }

    //display first location
    gameConsole.display()
}
document.addEventListener("DOMContentLoaded", start)


//e.getModifierState("Capslock")
