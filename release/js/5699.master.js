"use strict";(self.webpackChunkvshb_local=self.webpackChunkvshb_local||[]).push([[5699],{5699:(o,t,a)=>{a.d(t,{OpacityUpdater:()=>c});var i=a(3237);class c{constructor(o){this.container=o}init(o){const t=o.options.opacity;o.opacity=(0,i.Xs)(t,1);const a=t.animation;a.enable&&(o.opacity.velocity=(0,i.VG)(a.speed)/i.a5*this.container.retina.reduceFactor,a.sync||(o.opacity.velocity*=(0,i.G0)()))}isEnabled(o){return!o.destroyed&&!o.spawning&&!!o.opacity&&o.opacity.enable&&((o.opacity.maxLoops??0)<=0||(o.opacity.maxLoops??0)>0&&(o.opacity.loops??0)<(o.opacity.maxLoops??0))}reset(o){o.opacity&&(o.opacity.time=0,o.opacity.loops=0)}update(o,t){this.isEnabled(o)&&o.opacity&&(0,i.UC)(o,o.opacity,!0,o.options.opacity.animation.destroy,t)}}}}]);