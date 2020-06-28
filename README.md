This probably already exists, but i didn't find it, and... i was bored

Uses Scryfall's api

## Usage
Type one card per line, should work in any language

After the card name put a number (or not it will use 1), and if the card is already in english (and you want just to make a easy list in the common mtg style) just put a `/` in front of the number

`input.txt`
```
Campo de Lótus 3
Arahbo, Roar of the World /1
Princess 5
```

run `npm i` to install the dependencies
run `npm i ts-node` if you dont have it global
then run `npm start` after filling the list

## Result

The result will use the common mtg style (*Not MTG Arena style*), most sites should accept it.

When it finds more than one card it will sepparate them with `|` not to get confused with `\\` or `//` since those are used for flip/double cards

`res.txt`
```
3 Lotus Field
1 Arahbo, Roar of the World
5 Beloved Princess | Princess Lucrezia
```
