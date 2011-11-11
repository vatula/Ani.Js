Ani.AniSequence = function(){
    this.steps = [];
    this.addParallelAnisCollector = [];
    this.addParallel = false;
    this.isPlaying = false;
    this.isEnded = false;
    this.currentStep = 0;
    this.durationTotal = 0.0;
    this.time = 0.0;

    /**
     * No need to call ever this method. Only public to use the registerPre() mechanism
     */
    this.pre = function(){
        if (this.isPlaying){
            update.call(this);
        }
    };

    var update = function(){
        if (this.steps.length > 0){
            var tmpStep = this.steps[this.currentStep];
            if (tmpStep.isFinished() && this.currentStep < this.steps.length-1){
                this.currentStep++;
                var nextStep = this.steps[this.currentStep];
                nextStep.start();
                tmpStep = nextStep;
            } else if (this.currentStep === this.steps.length-1){
                this.isEnded = tmpStep.isFinished();
            }

            this.time = tmpStep.startTime + tmpStep.getTime();
        }
    };

    /**
     * Seek the sequence to any position: start = 0.0 end = 1.0
	 *
	 * @param theValue seek value: 0.0 - 1.0
	 */
    this.seek = function(val){
        this.isEnded = false;
        // clamp between 0 and 1
        val = Math.min(1.0, Math.max(0.0, val));
        this.time = val*this.durationTotal;
        // find step corresponding to seek value
        for(var i=this.steps.length-1; i >= 0; --i){
            var tmpStep = this.steps[i];
            if (this.time >= tmpStep.startTime && this.time < tmpStep.endTime){
                this.currentStep = i;
                break;
            }
        }

        // bring all variables back to their starting points
        // and seek current step
        for (var j=this.steps.length-1; j >= this.currentStep; --j) {
            var jStep = this.steps[j];
            if (j === this.currentStep){
                var stepSeekTime = this.time - jStep.startTime,
                    stepSeekValue = Ani.Util.map(stepSeekTime, 0.0, jStep.duration, 0.0, 1.0);
                jStep.seek(stepSeekValue);
                break;
            } else {
                jStep.seekAll(0.0);
            }
        }
    };

    /**
     * Adds a single Ani to the sequence
	 *
	 * @param anis
	 */
    this.add = function(anis){
        if (anis && (anis.constructor === Array)){
            if (!this.addParallel){
                this.beginStep();
                for(var a in anis){
                    this.add(anis[a]);
                }
                this.endStep();
            } else { // beginParallel() was called before, so add insertParallelAnisCollector
                for(var pa in anis){
                    this.add(anis[pa]);
                }
            }
        } else if (anis && anis.constructor === Ani.Animation){
            var ani = anis;
            if (this.addParallel){
                this.addParallelAnisCollector.push(ani);
            } else {
                var s = this.getStep(ani);
                this.steps.push(s);
            }
        }
    };

    /**
     * Begin a new step, everything after until endStep() is called is treated as a single step
	 */
    this.beginStep = function(){
        this.addParallelAnisCollector = [];
        this.addParallel = true;
    };

    /**
     * End the step
	 */
    this.endStep = function(){
        var anis = this.addParallelAnisCollector.slice(), // clone array
            step = this.getStep(anis);
        this.steps.push(step);
        this.addParallel = false;
    };

    /**
     * Start the first step of the sequence
	 */
    this.start = function(){
        this.isPlaying = true;
        this.isEnded = false;
        reconstruct.call(this);
        // start the first step
        var step = this.steps[this.currentStep];
        step.start();
    };

    /**
     * Resume the sequence from the current position in time (adjustable with seek)
	 */
    this.resume = function(){
        var step = this.steps[this.currentStep];
        step.play();
        this.isPlaying = true;
        this.isEnded = false;
    };

    /**
     * Pause the sequence at the current position in time
	 */
    this.pause = function(){
        var step = this.steps[this.currentStep];
        step.pause();
        this.isPlaying = false;
    };

    /**
     * Begin sequence
	 */
    this.beginSequence = function(){
        // disable autostart feature of Ani
        Ani.noAutostart();
        Ani.noOverwrite();
    };

    /**
     * End sequence
	 */
    this.endSequence = function(){
        // enable autostart feature of Ani
        Ani.autostart();
        Ani.overwrite();
        reconstruct.call(this);
    };

    // reconstruct all variables back to their origin values (before the sequence was created)
    var reconstruct = function(){
        this.currentStep = 0;

        // calc global durationTotal of all steps
        // set start- and end times to the steps
        this.durationTotal = 0;
        var s, step;

        for(s in this.steps){
            step = this.steps[s];
            step.pause(); // just in case this is a re-start of the whole sequence
            step.startTime = this.durationTotal;
            step.endTime = this.durationTotal+step.duration;
            this.durationTotal += step.duration;
        }
        // bring all variables back to their starting points
        for(var i=this.steps.length-1; i >= 0; --i){
            var istep = this.steps[i];
            istep.seekAll(0.0);
        }
    };

    /**
     * Gets the current seek value (start = 0.0 end = 1.0)
	 *
	 * @return theValue seek value
	 */
    this.getSeek = function(){
        return Math.min(1.0, Math.max(0.0, this.time/this.durationTotal));
    };

    /**
     * Gets the current step
	 *
	 * @return the step number
	 */
    this.getStepNumber = function(){
        return this.currentStep+1;
    };

    /**
     * Gets the count step
	 *
	 * @return the step count
	 */
    this.getStepCount = function(){
        return this.steps.length;
    };

    Ani.register(this);
};

Ani.AniSequence.prototype.constructor = Ani.AniSequence;
Ani.AniSequence.prototype.getStep = function(ani){
    var step = {
        anis: null,
        stepLength: 0,
        duration: 0.0,
        startTime: 0.0,
        endTime: 0.0,
        isFinished: function(){
            var finished = true;
            for (var a in this.anis){
                finished = finished && this.anis[a].isEnded;
            }
            return finished;
        },
        start: function(){
            for(var a in this.anis){
                this.anis[a].start();
            }
        },
        seekAll: function(val){
            for(var a in this.anis){
                this.anis[a].seek(val);
            }
        },
        seek: function(val){
            var seekTime = val*this.duration;
            for(var a in this.anis){
                var aniSeekValue = Ani.Util.map(seekTime, 0.0, this.anis[a].durationTotal, 0.0, 1.0);
                this.anis[a].seek(aniSeekValue);
            }
        },
        getTime: function(){
            var currentTime = 0.0;
            for(var a in this.anis){
                var seekValue = this.anis[a].getSeek()*this.anis[a].durationTotal;
                currentTime = Math.max(seekValue, currentTime);
            }
            return currentTime;
        },
        play: function(){
            for(var a in this.anis){
                this.anis[a].resume();
            }
        },
        pause: function(){
            for (var a in this.anis){
                this.anis[a].pause();
            }
        }
    };

    step.anis = (ani && ani.constructor === Array) ? ani : ((ani && [ani]) || []);
    step.stepLength = step.anis.length;
    step.duration = 0;
    for(var i in step.anis){
        var a = step.anis[i];
        a.setBegin();
        a.seek(1.0);
        // get the longest durationTotal of all anis in this step
        step.duration = Math.max(a.durationTotal, step.duration);
    }

    return step;
};