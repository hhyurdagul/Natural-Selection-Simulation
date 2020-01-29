class DNA{
    constructor(gender, fitness=-100, location=-100){
        this.fitness;
        this.reproduction;
        this.calcFitness(fitness);
        this.gender = gender;        
        this.fenotype = new Fenotype(this.gender,this.fitness, location);
        this.partner;
    }
    calcFitness(fitness){
        if(fitness < 0){
            this.fitness = Math.floor(random(0,511));
        }
        else{
            this.fitness = fitness;
        }
        this.reproduction = map(this.fitness, 510, 0, 0,1, true);
        
    }
    crossover(node){
        let averageReproduction = random((this.reproduction+node.reproduction)*(4/10), (this.reproduction+node.reproduction)*(6/10));
        averageReproduction = constrain(averageReproduction, 0, 1);
        let newFitness = random((this.fitness+node.fitness)*(5/10), (this.fitness+node.fitness)*(7/10));
        newFitness = constrain(newFitness, 0, 510);
        let childs = [];
        let rand;
        let genders = ["m", "f"];
        for(let i = 0; i<4; i++){
            rand = random();
            if(averageReproduction > rand){
                childs.push(new DNA(genders[Math.floor(Math.random()*2)], newFitness, this.fenotype.location));
            }
        } 
        return childs;
    }
}

class Fenotype{
    constructor(gender, beauty, location){
        this.gender = gender;
        this.velocity = new p5.Vector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.acceleration = new p5.Vector(0,0);
        this.r = 20;
        this.maxspeed = 2;
        this.maxforce = 0.15;
        if(location < 0){
            if(this.gender == "m"){
                this.location = new p5.Vector(random(this.r/2, width-this.r/2), this.r*2);
            }else{
                this.location = new p5.Vector(random(this.r/2, width-this.r/2), height-this.r*2);
            }
        }
        else{
            this.location = location.copy();
        }
        
        this.beauty = beauty;
    }

    applyBehaviors(vehicles, target){
        let seekForce = this.seek(target);
        let seperateForce = this.seperate(vehicles);
        
        seekForce.mult(1);
        seperateForce.mult(2);
        this.applyForce(seperateForce);
        this.applyForce(seekForce);
    }


    applyForce(force){
        this.acceleration.add(force);
    }

    seek(target){
        let desired = new p5.Vector.sub(target.location, this.location);
        let d = desired.mag();
        if(d < this.r*2){
            let m = map(d, 0, this.r*2, 0, this.maxspeed);
            desired.setMag(m);
        }else{
            desired.setMag(this.maxspeed);
        }
        let steer = new p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
    }

    seperate(vehicles){
        let desiredSeperation = this.r * (3/2);
        let sum = createVector();
        let count = 0;
        
        for(let i = 0; i < vehicles.length; i++){
            let d = p5.Vector.dist(this.location, vehicles[i].location);
            if((d > 0) && (d < desiredSeperation)){
                let diff = p5.Vector.sub(this.location, vehicles[i].location);
                diff.normalize();
                diff.div(d);
                sum.add(diff);
                count++;
            }
        }
        
        if(count > 0){
            sum.div(count);
            sum.setMag(this.maxspeed);
            
            let steer = p5.Vector.sub(sum, this.velocity);
            steer.limit(this.maxforce);
            steer.mult(2);
            this.applyForce(steer);
        }
        return sum;
    }

    update(){
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    display(){
        if(this.gender == "m") fill(0, 0, 255, this.beauty/2); 
        else                   fill(255, 0, 0, this.beauty/2);
        ellipse(this.location.x, this.location.y, this.r, this.r);
    }

    boundaries(){
        let desired;
        let d = 20;
        if(this.location.x < d){
            desired = new p5.Vector(this.maxspeed, this.velocity.y);
        }
        else if(this.location.x > width-d){
            desired = new p5.Vector(-this.maxspeed, this.velocity.y);
        }
        else if(this.location.y < d){
            desired = new p5.Vector(this.velocity.x, this.maxspeed);
        }
        else if(this.location.y > height-d){
            desired = new p5.Vector(this.velocity.x, -this.maxspeed);
        }
        if(desired){
            desired.setMag(this.maxspeed);
            let steer = new p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
}