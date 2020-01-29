class Population{
    constructor(size){
        this.generations = 0; 
        this.men = [];
        this.women = [];
        this.size = size;
        this.manPool = [];
        this.womanPool = [];
        this.mutationRate = 0.01;
        for(let i = 0; i < size; i++){
            this.men[i] = new DNA("m");
            this.women[i] = new DNA("f");
        }
        this.naturalSelection();
    }

    naturalSelection(){
        this.manPool = [...this.men];
        this.womanPool = [...this.women];
        let select = {};
        let childs = [];
        //let indexes = [];
        let selected;
        let index;
        for(let i = 0; i < this.manPool.length; i++){
			let up;
			let down;
			if(this.manPool[i].fitness > 255){
				up = (this.manPool[i].fitness) + (this.manPool[i].fitness*0.2);
				down = (this.manPool[i].fitness) - (this.manPool[i].fitness*0.05); 
			}
			else{
				up = (this.manPool[i].fitness) + (this.manPool[i].fitness*0.05);
				down = (this.manPool[i].fitness) - (this.manPool[i].fitness*0.05); 
			}
            for(let j = 0; j < this.womanPool.length; j++){
                //console.log(this.womanPool[j].fitness);
                if(this.womanPool[j].fitness < up && this.womanPool[j].fitness > down){
                    select[j] = this.womanPool[j];
                }
                //console.log(this.womanPool[j].fitness);
            }
            if(Object.keys(select).length != 0){ 
                //console.log(Object.keys(select).length);
                let r = Math.floor(Math.random()*Object.keys(select).length);
                selected = Object.values(select)[r];
                index = Object.keys(select)[r];
                //console.log(selected);
                //console.log(index);
                //console.log(Object.entries(select)[r]);
                this.manPool[i].partner = selected;
                selected.partner = this.manPool[i];
                
                this.womanPool.splice(index,1);
                select = {};
                //indexes = [];
            }
            //console.log(this.womanPool.length);
            //console.log("new");
        }
        
    }

    seekPartner(){
       for(let i = 0; i < this.men.length; i++){
            if(this.men[i].partner){
                this.men[i].fenotype.seek(this.men[i].partner.fenotype);
                this.men[i].partner.fenotype.seek(this.men[i].fenotype);
            }
        }
    }

    generate(){
        let childs = [];
        let newMen  = [];
        let newWomen  = [];
        for(let i = 0; i < this.men.length; i++){
            if(this.men[i].partner){
                childs = this.men[i].crossover(this.men[i].partner);
                
                if(childs.length > 0){
                    for(let j = 0; j < childs.length; j++){
                        if(childs[j].gender == 'm'){
                            newMen.push(childs[j]);
                        }
                        else if(childs[j].gender == 'f'){
                            newWomen.push(childs[j]);
                        }
                    }
                }
            }
		}

        this.men = [...newMen];
        this.women = [...newWomen];
        this.generations++;
    }

    getAverageMenFitness(){
        let total = 0;
        for(let i = 0; i < this.men.length; i++){
            total += this.men[i].fitness;
        }
        return total/(this.men.length);
    }

    getAverageWomenFitness(){
        let total = 0;
        for(let i = 0; i < this.women.length; i++){
            total += this.women[i].fitness;
        }
        return total/(this.women.length);
    }

    getAverageFitness(){
        let b = this.getAverageMenFitness();
		let a = this.getAverageWomenFitness();
		return (a+b)/2;
	}
	
	getBestMan(){
		let best = 0;
		for(let i = 0; i < this.men.length; i++){
			if(best < this.men[i].fitness){
				best = this.men[i].fitness;
			}
		}
		return best;
	}

	getBestWoman(){
		let best = 0;
		for(let i = 0; i < this.women.length; i++){
			if(best < this.women[i].fitness){
				best = this.women[i].fitness;
			}
		}
		return best;
	}

	getMensize(){
		return this.men.length;
	}

	getWomensize(){
		return this.women.length;
	}

    getAll(){
        let all = [];
        for(let i = 0; i < this.men.length; i++){
            all.push(this.men[i].fenotype);
        }
        for(let j = 0; j < this.women.length; j++){
            all.push(this.women[j].fenotype);
        }
        return all;
    }

    display(){
        for(let i = 0; i < this.men.length; i++){
            this.men[i].fenotype.update();
            this.men[i].fenotype.boundaries();
            this.men[i].fenotype.seperate(this.getAll());
            this.men[i].fenotype.display();
        }
        for(let j = 0; j < this.women.length; j++){
            this.women[j].fenotype.update();
            this.women[j].fenotype.boundaries();
            this.women[j].fenotype.seperate(this.getAll());
            this.women[j].fenotype.display();
        }
    }
}

