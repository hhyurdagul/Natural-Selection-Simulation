let p;
let time = 0;
let l = true;
let d = false;
let k = false;

function setup() {

    createCanvas(1050, 590);
    p = new Population(100);
}

function draw() {
    background(255);
    simulate(p);
}

function simulate(p) {
    p.display();
    p.seekPartner();
    time++;
    if(time >= 300){
        p.generate();
        p.naturalSelection();
        time = 0;
    }
    if(p.generations >= 50){
        noLoop();
    }
    if(d){
        displayInfo(p);
    }
}

function keyPressed() {
    switch (key) {
        case " ":
            l = !l;
            L(l);
            break;
        case "d":
            d = !d;
            k = !k;
            a(k);
            break;
        default:
            break;
    }
    
}

function a(k){
    if(k){
        bestMan = createP("Most handsome Man:");
        bestMan.class("best");
        bestWoman = createP("Most beautiful Woman:");
        bestWoman.class("best");
        bestMan.position(50,10);
        bestWoman.position(50,70);
        stats = createP("Stats");
        stats.class("stats");
        stats.position(50, 130);
    }else{
        bestMan.hide();
        bestWoman.hide();
        stats.hide();
    }
    
}

function L(l) {
    if(l){
        loop();
    }else{
        noLoop();
    }
}

function displayInfo(p) {
    let M = p.getBestMan();
    let W = p.getBestWoman();
    bestMan.html("Most Handsome Man:<br>" + M.toPrecision(3));
    bestWoman.html("Most Beautiful Woman:<br>" + W.toPrecision(3));

    let statstext = "Total generations:     " + p.generations + "<br>";
    statstext += "Average Beauty:       " + (p.getAverageFitness()).toPrecision(5) + "<br>";
    statstext += "Men population:      " + p.getMensize() + "<br>";
    statstext += "Women population:      " + p.getWomensize() + "<br>";
    
    stats.html(statstext);

}