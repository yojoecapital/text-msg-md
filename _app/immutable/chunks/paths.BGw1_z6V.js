import{n as b,s as g}from"./scheduler.CaG54wxu.js";const e=[];function d(i,a=b){let n;const o=new Set;function r(t){if(g(i,t)&&(i=t,n)){const c=!e.length;for(const s of o)s[1](),e.push(s,i);if(c){for(let s=0;s<e.length;s+=2)e[s][0](e[s+1]);e.length=0}}}function f(t){r(t(i))}function _(t,c=b){const s=[t,c];return o.add(s),o.size===1&&(n=a(r,f)||b),t(i),()=>{o.delete(s),o.size===0&&n&&(n(),n=null)}}return{set:r,update:f,subscribe:_}}var u;const h=((u=globalThis.__sveltekit_1qvicvl)==null?void 0:u.base)??"/text-msg-md";var l;const q=((l=globalThis.__sveltekit_1qvicvl)==null?void 0:l.assets)??h;export{q as a,h as b,d as w};