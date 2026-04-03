import{M as ke,V as b,O as it,a as E,E as at,b as W,T as X,S as Me,Q as Te,R as st,P as rt,c as lt,d as re,e as ct,F as Oe,f as le,A as ut,C as ze,B as dt,g as pt,U as Se,h as mt,I as ft,i as De}from"./three-core-B7so-1uS.js";class gt extends it{constructor(u=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=u,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new E(.5,.5),this.addEventListener("removed",function(){this.traverse(function(h){h.element instanceof Element&&h.element.parentNode!==null&&h.element.parentNode.removeChild(h.element)})})}copy(u,h){return super.copy(u,h),this.element=u.element.cloneNode(!0),this.center=u.center,this}}const B=new b,Ae=new ke,Le=new ke,Ce=new b,je=new b;class xt{constructor(u={}){const h=this;let e,o,c,T;const l={objects:new WeakMap},y=u.element!==void 0?u.element:document.createElement("div");y.style.overflow="hidden",this.domElement=y,this.getSize=function(){return{width:e,height:o}},this.render=function(i,a){i.matrixWorldAutoUpdate===!0&&i.updateMatrixWorld(),a.parent===null&&a.matrixWorldAutoUpdate===!0&&a.updateMatrixWorld(),Ae.copy(a.matrixWorldInverse),Le.multiplyMatrices(a.projectionMatrix,Ae),P(i,i,a),x(i)},this.setSize=function(i,a){e=i,o=a,c=e/2,T=o/2,y.style.width=i+"px",y.style.height=a+"px"};function P(i,a,f){if(i.isCSS2DObject){B.setFromMatrixPosition(i.matrixWorld),B.applyMatrix4(Le);const d=i.visible===!0&&B.z>=-1&&B.z<=1&&i.layers.test(f.layers)===!0;if(i.element.style.display=d===!0?"":"none",d===!0){i.onBeforeRender(h,a,f);const p=i.element;p.style.transform="translate("+-100*i.center.x+"%,"+-100*i.center.y+"%)translate("+(B.x*c+c)+"px,"+(-B.y*T+T)+"px)",p.parentNode!==y&&y.appendChild(p),i.onAfterRender(h,a,f)}const s={distanceToCameraSquared:w(f,i)};l.objects.set(i,s)}for(let d=0,s=i.children.length;d<s;d++)P(i.children[d],a,f)}function w(i,a){return Ce.setFromMatrixPosition(i.matrixWorld),je.setFromMatrixPosition(a.matrixWorld),Ce.distanceToSquared(je)}function M(i){const a=[];return i.traverse(function(f){f.isCSS2DObject&&a.push(f)}),a}function x(i){const a=M(i).sort(function(d,s){if(d.renderOrder!==s.renderOrder)return s.renderOrder-d.renderOrder;const p=l.objects.get(d).distanceToCameraSquared,O=l.objects.get(s).distanceToCameraSquared;return p-O}),f=a.length;for(let d=0,s=a.length;d<s;d++)a[d].element.style.zIndex=f-d}}}const Re={type:"change"},ce={type:"start"},Ne={type:"end"},ee=new st,Ie=new rt,ht=Math.cos(70*lt.DEG2RAD);class vt extends at{constructor(u,h){super(),this.object=u,this.domElement=h,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new b,this.cursor=new b,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:W.ROTATE,MIDDLE:W.DOLLY,RIGHT:W.PAN},this.touches={ONE:X.ROTATE,TWO:X.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return l.phi},this.getAzimuthalAngle=function(){return l.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(t){t.addEventListener("keydown",ae),this._domElementKeyEvents=t},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ae),this._domElementKeyEvents=null},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(Re),e.update(),c=o.NONE},this.update=function(){const t=new b,n=new Te().setFromUnitVectors(u.up,new b(0,1,0)),r=n.clone().invert(),m=new b,v=new Te,z=new b,D=2*Math.PI;return function(ot=null){const Pe=e.object.position;t.copy(Pe).sub(e.target),t.applyQuaternion(n),l.setFromVector3(t),e.autoRotate&&c===o.NONE&&U(Y(ot)),e.enableDamping?(l.theta+=y.theta*e.dampingFactor,l.phi+=y.phi*e.dampingFactor):(l.theta+=y.theta,l.phi+=y.phi);let j=e.minAzimuthAngle,R=e.maxAzimuthAngle;isFinite(j)&&isFinite(R)&&(j<-Math.PI?j+=D:j>Math.PI&&(j-=D),R<-Math.PI?R+=D:R>Math.PI&&(R-=D),j<=R?l.theta=Math.max(j,Math.min(R,l.theta)):l.theta=l.theta>(j+R)/2?Math.max(j,l.theta):Math.min(R,l.theta)),l.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,l.phi)),l.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(w,e.dampingFactor):e.target.add(w),e.target.sub(e.cursor),e.target.clampLength(e.minTargetRadius,e.maxTargetRadius),e.target.add(e.cursor),e.zoomToCursor&&k||e.object.isOrthographicCamera?l.radius=oe(l.radius):l.radius=oe(l.radius*P),t.setFromSpherical(l),t.applyQuaternion(r),Pe.copy(e.target).add(t),e.object.lookAt(e.target),e.enableDamping===!0?(y.theta*=1-e.dampingFactor,y.phi*=1-e.dampingFactor,w.multiplyScalar(1-e.dampingFactor)):(y.set(0,0,0),w.set(0,0,0));let se=!1;if(e.zoomToCursor&&k){let q=null;if(e.object.isPerspectiveCamera){const G=t.length();q=oe(G*P);const $=G-q;e.object.position.addScaledVector(I,$),e.object.updateMatrixWorld()}else if(e.object.isOrthographicCamera){const G=new b(A.x,A.y,0);G.unproject(e.object),e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/P)),e.object.updateProjectionMatrix(),se=!0;const $=new b(A.x,A.y,0);$.unproject(e.object),e.object.position.sub($).add(G),e.object.updateMatrixWorld(),q=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;q!==null&&(this.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(q).add(e.object.position):(ee.origin.copy(e.object.position),ee.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(ee.direction))<ht?u.lookAt(e.target):(Ie.setFromNormalAndCoplanarPoint(e.object.up,e.target),ee.intersectPlane(Ie,e.target))))}else e.object.isOrthographicCamera&&(e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/P)),e.object.updateProjectionMatrix(),se=!0);return P=1,k=!1,se||m.distanceToSquared(e.object.position)>T||8*(1-v.dot(e.object.quaternion))>T||z.distanceToSquared(e.target)>0?(e.dispatchEvent(Re),m.copy(e.object.position),v.copy(e.object.quaternion),z.copy(e.target),!0):!1}}(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",Ee),e.domElement.removeEventListener("pointerdown",ge),e.domElement.removeEventListener("pointercancel",Z),e.domElement.removeEventListener("wheel",xe),e.domElement.removeEventListener("pointermove",ie),e.domElement.removeEventListener("pointerup",Z),e._domElementKeyEvents!==null&&(e._domElementKeyEvents.removeEventListener("keydown",ae),e._domElementKeyEvents=null)};const e=this,o={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let c=o.NONE;const T=1e-6,l=new Me,y=new Me;let P=1;const w=new b,M=new E,x=new E,i=new E,a=new E,f=new E,d=new E,s=new E,p=new E,O=new E,I=new b,A=new E;let k=!1;const g=[],_={};let F=!1;function Y(t){return t!==null?2*Math.PI/60*e.autoRotateSpeed*t:2*Math.PI/60/60*e.autoRotateSpeed}function L(t){const n=Math.abs(t*.01);return Math.pow(.95,e.zoomSpeed*n)}function U(t){y.theta-=t}function V(t){y.phi-=t}const H=function(){const t=new b;return function(r,m){t.setFromMatrixColumn(m,0),t.multiplyScalar(-r),w.add(t)}}(),Q=function(){const t=new b;return function(r,m){e.screenSpacePanning===!0?t.setFromMatrixColumn(m,1):(t.setFromMatrixColumn(m,0),t.crossVectors(e.object.up,t)),t.multiplyScalar(r),w.add(t)}}(),S=function(){const t=new b;return function(r,m){const v=e.domElement;if(e.object.isPerspectiveCamera){const z=e.object.position;t.copy(z).sub(e.target);let D=t.length();D*=Math.tan(e.object.fov/2*Math.PI/180),H(2*r*D/v.clientHeight,e.object.matrix),Q(2*m*D/v.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(H(r*(e.object.right-e.object.left)/e.object.zoom/v.clientWidth,e.object.matrix),Q(m*(e.object.top-e.object.bottom)/e.object.zoom/v.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}}();function C(t){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?P/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function J(t){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?P*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function ne(t,n){if(!e.zoomToCursor)return;k=!0;const r=e.domElement.getBoundingClientRect(),m=t-r.left,v=n-r.top,z=r.width,D=r.height;A.x=m/z*2-1,A.y=-(v/D)*2+1,I.set(A.x,A.y,1).unproject(e.object).sub(e.object.position).normalize()}function oe(t){return Math.max(e.minDistance,Math.min(e.maxDistance,t))}function ue(t){M.set(t.clientX,t.clientY)}function Ye(t){ne(t.clientX,t.clientX),s.set(t.clientX,t.clientY)}function de(t){a.set(t.clientX,t.clientY)}function Ue(t){x.set(t.clientX,t.clientY),i.subVectors(x,M).multiplyScalar(e.rotateSpeed);const n=e.domElement;U(2*Math.PI*i.x/n.clientHeight),V(2*Math.PI*i.y/n.clientHeight),M.copy(x),e.update()}function Fe(t){p.set(t.clientX,t.clientY),O.subVectors(p,s),O.y>0?C(L(O.y)):O.y<0&&J(L(O.y)),s.copy(p),e.update()}function Ve(t){f.set(t.clientX,t.clientY),d.subVectors(f,a).multiplyScalar(e.panSpeed),S(d.x,d.y),a.copy(f),e.update()}function He(t){ne(t.clientX,t.clientY),t.deltaY<0?J(L(t.deltaY)):t.deltaY>0&&C(L(t.deltaY)),e.update()}function Ke(t){let n=!1;switch(t.code){case e.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?V(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):S(0,e.keyPanSpeed),n=!0;break;case e.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?V(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):S(0,-e.keyPanSpeed),n=!0;break;case e.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?U(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):S(e.keyPanSpeed,0),n=!0;break;case e.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?U(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):S(-e.keyPanSpeed,0),n=!0;break}n&&(t.preventDefault(),e.update())}function pe(t){if(g.length===1)M.set(t.pageX,t.pageY);else{const n=K(t),r=.5*(t.pageX+n.x),m=.5*(t.pageY+n.y);M.set(r,m)}}function me(t){if(g.length===1)a.set(t.pageX,t.pageY);else{const n=K(t),r=.5*(t.pageX+n.x),m=.5*(t.pageY+n.y);a.set(r,m)}}function fe(t){const n=K(t),r=t.pageX-n.x,m=t.pageY-n.y,v=Math.sqrt(r*r+m*m);s.set(0,v)}function We(t){e.enableZoom&&fe(t),e.enablePan&&me(t)}function Xe(t){e.enableZoom&&fe(t),e.enableRotate&&pe(t)}function he(t){if(g.length==1)x.set(t.pageX,t.pageY);else{const r=K(t),m=.5*(t.pageX+r.x),v=.5*(t.pageY+r.y);x.set(m,v)}i.subVectors(x,M).multiplyScalar(e.rotateSpeed);const n=e.domElement;U(2*Math.PI*i.x/n.clientHeight),V(2*Math.PI*i.y/n.clientHeight),M.copy(x)}function ye(t){if(g.length===1)f.set(t.pageX,t.pageY);else{const n=K(t),r=.5*(t.pageX+n.x),m=.5*(t.pageY+n.y);f.set(r,m)}d.subVectors(f,a).multiplyScalar(e.panSpeed),S(d.x,d.y),a.copy(f)}function be(t){const n=K(t),r=t.pageX-n.x,m=t.pageY-n.y,v=Math.sqrt(r*r+m*m);p.set(0,v),O.set(0,Math.pow(p.y/s.y,e.zoomSpeed)),C(O.y),s.copy(p);const z=(t.pageX+n.x)*.5,D=(t.pageY+n.y)*.5;ne(z,D)}function Be(t){e.enableZoom&&be(t),e.enablePan&&ye(t)}function Ze(t){e.enableZoom&&be(t),e.enableRotate&&he(t)}function ge(t){e.enabled!==!1&&(g.length===0&&(e.domElement.setPointerCapture(t.pointerId),e.domElement.addEventListener("pointermove",ie),e.domElement.addEventListener("pointerup",Z)),tt(t),t.pointerType==="touch"?$e(t):qe(t))}function ie(t){e.enabled!==!1&&(t.pointerType==="touch"?et(t):Ge(t))}function Z(t){nt(t),g.length===0&&(e.domElement.releasePointerCapture(t.pointerId),e.domElement.removeEventListener("pointermove",ie),e.domElement.removeEventListener("pointerup",Z)),e.dispatchEvent(Ne),c=o.NONE}function qe(t){let n;switch(t.button){case 0:n=e.mouseButtons.LEFT;break;case 1:n=e.mouseButtons.MIDDLE;break;case 2:n=e.mouseButtons.RIGHT;break;default:n=-1}switch(n){case W.DOLLY:if(e.enableZoom===!1)return;Ye(t),c=o.DOLLY;break;case W.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enablePan===!1)return;de(t),c=o.PAN}else{if(e.enableRotate===!1)return;ue(t),c=o.ROTATE}break;case W.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(e.enableRotate===!1)return;ue(t),c=o.ROTATE}else{if(e.enablePan===!1)return;de(t),c=o.PAN}break;default:c=o.NONE}c!==o.NONE&&e.dispatchEvent(ce)}function Ge(t){switch(c){case o.ROTATE:if(e.enableRotate===!1)return;Ue(t);break;case o.DOLLY:if(e.enableZoom===!1)return;Fe(t);break;case o.PAN:if(e.enablePan===!1)return;Ve(t);break}}function xe(t){e.enabled===!1||e.enableZoom===!1||c!==o.NONE||(t.preventDefault(),e.dispatchEvent(ce),He(Qe(t)),e.dispatchEvent(Ne))}function Qe(t){const n=t.deltaMode,r={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(n){case 1:r.deltaY*=16;break;case 2:r.deltaY*=100;break}return t.ctrlKey&&!F&&(r.deltaY*=10),r}function Je(t){t.key==="Control"&&(F=!0,document.addEventListener("keyup",ve,{passive:!0,capture:!0}))}function ve(t){t.key==="Control"&&(F=!1,document.removeEventListener("keyup",ve,{passive:!0,capture:!0}))}function ae(t){e.enabled===!1||e.enablePan===!1||Ke(t)}function $e(t){switch(we(t),g.length){case 1:switch(e.touches.ONE){case X.ROTATE:if(e.enableRotate===!1)return;pe(t),c=o.TOUCH_ROTATE;break;case X.PAN:if(e.enablePan===!1)return;me(t),c=o.TOUCH_PAN;break;default:c=o.NONE}break;case 2:switch(e.touches.TWO){case X.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;We(t),c=o.TOUCH_DOLLY_PAN;break;case X.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;Xe(t),c=o.TOUCH_DOLLY_ROTATE;break;default:c=o.NONE}break;default:c=o.NONE}c!==o.NONE&&e.dispatchEvent(ce)}function et(t){switch(we(t),c){case o.TOUCH_ROTATE:if(e.enableRotate===!1)return;he(t),e.update();break;case o.TOUCH_PAN:if(e.enablePan===!1)return;ye(t),e.update();break;case o.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;Be(t),e.update();break;case o.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;Ze(t),e.update();break;default:c=o.NONE}}function Ee(t){e.enabled!==!1&&t.preventDefault()}function tt(t){g.push(t.pointerId)}function nt(t){delete _[t.pointerId];for(let n=0;n<g.length;n++)if(g[n]==t.pointerId){g.splice(n,1);return}}function we(t){let n=_[t.pointerId];n===void 0&&(n=new E,_[t.pointerId]=n),n.set(t.pageX,t.pageY)}function K(t){const n=t.pointerId===g[0]?g[1]:g[0];return _[n]}e.domElement.addEventListener("contextmenu",Ee),e.domElement.addEventListener("pointerdown",ge),e.domElement.addEventListener("pointercancel",Z),e.domElement.addEventListener("wheel",xe,{passive:!1}),document.addEventListener("keydown",Je,{passive:!0,capture:!0}),this.update()}}class te extends re{constructor(){super(te.Geometry,new ct({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;const u=new b,h=new b,e=new Oe(16,16),o=new Oe(16,16);let c=Se;const T=te.Geometry,l=new le({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),y=new le({uniforms:{map:{value:e},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),P=new re(T,l),w=[],M=_e.Shader,x=new le({name:M.name,uniforms:{map:{value:null},occlusionMap:{value:o},color:{value:new ze(16777215)},scale:{value:new E},screenPosition:{value:new b}},vertexShader:M.vertexShader,fragmentShader:M.fragmentShader,blending:ut,transparent:!0,depthWrite:!1}),i=new re(T,x);this.addElement=function(p){w.push(p)};const a=new E,f=new E,d=new dt,s=new pt;this.onBeforeRender=function(p,O,I){p.getCurrentViewport(s);const A=p.getRenderTarget(),k=A!==null?A.texture.type:Se;c!==k&&(e.dispose(),o.dispose(),e.type=o.type=k,c=k);const g=s.w/s.z,_=s.z/2,F=s.w/2;let Y=16/s.w;if(a.set(Y*g,Y),d.min.set(s.x,s.y),d.max.set(s.x+(s.z-16),s.y+(s.w-16)),h.setFromMatrixPosition(this.matrixWorld),h.applyMatrix4(I.matrixWorldInverse),!(h.z>0)&&(u.copy(h).applyMatrix4(I.projectionMatrix),f.x=s.x+u.x*_+_-8,f.y=s.y+u.y*F+F-8,d.containsPoint(f))){p.copyFramebufferToTexture(f,e);let L=l.uniforms;L.scale.value=a,L.screenPosition.value=u,p.renderBufferDirect(I,null,T,l,P,null),p.copyFramebufferToTexture(f,o),L=y.uniforms,L.scale.value=a,L.screenPosition.value=u,p.renderBufferDirect(I,null,T,y,P,null);const U=-u.x*2,V=-u.y*2;for(let H=0,Q=w.length;H<Q;H++){const S=w[H],C=x.uniforms;C.color.value.copy(S.color),C.map.value=S.texture,C.screenPosition.value.x=u.x+U*S.distance,C.screenPosition.value.y=u.y+V*S.distance,Y=S.size/s.w;const J=s.w/s.z;C.scale.value.set(Y*J,Y),x.uniformsNeedUpdate=!0,p.renderBufferDirect(I,null,T,x,i,null)}}},this.dispose=function(){l.dispose(),y.dispose(),x.dispose(),e.dispose(),o.dispose();for(let p=0,O=w.length;p<O;p++)w[p].texture.dispose()}}}class _e{constructor(u,h=1,e=0,o=new ze(16777215)){this.texture=u,this.size=h,this.distance=e,this.color=o}}_e.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`};te.Geometry=function(){const N=new mt,u=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),h=new ft(u,5);return N.setIndex([0,1,2,0,2,3]),N.setAttribute("position",new De(h,3,0,!1)),N.setAttribute("uv",new De(h,2,3,!1)),N}();export{gt as C,te as L,vt as O,_e as a,xt as b};
