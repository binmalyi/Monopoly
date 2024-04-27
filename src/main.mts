"use strict";

function Rnd (){ return +crypto.getRandomValues(new Uint8Array(1))/255 };

const
    Airports=Object.freeze(["JLN","JKA","EBB","KGL"] as const),
    Utilities=Object.freeze(["Electric","Gas","Water"] as const),
    Community=Object.freeze(["Treasure","Surprise","Jail","Go","Vacation","Luxury Tax","Income Tax"] as const),
    Estates=Object.freeze({
        Salvador:60,
        Rio:60,
        "Tel Aviv":100,
        Haifa:100,
        Jerusalem:110,
        Delhi:120,
        Mumbai:130
    } as const);

type Airport = typeof Airports[number];
type Utility = typeof Utilities[number];
type Estate = keyof typeof Estates;
type Deed = Airport|Utility|Estate;
type Community = typeof Community[number];
type Board = Deed|Community;

const Properties: Array<InstanceType<typeof Property>> = [...Object.keys(Estates) as Array<Estate>,...Airports,...Utilities].map(key => new Property(key));

class Property {
    public owner: Player | null = null;
    public mortgaged: boolean = false;
    public name: Deed;
    public get Type(){ return Airports.some(prop => prop === this.name) ? "Airport" : (Utilities.some(utility => utility === this.name) ? "Utility" : "Estate") };
    public get Price(){ return this.Type === "Airport" ? 200 : (this.Type === "Utility" ? 150 : Estates[this.name as Estate]) };
    public mortgage(){
        if (!this.owner) throw Error(`${this.name} is not owned`);
        else if (this.mortgaged) throw new Error(`${this.name} is already mortgaged`);
        else (this.owner.cash += this.Price * .5, this.mortgaged = !this.mortgaged);
    };
    public sell(){
        if (!this.owner) throw Error(`${this.name} is not owned`);
        else if (!this.mortgaged) this.owner.cash += this.Price;
        this.owner = null;
    };

    constructor(name: Deed){
        if (!(name in Estates) && !Airports.some(prop => prop===name) && !Utilities.some(utility => utility===name)) throw new TypeError("Name & Type Incompatibility");
        this.name = name;
    };
};

class Player {
    public name: string;
    public cash!: number;
    public get properties(){ return Properties.filter(property => Object.is(this, property.owner)) };
    public roll(min=1, max=6, random=Rnd){ return ~~(1+(max-min)*random()) + ~~(1+(max-min)*random()) };

    constructor(name: string){
        this.name = name;
    };
};