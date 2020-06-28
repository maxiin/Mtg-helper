const req = require('request-promise');
const fs = require('fs');

const quantityRegex = /[0-9]+/g;
const markersRegex =  / [/]?[0-9]*[ ]*$/gm;

const reqHeaders = {
    encoding: 'utf8',
    json: true,
    headers: {
    'content-type': 'application/json'
    },
}

let res = [];

class Card {
    quantity: string;
    name: string;
    isReady: boolean;
    
    constructor(data: string) {
        this.quantity = this.getQuantity(data);
        this.isReady = !!data.match(/\//);
        this.name = data.replace(markersRegex, '').replace('\r', '').trim();
    }

    private getQuantity(data: string): string {
        const q = data.match(quantityRegex);
        return (q? q[0] : '1');
    }
}

async function search() {
    const res = [];
    const list = getListFromFile();
    for(const index in list) {
        let card = new Card(list[index]);

        updateProgress(Number(index), list.length);

        if(card.isReady) {
            res.push(`${card.quantity} ${card.name}`);
            continue;
        }

        await translate(card.name)
        .then((result) => {
            let translatedCard;
            if(result.total_cards === 1){
                translatedCard = result.data[0].name;
            } else {
                translatedCard = makeCardList(result);
            }
            res.push(`${card.quantity} ${translatedCard}`);
        })
        .catch((e) => {
            res.push(`${card.quantity} ${card.name} Error`);
        })
    }
    
    fs.writeFile('./res.txt', res.join('\n'), (e) => console.error(e));
    console.error("final", res);
}

function getListFromFile(file = 'input.txt'): string[] {
    const fileData = fs.readFileSync(`./${file}`).toString('utf-8');
    return fileData.split("\n");
}

function updateProgress(current: number, max: number) {
    process.stdout.write('Downloading ' + ((current * 100) / max).toFixed(2) + '% complete... \r');
}

function translate(cardName: string): Promise<any> {
    const url = encodeURI(makeUrl(cardName));
    return req.get(url, reqHeaders);
}

function makeUrl(cardName: string): string {
    return `https://api.scryfall.com/cards/search?q="${cardName}"&include_multilingual=true`
}

function makeCardList(res: any): string {
    return res.data.map((d) => d.name).join(' | ');
}

search();
