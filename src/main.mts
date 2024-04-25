"use strict";

const Properties = Object.freeze
({
    Airport:["TLV","JFK","KLM","JLN"],
    Utility:["Electric","Gas","Water"],
    State: {
        Salvador:60,
        Rio:60,
        TelAviv:100,
        Haifa:100,
        Jerusalem:110,
        Delhi:120,
        Mumbai:130
    }
} as const);

type Airport = typeof Properties["Airport"][number];
type Utility = typeof Properties["Utility"][number];
type State = keyof typeof Properties["State"];
type Plot<K> = K extends Airport ? "Airport" : (K extends Utility ? "Utility" : (K extends State ? "State" : never));
type PlotIdentity = Airport|Utility|State;

enum Maps {
    BonVoyage = 4*10,
    Galaxus = 4*9,
    Avendetour = 4*8
};

class Property {
    static mortgaged: boolean = false;
    static get type(): Plot<PlotIdentity> { return Properties["Airport"].includes(this.name as Airport) ? "Airport" : (Properties["Utility"].includes(this.name as Utility) ? "Utility" : "State") };
    static get price(){
        const value = this.type === "Airport" ? 200 : (this.type === "Utility" ? 150 : Properties[this.type][this.name as State]);
        return !this.mortgaged ? value : .5 * value;
    };
};

const
    Airports = Object.values(Properties["Airport"]),
    Utilities = Object.values(Properties["Utility"]),
    States = Object.keys(Properties["State"]) as (State)[],
    Names = [...Airports,...Utilities,...States],
    Plots: ReadonlyArray<Property> = Object.freeze(Names.map(name => new Function('Properties', `return class ${name} extends ${Property}{};`)(Properties)));

console.log(Plots.map(plot => plot.price));

// function Die (min=1, max=6, random=rand()){ return ~~(1+(max-min)*random) };
// function rand (){ return +crypto.getRandomValues(new Uint8Array(1))/(2**8-1) };