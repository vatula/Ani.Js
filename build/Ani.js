// — Ani.js, http://github.com/vatula/Ani.Js 
'use strict';var Ani=Ani||function(){var d=1;Object.defineProperty(Object.prototype,"__ani_uid",{writable:true});Object.defineProperty(Object.prototype,"ani_uid",{get:function(){if(this.__ani_uid===void 0)this.__ani_uid=d++;return this.__ani_uid}});var a=[];return{anisLookup:{},defaultAutostartMode:null,defaultOverwriteMode:null,defaultTimeMode:null,defaultEasing:null,init:function(){this.autostart();this.overwrite();this.defaultTimeMode=Ani.Constants.SECONDS;this.defaultEasing=new Ani.Easings.Linear},
autostart:function(){this.defaultAutostartMode=Ani.Constants.AUTOSTART},noAutostart:function(){this.defaultAutostartMode=Ani.Constants.NO_AUTOSTART},overwrite:function(){this.defaultOverwriteMode=Ani.Constants.OVERWRITE},noOverwrite:function(){this.defaultOverwriteMode=Ani.Constants.NO_OVERWRITE},cleanAnis:function(){var a,c;for(a in this.anisLookup)this.anisLookup.hasOwnProperty(a)&&(c=this.anisLookup[a],c.isEnded&&delete this.anisLookup[a])},killAll:function(){var a,c;for(a in this.anisLookup)this.anisLookup.hasOwnProperty(a)&&
(c=this.anisLookup[a],c.pause(),this.unregister(c),delete this.anisLookup[a])},size:function(){return Ani.Util.ownSize(this.anisLookup)},register:function(b){"pre"in b&&a.indexOf(b)===-1&&a.push(b)},unregister:function(b){b=a.indexOf(b);b!=-1&&(a=a.splice(b,1))},update:function(){var b;for(b=0;b<a.length;++b)a[b].pre()},to:function(a){var a=Ani.Util.merge(Ani.Animation.defaults,a),c;c=a.targetFields;var e=typeof c,d={},f;if(e==="string"){var h=/\s*:\s*/;c=c.split(/\s*,\s*/);for(f=0;f<c.length;++f)e=
c[f].split(h),d[e[0]]=parseFloat(e[1])}else e==="object"&&(d=c);c=d;var d=[],g;for(g in c)if(c.hasOwnProperty(g))a.fieldName=g,a.end=c[g],this.cleanAnis(),f=a.target.ani_uid+"_"+a.fieldName,this.defaultOverwriteMode===Ani.Constants.OVERWRITE&&f in this.anisLookup?(e=this.anisLookup[f],e.setDuration(a.duration),e.setDelay(a.delay),e.setEasing(a.easing),e.timeMode=a.timeMode,e.setCallback(a.callback),e.setBegin(),e.setEnd(a.end),e.seek(0)):(e=new Ani.Animation(a),this.anisLookup[f]=e),a.reverse&&e.reverse(),
d.push(e);return d}}}();Ani.Constants=Ani.Constants||{VERSION:"2.0",SECONDS:"SECONDS",FRAMES:"FRAMES",ON_START:"onStart",ON_END:"onEnd",FORWARD:"FORWARD",BACKWARD:"BACKWARD",YOYO:"YOYO",AUTOSTART:"AUTOSTART",NO_AUTOSTART:"NO_AUTOSTART",OVERWRITE:"OVERWRITE",NO_OVERWRITE:"NO_OVERWRITE",ANI_DEBUG_PREFIX:"### Ani Debug -> ",IN:0,IN_OUT:2,OUT:1};
Ani.Util={map:function(d,a,b,c,e){return c+(e-c)*((d-a)/(b-a))},ownSize:function(d){var a=0,b;for(b in d)d.hasOwnProperty(b)&&a++;return a},merge:function(d,a){var b={},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c],d.hasOwnProperty(c)&&delete d[c]);for(var e in d)d.hasOwnProperty(e)&&(b[e]=d[e]);return b}};Ani.Easings=Ani.Easings||{};Ani.Easings.Easing=function(d){this.easingMode=d===void 0||d===null?Ani.Constants.OUT:d};
Ani.Easings.Easing.prototype={constructor:Ani.Easings.Easing,calcEasing:function(d,a,b,c){var e=0,e=Ani.Constants;switch(this.easingMode){case e.IN:e=this.easeIn(d,a,b,c);break;case e.IN_OUT:e=this.easeInOut(d,a,b,c);break;case e.OUT:e=this.easeOut(d,a,b,c);break;default:e=this.easeOut(d,a,b,c)}return e},setMode:function(d){this.easingMode=d},easeIn:function(){},easeOut:function(){},easeInOut:function(){}};Ani.Easings.Back=function(d){Ani.Easings.Easing.call(this,d);this.s=1.70158};
Ani.Easings.Back.prototype=new Ani.Easings.Easing;Ani.Easings.Back.prototype.constructor=Ani.Easings.Back;Ani.Easings.Back.prototype.easeIn=function(d,a,b,c){return b*(d/=c)*d*((this.s+1)*d-this.s)+a};Ani.Easings.Back.prototype.easeOut=function(d,a,b,c){return b*((d=d/c-1)*d*((this.s+1)*d+this.s)+1)+a};Ani.Easings.Back.prototype.easeInOut=function(d,a,b,c){return(d/=c/2)<1?b/2*d*d*(((this.s*=1.525)+1)*d-this.s)+a:b/2*((d-=2)*d*(((this.s*=1.525)+1)*d+this.s)+2)+a};
Ani.Easings.Bounce=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return c-this.easeOut(e-a,0,c,e)+b};this.easeOut=function(a,b,c,e){return(a/=e)<1/2.75?c*7.5625*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*a+0.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+0.984375)+b};this.easeInOut=function(a,b,c,e){return a<e/2?this.easeIn(a*2,0,c,e)*0.5+b:this.easeOut(a*2-e,0,c,e)*0.5+c*0.5+b}};Ani.Easings.Bounce.prototype=new Ani.Easings.Easing;
Ani.Easings.Bounce.prototype.constructor=Ani.Easings.Bounce;Ani.Easings.Circ=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return-c*(Math.sqrt(1-(a/=e)*a)-1)+b};this.easeOut=function(a,b,c,e){return c*Math.sqrt(1-(a=a/e-1)*a)+b};this.easeInOut=function(a,b,c,e){return(a/=e/2)<1?-c/2*(Math.sqrt(1-a*a)-1)+b:c/2*(Math.sqrt(1-(a-=2)*a)+1)+b}};Ani.Easings.Circ.prototype=new Ani.Easings.Easing;Ani.Easings.Circ.prototype.constructor=Ani.Easings.Circ;
Ani.Easings.Cubic=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return c*(a/=e)*a*a+b};this.easeOut=function(a,b,c,e){return c*((a=a/e-1)*a*a+1)+b};this.easeInOut=function(a,b,c,e){return(a/=e/2)<1?c/2*a*a*a+b:c/2*((a-=2)*a*a+2)+b}};Ani.Easings.Cubic.prototype=new Ani.Easings.Easing;Ani.Easings.Cubic.prototype.constructor=Ani.Easings.Cubic;
Ani.Easings.Elastic=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){if(a==0)return b;if((a/=e)==1)return b+c;var d=e*0.3,f=d/4;return-(c*Math.pow(2,10*(a-=1))*Math.sin((a*e-f)*2*Math.PI/d))+b};this.easeOut=function(a,b,c,e){if(a==0)return b;if((a/=e)==1)return b+c;var d=e*0.3,f=d/4;return c*Math.pow(2,-10*a)*Math.sin((a*e-f)*2*Math.PI/d)+c+b};this.easeInOut=function(a,b,c,e){if(a==0)return b;if((a/=e/2)==2)return b+c;var d=e*0.3*1.5,f=d/4;return a<1?-0.5*c*Math.pow(2,10*
(a-=1))*Math.sin((a*e-f)*2*Math.PI/d)+b:c*Math.pow(2,-10*(a-=1))*Math.sin((a*e-f)*2*Math.PI/d)*0.5+c+b}};Ani.Easings.Elastic.prototype=new Ani.Easings.Easing;Ani.Easings.Elastic.prototype.constructor=Ani.Easings.Elastic;
Ani.Easings.Expo=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return a==0?b:c*Math.pow(2,10*(a/e-1))+b};this.easeOut=function(a,b,c,e){return a==e?b+c:c*(-Math.pow(2,-10*a/e)+1)+b};this.easeInOut=function(a,b,c,e){return a==0?b:a==e?b+c:(a/=e/2)<1?c/2*Math.pow(2,10*(a-1))+b:c/2*(-Math.pow(2,-10*--a)+2)+b}};Ani.Easings.Expo.prototype=new Ani.Easings.Easing;Ani.Easings.Expo.prototype.constructor=Ani.Easings.Expo;
Ani.Easings.Linear=function(d){Ani.Easings.Easing.call(this,d)};Ani.Easings.Linear.prototype=new Ani.Easings.Easing;Ani.Easings.Linear.prototype.constructor=Ani.Easings.Linear;Ani.Easings.Linear.prototype.easeIn=Ani.Easings.Linear.prototype.easeOut=Ani.Easings.Linear.prototype.easeInOut=Ani.Easings.Linear.prototype.easeNone=function(d,a,b,c){return b*d/c+a};
Ani.Easings.Quad=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return c*(a/=e)*a+b};this.easeOut=function(a,b,c,e){return-c*(a/=e)*(a-2)+b};this.easeInOut=function(a,b,c,e){return(a/=e/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b}};Ani.Easings.Quad.prototype=new Ani.Easings.Easing;Ani.Easings.Quad.prototype.constructor=Ani.Easings.Quad;
Ani.Easings.Quart=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return c*(a/=e)*a*a*a+b};this.easeOut=function(a,b,c,e){return-c*((a=a/e-1)*a*a*a-1)+b};this.easeInOut=function(a,b,c,e){return(a/=e/2)<1?c/2*a*a*a*a+b:-c/2*((a-=2)*a*a*a-2)+b}};Ani.Easings.Quart.prototype=new Ani.Easings.Easing;Ani.Easings.Quart.prototype.constructor=Ani.Easings.Quart;
Ani.Easings.Quint=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return c*(a/=e)*a*a*a*a+b};this.easeOut=function(a,b,c,e){return c*((a=a/e-1)*a*a*a*a+1)+b};this.easeInOut=function(a,b,c,e){return(a/=e/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b}};Ani.Easings.Quint.prototype=new Ani.Easings.Easing;Ani.Easings.Quint.prototype.constructor=Ani.Easings.Quint;
Ani.Easings.Sine=function(d){Ani.Easings.Easing.call(this,d);this.easeIn=function(a,b,c,e){return-c*Math.cos(a/e*(Math.PI/2))+c+b};this.easeOut=function(a,b,c,e){return c*Math.sin(a/e*(Math.PI/2))+b};this.easeInOut=function(a,b,c,e){return-c/2*(Math.cos(Math.PI*a/e)-1)+b}};Ani.Easings.Sine.prototype=new Ani.Easings.Easing;Ani.Easings.Sine.prototype.constructor=Ani.Easings.Sine;
Ani.AniSequence=function(){this.steps=[];this.addParallelAnisCollector=[];this.isEnded=this.isPlaying=this.addParallel=false;this.time=this.durationTotal=this.currentStep=0;this.pre=function(){if(this.isPlaying&&this.steps.length>0){var a=this.steps[this.currentStep];if(a.isFinished()&&this.currentStep<this.steps.length-1)this.currentStep++,a=this.steps[this.currentStep],a.start();else if(this.currentStep===this.steps.length-1)this.isEnded=a.isFinished();this.time=a.startTime+a.getTime()}};this.seek=
function(a){this.isEnded=false;a=Math.min(1,Math.max(0,a));this.time=a*this.durationTotal;for(a=this.steps.length-1;a>=0;--a){var b=this.steps[a];if(this.time>=b.startTime&&this.time<b.endTime){this.currentStep=a;break}}for(b=this.steps.length-1;b>=this.currentStep;--b)if(a=this.steps[b],b===this.currentStep){b=Ani.Util.map(this.time-a.startTime,0,a.duration,0,1);a.seek(b);break}else a.seekAll(0)};this.add=function(a){if(a&&a.constructor===Array)if(this.addParallel)for(var b in a)this.add(a[b]);else{this.beginStep();
for(var c in a)this.add(a[c]);this.endStep()}else a&&a.constructor===Ani.Animation&&(this.addParallel?this.addParallelAnisCollector.push(a):this.steps.push(this.getStep(a)))};this.beginStep=function(){this.addParallelAnisCollector=[];this.addParallel=true};this.endStep=function(){this.steps.push(this.getStep(this.addParallelAnisCollector.slice()));this.addParallel=false};this.start=function(){this.isPlaying=true;this.isEnded=false;d.call(this);this.steps[this.currentStep].start()};this.resume=function(){this.steps[this.currentStep].play();
this.isPlaying=true;this.isEnded=false};this.pause=function(){this.steps[this.currentStep].pause();this.isPlaying=false};this.beginSequence=function(){Ani.noAutostart();Ani.noOverwrite()};this.endSequence=function(){Ani.autostart();Ani.overwrite();d.call(this)};var d=function(){this.durationTotal=this.currentStep=0;var a,b;for(a in this.steps)b=this.steps[a],b.pause(),b.startTime=this.durationTotal,b.endTime=this.durationTotal+b.duration,this.durationTotal+=b.duration;for(a=this.steps.length-1;a>=
0;--a)this.steps[a].seekAll(0)};this.getSeek=function(){return Math.min(1,Math.max(0,this.time/this.durationTotal))};this.getStepNumber=function(){return this.currentStep+1};this.getStepCount=function(){return this.steps.length};Ani.register(this)};Ani.AniSequence.prototype={};Ani.AniSequence.prototype.constructor=Ani.AniSequence;
Ani.AniSequence.prototype.getStep=function(d){var a={anis:null,stepLength:0,duration:0,startTime:0,endTime:0,isFinished:function(){var a=true,b;for(b in this.anis)a=a&&this.anis[b].isEnded;return a},start:function(){for(var a in this.anis)this.anis[a].start()},seekAll:function(a){for(var b in this.anis)this.anis[b].seek(a)},seek:function(a){a*=this.duration;for(var b in this.anis){var d=Ani.Util.map(a,0,this.anis[b].durationTotal,0,1);this.anis[b].seek(d)}},getTime:function(){var a=0,b;for(b in this.anis)var d=
this.anis[b].getSeek()*this.anis[b].durationTotal,a=Math.max(d,a);return a},play:function(){for(var a in this.anis)this.anis[a].resume()},pause:function(){for(var a in this.anis)this.anis[a].pause()}};a.anis=d&&d.constructor===Array?d:d&&[d]||[];a.stepLength=a.anis.length;a.duration=0;for(var b in a.anis)d=a.anis[b],d.setBegin(),d.seek(1),a.duration=Math.max(d.durationTotal,a.duration);return a};
Ani.AniCore=function(d,a,b,c,e,l,f,h,g){this.fieldName=e||"";this.isRegistered=false;this.targetObject=a||null;this.change=this.begin=this.position=0;this.end=l||0;this.time=this.beginTime=0;this.durationEasing=b||0;this.durationDelay=c||0;this.durationTotal=this.durationEasing+this.durationDelay;this.timeMode=h||Ani.defaultTimeMode;this.pauseTime=0;this.easing=f||Ani.defaultEasing;this.callbackFinishMethod=this.callbackUpdateMethod=this.callbackStartMethod=null;this.playDirection=this.playMode=Ani.Constants.FORWARD;
this.repeatNumber=0;this.repeatCount=1;this.isEnded=this.isPlaying=this.isDelaying=this.isRepeating=false;this.setBegin=function(a){if(isNaN(a)){var b=a=false;if(this.fieldName&&this.targetObject&&this.fieldName in this.targetObject){var a=true,c=this.targetObject[this.fieldName];this.begin=(b=!isNaN(c))?parseFloat(c):this.begin;this.change=this.end-this.begin}return a&&b}else return this.begin=parseFloat(a),this.change=this.end-this.begin,true};this.setEasing=function(a){this.easing=a||Ani.defaultEasing};
this.setCallback=function(a){if(a)this.callbackStartMethod=a.onStart||null,this.callbackUpdateMethod=a.onUpdate||null,this.callbackFinishMethod=a.onEnd||null};this.pre=function(){if(this.isPlaying){i.call(this,j.call(this));if(this.time<this.durationDelay)this.position=this.begin,this.isDelaying=true;else if(this.isDelaying=false,this.time>=this.durationTotal)if(this.isRepeating)this.repeatCount===1||this.repeatNumber<=this.repeatCount-1||this.repeatCount===-1?(this.playMode===Ani.Constants.YOYO&&
this.reverse(),this.start(),this.repeatNumber++):this.isRepeating=false;else{this.isDelaying=false;this.seek(1);this.isPlaying=false;this.isEnded=true;if(this.isRegistered)Ani.unregister(this),this.isRegistered=false;this.callbackFinishMethod&&this.callbackFinishMethod.call(this,this)}else k.call(this);this.targetObject[this.fieldName]=this.position;this.callbackUpdateMethod&&this.callbackUpdateMethod.call(this,this)}};this.start=function(){if(!this.isRegistered)Ani.register(this),this.repeatNumber=
1,this.isRegistered=true,this.callbackStartMethod&&this.callbackStartMethod.call(this,this);this.seek(0);this.isPlaying=true;this.isEnded=false};var k=function(){this.position=this.easing.calcEasing(this.time-this.durationDelay,this.begin,this.change,this.durationEasing)},j=function(){return this.timeMode===Ani.Constants.SECONDS?(Date.now()-this.beginTime)/1E3:(Date.now()-this.beginTime)/1E3},i=function(a){this.time=a;this.beginTime=this.timeMode===Ani.Constants.SECONDS?Date.now()-this.time*1E3:Date.now()-
this.time*1E3};this.pause=function(){this.isPlaying=false;this.pauseTime=j.call(this)};this.resume=function(){if(!this.isRegistered)Ani.register(this),this.isRegistered=true;if(!this.isPlaying&&!this.isEnded)this.isPlaying=true,this.seek(this.pauseTime/this.durationTotal)};this.seek=function(a){a=Math.min(1,Math.max(0,a));i.call(this,a*this.durationTotal);this.pauseTime=this.time;this.isEnded=false;this.time<this.durationDelay?this.position=this.begin:k.call(this);this.targetObject[this.fieldName]=
this.position};this.getSeek=function(){return Math.min(1,Math.max(0,this.time/this.durationTotal))};this.reverse=function(){var a=this.begin;this.begin=this.end;this.end=a;this.change=this.end-this.begin;if(this.playDirection===Ani.Constants.FORWARD)this.playDirection=Ani.Constants.BACKWARD;else if(this.playDirection===Ani.Constants.BACKWARD)this.playDirection=Ani.Constants.FORWARD};this.playMode=function(a){var b=this.playDirection;if(a===Ani.Constants.FORWARD)b===Ani.Constants.BACKWARD&&this.reverse(),
this.playMode=this.playDirection=Ani.Constants.FORWARD;else if(a===Ani.Constants.BACKWARD)b===Ani.Constants.FORWARD&&this.reverse(),this.playMode=this.playDirection=Ani.Constants.BACKWARD;else if(a===Ani.Constants.YOYO)this.playMode=Ani.Constants.YOYO};this.repeat=function(a){a?a>1?(this.isRepeating=true,this.repeatCount=a):(this.isRepeating=false,this.repeatCount=1):(this.isRepeating=true,this.repeatCount=-1)};this.noRepeat=function(){this.isRepeating=false;this.repeatCount=1};this.setEnd=function(a){this.end=
a;this.change=this.end-this.begin};this.setDelay=function(a){this.durationDelay=a;this.durationTotal=this.durationEasing+this.durationDelay};this.setDuration=function(a){this.durationEasing=a;this.durationTotal=this.durationEasing+this.durationDelay};this.setCallback(g);this.setBegin()&&d===Ani.Constants.AUTOSTART&&this.start()};Ani.AniCore.prototype={};Ani.AniCore.prototype.constructor=Ani.AniCore;
Ani.Animation=function(d){d=Ani.Util.merge(Ani.Animation.defaults,d);Ani.AniCore.call(this,d.autostart,d.target,d.duration,d.delay,d.fieldName,d.end,d.easing,d.timeMode,d.callback)};Ani.Animation.defaults={autostart:Ani.defaultAutostartMode,reverse:false,target:null,duration:0,delay:0,fieldName:"",end:0,easing:Ani.defaultEasing,timeMode:Ani.defaultTimeMode,callback:null};Ani.Animation.prototype=new Ani.AniCore;Ani.Animation.prototype.constructor=Ani.Animation;Ani.Animation.prototype.supr=Ani.AniCore.prototype;
