"use strict";(self.webpackChunkvshb_local=self.webpackChunkvshb_local||[]).push([[8977],{8977:(t,a,e)=>{e.d(a,{StarDrawer:()=>n});var s=e(3237);class n{draw(t){!function(t){const{context:a,particle:e,radius:s}=t,n=e.sides,r=e.starInset??2;a.moveTo(0,0-s);for(let t=0;t<n;t++)a.rotate(Math.PI/n),a.lineTo(0,0-s*r),a.rotate(Math.PI/n),a.lineTo(0,0-s)}(t)}getSidesCount(t){const a=t.shapeData;return Math.round((0,s.VG)(a?.sides??5))}particleInit(t,a){const e=a.shapeData;a.starInset=(0,s.VG)(e?.inset??2)}}}}]);