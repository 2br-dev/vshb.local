"use strict";(self.webpackChunkvshb_local=self.webpackChunkvshb_local||[]).push([[5609],{8083:(t,e,n)=>{n.d(e,{L:()=>r});var a=n(3237);class r{draw(t){const{particle:e,radius:n}=t;!function(t,e,n){const{context:r}=t,o=n.count.numerator*n.count.denominator,s=n.count.numerator/n.count.denominator,u=180*(s-2)/s,c=Math.PI-(0,a.pu)(u);if(r){r.beginPath(),r.translate(e.x,e.y),r.moveTo(0,0);for(let t=0;t<o;t++)r.lineTo(n.length,0),r.translate(n.length,0),r.rotate(c)}}(t,this.getCenter(e,n),this.getSidesData(e,n))}getSidesCount(t){const e=t.shapeData;return Math.round((0,a.VG)(e?.sides??5))}}},5609:(t,e,n)=>{n.d(e,{TriangleDrawer:()=>r});var a=n(8083);class r extends a.L{getCenter(t,e){return{x:-e,y:e/1.66}}getSidesCount(){return 3}getSidesData(t,e){return{count:{denominator:2,numerator:3},length:2*e}}}}}]);