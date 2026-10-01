import{$ as F,B as ue,C as $,D as Bt,G as L,H as S,I as X,K as At,L as he,P as Ve,Q as ce,R as B,T as V,U as Gt,X as We,Y as v,_ as Te,at as h,b as de,d as fe,f as Ne,h as Ut,i as It,j as Et,k as $e,l as Z,m as je,n as Se,nt as Dt,o as zt,ot as ee,r as Y,rt as Ht,s as Ot,t as Ft,tt as M,u as Lt,w as Ce,x as Vt,y as ie,z as E}from"./Geometry-JcOjYH16.js";var ae=[];ee.handleByNamedList(h.Environment,ae);async function Wt(t){if(!t)for(let e=0;e<ae.length;e++){const r=ae[e];if(r.value.test()){await r.value.load();return}}}var z;function Nt(){if(typeof z=="boolean")return z;try{z=new Function("param1","param2","param3","return param1[param2] === param3;")({a:"b"},"a","b")===!0}catch{z=!1}return z}var D=(t=>(t[t.NONE=0]="NONE",t[t.COLOR=16384]="COLOR",t[t.STENCIL=1024]="STENCIL",t[t.DEPTH=256]="DEPTH",t[t.COLOR_DEPTH=16640]="COLOR_DEPTH",t[t.COLOR_STENCIL=17408]="COLOR_STENCIL",t[t.DEPTH_STENCIL=1280]="DEPTH_STENCIL",t[t.ALL=17664]="ALL",t))(D||{}),Ye=class{constructor(t){this.items=[],this._name=t}emit(t,e,r,s,n,i,o,a){const{name:l,items:u}=this;for(let d=0,f=u.length;d<f;d++)u[d][l](t,e,r,s,n,i,o,a);return this}add(t){return t[this._name]&&(this.remove(t),this.items.push(t)),this}remove(t){const e=this.items.indexOf(t);return e!==-1&&this.items.splice(e,1),this}contains(t){return this.items.indexOf(t)!==-1}removeAll(){return this.items.length=0,this}destroy(){this.removeAll(),this.items=null,this._name=null}get empty(){return this.items.length===0}get name(){return this._name}},$t=["init","destroy","contextChange","resolutionChange","resetState","renderEnd","renderStart","render","update","postrender","prerender"],Ke=class qe extends Ht{constructor(e){super(),this.tick=0,this.uid=ce("renderer"),this.runners=Object.create(null),this.renderPipes=Object.create(null),this._initOptions={},this._systemsHash=Object.create(null),this.type=e.type,this.name=e.name,this.config=e;const r=[...$t,...this.config.runners??[]];this._addRunners(...r),this._unsafeEvalCheck()}async init(e={}){const r=e.skipExtensionImports===!0?!0:e.manageImports===!1;await Wt(r),this._addSystems(this.config.systems),this._addPipes(this.config.renderPipes,this.config.renderPipeAdaptors);for(const s in this._systemsHash)e={...this._systemsHash[s].constructor.defaultOptions,...e};e={...qe.defaultOptions,...e},this._roundPixels=e.roundPixels?1:0;for(let s=0;s<this.runners.init.items.length;s++)await this.runners.init.items[s].init(e);this._initOptions=e}render(e,r){this.tick++;let s=e;if(s instanceof $&&(s={container:s},r&&(v(We,"passing a second argument is deprecated, please use render options instead"),s.target=r.renderTexture)),s.target||(s.target=this.view.renderTarget),s.target===this.view.renderTarget&&(this._lastObjectRendered=s.container,s.clearColor??(s.clearColor=this.background.colorRgba),s.clear??(s.clear=this.background.clearBeforeRender)),s.clearColor){const n=Array.isArray(s.clearColor)&&s.clearColor.length===4;s.clearColor=n?s.clearColor:E.shared.setValue(s.clearColor).toArray()}s.transform||(s.container.updateLocalTransform(),s.transform=s.container.localTransform),s.container.visible&&(s.container.enableRenderGroup(),this.runners.prerender.emit(s),this.runners.renderStart.emit(s),this.runners.render.emit(s),this.runners.renderEnd.emit(s),this.runners.postrender.emit(s))}resize(e,r,s){const n=this.view.resolution;this.view.resize(e,r,s),this.emit("resize",this.view.screen.width,this.view.screen.height,this.view.resolution),s!==void 0&&s!==n&&this.runners.resolutionChange.emit(s)}clear(e={}){const r=this;e.target||(e.target=r.renderTarget.renderTarget),e.clearColor||(e.clearColor=this.background.colorRgba),e.clear??(e.clear=D.ALL);const{clear:s,clearColor:n,target:i,mipLevel:o,layer:a}=e;E.shared.setValue(n??this.background.colorRgba),r.renderTarget.clear(i,s,E.shared.toArray(),o??0,a??0)}get resolution(){return this.view.resolution}set resolution(e){this.view.resolution=e,this.runners.resolutionChange.emit(e)}get width(){return this.view.texture.frame.width}get height(){return this.view.texture.frame.height}get canvas(){return this.view.canvas}get lastObjectRendered(){return this._lastObjectRendered}get renderingToScreen(){return this.renderTarget.renderingToScreen}get screen(){return this.view.screen}_addRunners(...e){e.forEach(r=>{this.runners[r]=new Ye(r)})}_addSystems(e){let r;for(r in e){const s=e[r];this._addSystem(s.value,s.name)}}_addSystem(e,r){const s=new e(this);if(this[r])throw new Error(`Whoops! The name "${r}" is already in use`);this[r]=s,this._systemsHash[r]=s;for(const n in this.runners)this.runners[n].add(s);return this}_addPipes(e,r){const s=r.reduce((n,i)=>(n[i.name]=i.value,n),{});e.forEach(n=>{const i=n.value,o=n.name,a=s[o];this.renderPipes[o]=new i(this,a?new a:null),this.runners.destroy.add(this.renderPipes[o])})}destroy(e=!1){this.runners.destroy.items.reverse(),this.runners.destroy.emit(e),(e===!0||typeof e=="object"&&e.releaseGlobalResources)&&he.release(),Object.values(this.runners).forEach(r=>{r.destroy()}),this._systemsHash=null,this.renderPipes=null,this.removeAllListeners()}generateTexture(e){return this.textureGenerator.generateTexture(e)}get roundPixels(){return!!this._roundPixels}_unsafeEvalCheck(){if(!Nt())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}resetState(){this.runners.resetState.emit()}};Ke.defaultOptions={resolution:1,failIfMajorPerformanceCaveat:!1,roundPixels:!1};var ss=Ke,Q="8.20.0",jt=class{static init(){globalThis.__PIXI_APP_INIT__?.(this,Q)}static destroy(){}};jt.extension=h.Application;var Xe=class{constructor(t){this._renderer=t}init(){globalThis.__PIXI_RENDERER_INIT__?.(this._renderer,Q)}destroy(){this._renderer=null}};Xe.extension={type:[h.WebGLSystem,h.WebGPUSystem],name:"initHook",priority:-10};var we=class{constructor(t){typeof t=="number"?this.rawBinaryData=new ArrayBuffer(t):t instanceof Uint8Array?this.rawBinaryData=t.buffer:this.rawBinaryData=t,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(t){return this[`${t}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(t){switch(t){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw new Error(`${t} isn't a valid view type`)}}};function ke(t,e,r,s){if(r??(r=0),s??(s=Math.min(t.byteLength-r,e.byteLength)),!(r&7)&&!(s&7)){const n=s/8;new Float64Array(e,0,n).set(new Float64Array(t,r,n))}else if(!(r&3)&&!(s&3)){const n=s/4;new Float32Array(e,0,n).set(new Float32Array(t,r,n))}else new Uint8Array(e).set(new Uint8Array(t,r,s))}var Yt={normal:"normal-npm",add:"add-npm",screen:"screen-npm"},w=(t=>(t[t.DISABLED=0]="DISABLED",t[t.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",t[t.MASK_ACTIVE=2]="MASK_ACTIVE",t[t.INVERSE_MASK_ACTIVE=3]="INVERSE_MASK_ACTIVE",t[t.RENDERING_MASK_REMOVE=4]="RENDERING_MASK_REMOVE",t[t.NONE=5]="NONE",t))(w||{});function Me(t,e){return e.alphaMode==="no-premultiply-alpha"&&Yt[t]||t}var Kt=["precision mediump float;","void main(void){","float test = 0.1;","%forloop%","gl_FragColor = vec4(0.0);","}"].join(`
`);function qt(t){let e="";for(let r=0;r<t;++r)r>0&&(e+=`
else `),r<t-1&&(e+=`if(test == ${r}.0){}`);return e}function Xt(t,e){if(t===0)throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");const r=e.createShader(e.FRAGMENT_SHADER);try{for(;;){const s=Kt.replace(/%forloop%/gi,qt(t));if(e.shaderSource(r,s),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))t=t/2|0;else break}}finally{e.deleteShader(r)}return t}var U=null;function Qt(){if(U)return U;const t=Ut();return U=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),U=Xt(U,t),t.getExtension("WEBGL_lose_context")?.loseContext(),U}var Jt=class{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let t=0;t<this.count;t++){const e=this.textures[t];this.textures[t]=null,this.ids[e.uid]=null}this.count=0}},Zt=class{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.textures=new Jt,this.blendMode="normal",this.topology="triangle-strip",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}},W=[],J=0;he.register({clear:()=>{if(W.length>0)for(const t of W)t&&t.destroy();W.length=0,J=0}});function Re(){return J>0?W[--J]:new Zt}function Pe(t){t.elements=null,W[J++]=t}var H=0,Qe=class Je{constructor(e){this.uid=ce("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],e={...Je.defaultOptions,...e},e.maxTextures||(v("v8.8.0","maxTextures is a required option for Batcher now, please pass it in the options"),e.maxTextures=Qt());const{maxTextures:r,attributesInitialSize:s,indicesInitialSize:n}=e;this.attributeBuffer=new we(s*4),this.indexBuffer=new Uint16Array(n),this.maxTextures=r}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let e=0;e<this.batchIndex;e++)Pe(this.batches[e]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(e){this._elements[this.elementSize++]=e,e._indexStart=this.indexSize,e._attributeStart=this.attributeSize,e._batcher=this,this.indexSize+=e.indexSize,this.attributeSize+=e.attributeSize*this.vertexSize}checkAndUpdateTexture(e,r){const s=e._batch.textures.ids[r._source.uid];return!s&&s!==0?!1:(e._textureId=s,e.texture=r,!0)}updateElement(e){this.dirty=!0;const r=this.attributeBuffer;e.packAsQuad?this.packQuadAttributes(e,r.float32View,r.uint32View,e._attributeStart,e._textureId):this.packAttributes(e,r.float32View,r.uint32View,e._attributeStart,e._textureId)}break(e){const r=this._elements;if(!r[this.elementStart])return;let s=Re(),n=s.textures;n.clear();const i=r[this.elementStart];let o=Me(i.blendMode,i.texture._source),a=i.topology;this.attributeSize*4>this.attributeBuffer.size&&this._resizeAttributeBuffer(this.attributeSize*4),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);const l=this.attributeBuffer.float32View,u=this.attributeBuffer.uint32View,d=this.indexBuffer;let f=this._batchIndexSize,p=this._batchIndexStart,m="startBatch",x=[];const b=this.maxTextures;for(let y=this.elementStart;y<this.elementSize;++y){const c=r[y];r[y]=null;const _=c.texture._source,g=Me(c.blendMode,_),T=o!==g||a!==c.topology;if(_._batchTick===H&&!T){c._textureId=_._textureBindLocation,f+=c.indexSize,c.packAsQuad?(this.packQuadAttributes(c,l,u,c._attributeStart,c._textureId),this.packQuadIndex(d,c._indexStart,c._attributeStart/this.vertexSize)):(this.packAttributes(c,l,u,c._attributeStart,c._textureId),this.packIndex(c,d,c._indexStart,c._attributeStart/this.vertexSize)),c._batch=s,x.push(c);continue}_._batchTick=H,(n.count>=b||T)&&(this._finishBatch(s,p,f-p,n,o,a,e,m,x),m="renderBatch",p=f,o=g,a=c.topology,s=Re(),n=s.textures,n.clear(),x=[],++H),c._textureId=_._textureBindLocation=n.count,n.ids[_.uid]=n.count,n.textures[n.count++]=_,c._batch=s,x.push(c),f+=c.indexSize,c.packAsQuad?(this.packQuadAttributes(c,l,u,c._attributeStart,c._textureId),this.packQuadIndex(d,c._indexStart,c._attributeStart/this.vertexSize)):(this.packAttributes(c,l,u,c._attributeStart,c._textureId),this.packIndex(c,d,c._indexStart,c._attributeStart/this.vertexSize))}n.count>0&&(this._finishBatch(s,p,f-p,n,o,a,e,m,x),p=f,++H),this.elementStart=this.elementSize,this._batchIndexStart=p,this._batchIndexSize=f}_finishBatch(e,r,s,n,i,o,a,l,u){e.gpuBindGroup=null,e.bindGroup=null,e.action=l,e.batcher=this,e.textures=n,e.blendMode=i,e.topology=o,e.start=r,e.size=s,e.elements=u,++H,this.batches[this.batchIndex++]=e,a.add(e)}finish(e){this.break(e)}ensureAttributeBuffer(e){e*4<=this.attributeBuffer.size||this._resizeAttributeBuffer(e*4)}ensureIndexBuffer(e){e<=this.indexBuffer.length||this._resizeIndexBuffer(e)}_resizeAttributeBuffer(e){const r=Math.max(e,this.attributeBuffer.size*2),s=new we(r);ke(this.attributeBuffer.rawBinaryData,s.rawBinaryData),this.attributeBuffer=s}_resizeIndexBuffer(e){const r=this.indexBuffer;let s=Math.max(e,r.length*1.5);s+=s%2;const n=s>65535?new Uint32Array(s):new Uint16Array(s);if(n.BYTES_PER_ELEMENT!==r.BYTES_PER_ELEMENT)for(let i=0;i<r.length;i++)n[i]=r[i];else ke(r.buffer,n.buffer);this.indexBuffer=n}packQuadIndex(e,r,s){e[r]=s+0,e[r+1]=s+1,e[r+2]=s+2,e[r+3]=s+0,e[r+4]=s+2,e[r+5]=s+3}packIndex(e,r,s,n){const i=e.indices,o=e.indexSize,a=e.indexOffset,l=e.attributeOffset;for(let u=0;u<o;u++)r[s++]=n+i[u+a]-l}destroy(e={}){if(this.batches!==null){for(let r=0;r<this.batchIndex;r++)Pe(this.batches[r]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,e.shader&&(this.shader?.destroy(),this.shader=null);for(let r=0;r<this._elements.length;r++)this._elements[r]&&(this._elements[r]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};Qe.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6};var er=Qe,tr=new Float32Array(1),rr=new Uint32Array(1),sr=class extends Ft{constructor(){const t=new Se({data:tr,label:"attribute-batch-buffer",usage:Y.VERTEX|Y.COPY_DST,shrinkToFit:!1}),e=new Se({data:rr,label:"index-batch-buffer",usage:Y.INDEX|Y.COPY_DST,shrinkToFit:!1}),r=24;super({attributes:{aPosition:{buffer:t,format:"float32x2",stride:r,offset:0},aUV:{buffer:t,format:"float32x2",stride:r,offset:8},aColor:{buffer:t,format:"unorm8x4",stride:r,offset:16},aTextureIdAndRound:{buffer:t,format:"uint16x2",stride:r,offset:20}},indexBuffer:e})}};function Be(t,e,r){if(t)for(const s in t){const n=e[s.toLocaleLowerCase()];if(n){let i=t[s];s==="header"&&(i=i.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),r&&n.push(`//----${r}----//`),n.push(i)}else B(`${s} placement hook does not exist in shader`)}}var nr=/\{\{(.*?)\}\}/g;function Ae(t){const e={};return(t.match(nr)?.map(r=>r.replace(/[{()}]/g,""))??[]).forEach(r=>{e[r]=[]}),e}function Ge(t,e){let r;const s=/@in\s+([^;]+);/g;for(;(r=s.exec(t))!==null;)e.push(r[1])}function Ue(t,e,r=!1){const s=[];Ge(e,s),t.forEach(a=>{a.header&&Ge(a.header,s)});const n=s;r&&n.sort();const i=n.map((a,l)=>`       @location(${l}) ${a},`).join(`
`);let o=e.replace(/@in\s+[^;]+;\s*/g,"");return o=o.replace("{{in}}",`
${i}
`),o}function Ie(t,e){let r;const s=/@out\s+([^;]+);/g;for(;(r=s.exec(t))!==null;)e.push(r[1])}function ir(t){const e=/\b(\w+)\s*:/g.exec(t);return e?e[1]:""}function ar(t){return t.replace(/@.*?\s+/g,"")}function or(t,e){const r=[];Ie(e,r),t.forEach(l=>{l.header&&Ie(l.header,r)});let s=0;const n=r.sort().map(l=>l.indexOf("builtin")>-1?l:`@location(${s++}) ${l}`).join(`,
`),i=r.sort().map(l=>`       var ${ar(l)};`).join(`
`),o=`return VSOutput(
            ${r.sort().map(l=>` ${ir(l)}`).join(`,
`)});`;let a=e.replace(/@out\s+[^;]+;\s*/g,"");return a=a.replace("{{struct}}",`
${n}
`),a=a.replace("{{start}}",`
${i}
`),a=a.replace("{{return}}",`
${o}
`),a}function Ee(t,e){let r=t;for(const s in e){const n=e[s];n.join(`
`).length?r=r.replace(`{{${s}}}`,`//-----${s} START-----//
${n.join(`
`)}
//----${s} FINISH----//`):r=r.replace(`{{${s}}}`,"")}return r}var k=Object.create(null),te=new Map,lr=0;function ur({template:t,bits:e}){const r=Ze(t,e);if(k[r])return k[r];const{vertex:s,fragment:n}=cr(t,e);return k[r]=et(s,n,e),k[r]}function hr({template:t,bits:e}){const r=Ze(t,e);return k[r]||(k[r]=et(t.vertex,t.fragment,e)),k[r]}function cr(t,e){const r=e.map(o=>o.vertex).filter(o=>!!o),s=e.map(o=>o.fragment).filter(o=>!!o);let n=Ue(r,t.vertex,!0);n=or(r,n);const i=Ue(s,t.fragment,!0);return{vertex:n,fragment:i}}function Ze(t,e){return e.map(r=>(te.has(r)||te.set(r,lr++),te.get(r))).sort((r,s)=>r-s).join("-")+t.vertex+t.fragment}function et(t,e,r){const s=Ae(t),n=Ae(e);return r.forEach(i=>{Be(i.vertex,s,i.name),Be(i.fragment,n,i.name)}),{vertex:Ee(t,s),fragment:Ee(e,n)}}var dr=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,fr=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,pr=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,mr=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,gr={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},_r={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function xr({bits:t,name:e}){const r=ur({template:{fragment:fr,vertex:dr},bits:[gr,...t]});return Ne.from({name:e,vertex:{source:r.vertex,entryPoint:"main"},fragment:{source:r.fragment,entryPoint:"main"}})}function vr({bits:t,name:e}){return new je({name:e,...hr({template:{vertex:pr,fragment:mr},bits:[_r,...t]})})}var br={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},yr={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},re={};function Tr(t){const e=[];if(t===1)e.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),e.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let r=0;for(let s=0;s<t;s++)e.push(`@group(1) @binding(${r++}) var textureSource${s+1}: texture_2d<f32>;`),e.push(`@group(1) @binding(${r++}) var textureSampler${s+1}: sampler;`)}return e.join(`
`)}function Sr(t){const e=[];if(t===1)e.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{e.push("switch vTextureId {");for(let r=0;r<t;r++)r===t-1?e.push("  default:{"):e.push(`  case ${r}:{`),e.push(`      outColor = textureSampleGrad(textureSource${r+1}, textureSampler${r+1}, vUV, uvDx, uvDy);`),e.push("      break;}");e.push("}")}return e.join(`
`)}function Cr(t){return re[t]||(re[t]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${Tr(t)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Sr(t)}
            `}}),re[t]}var se={};function wr(t){const e=[];for(let r=0;r<t;r++)r>0&&e.push("else"),r<t-1&&e.push(`if(vTextureId < ${r}.5)`),e.push("{"),e.push(`	outColor = texture(uTextures[${r}], vUV);`),e.push("}");return e.join(`
`)}function kr(t){return se[t]||(se[t]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${t}];

            `,main:`

                ${wr(t)}
            `}}),se[t]}var Mr={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},Rr={name:"round-pixels-bit",vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},De={};function Pr(t){let e=De[t];if(e)return e;const r=new Int32Array(t);for(let s=0;s<t;s++)r[s]=s;return e=De[t]=new fe({uTextures:{value:r,type:"i32",size:t}},{isStatic:!0}),e}var ze=class extends Ot{constructor(t){const e=vr({name:"batch",bits:[yr,kr(t),Rr]}),r=xr({name:"batch",bits:[br,Cr(t),Mr]});super({glProgram:e,gpuProgram:r,resources:{batchSamplers:Pr(t)}}),this.maxTextures=t}},O=null,tt=class rt extends er{constructor(e){super(e),this.geometry=new sr,this.name=rt.extension.name,this.vertexSize=6,O??(O=new ze(e.maxTextures)),this.shader=O}packAttributes(e,r,s,n,i){const o=i<<16|e.roundPixels&65535,a=e.transform,l=a.a,u=a.b,d=a.c,f=a.d,p=a.tx,m=a.ty,{positions:x,uvs:b}=e,y=e.color,c=e.attributeOffset,_=c+e.attributeSize;for(let g=c;g<_;g++){const T=g*2,C=x[T],j=x[T+1];r[n++]=l*C+d*j+p,r[n++]=f*j+u*C+m,r[n++]=b[T],r[n++]=b[T+1],s[n++]=y,s[n++]=o}}packQuadAttributes(e,r,s,n,i){const o=e.texture,a=e.transform,l=a.a,u=a.b,d=a.c,f=a.d,p=a.tx,m=a.ty,x=e.bounds,b=x.maxX,y=x.minX,c=x.maxY,_=x.minY,g=o.uvs,T=e.color,C=i<<16|e.roundPixels&65535;r[n+0]=l*y+d*_+p,r[n+1]=f*_+u*y+m,r[n+2]=g.x0,r[n+3]=g.y0,s[n+4]=T,s[n+5]=C,r[n+6]=l*b+d*_+p,r[n+7]=f*_+u*b+m,r[n+8]=g.x1,r[n+9]=g.y1,s[n+10]=T,s[n+11]=C,r[n+12]=l*b+d*c+p,r[n+13]=f*c+u*b+m,r[n+14]=g.x2,r[n+15]=g.y2,s[n+16]=T,s[n+17]=C,r[n+18]=l*y+d*c+p,r[n+19]=f*c+u*y+m,r[n+20]=g.x3,r[n+21]=g.y3,s[n+22]=T,s[n+23]=C}_updateMaxTextures(e){this.shader.maxTextures!==e&&(O=new ze(e),this.shader=O)}destroy(){this.shader=null,super.destroy()}};tt.extension={type:[h.Batcher],name:"default"};var st=tt,ns=class{constructor(t){this.items=Object.create(null);const{renderer:e,type:r,onUnload:s,priority:n,name:i}=t;this._renderer=e,e.gc.addResourceHash(this,"items",r,n??0),this._onUnload=s,this.name=i}add(t){return this.items[t.uid]?!1:(this.items[t.uid]=t,t.once("unload",this.remove,this),t._gcLastUsed=this._renderer.gc.now,!0)}remove(t,...e){if(!this.items[t.uid])return;const r=t._gpuData[this._renderer.uid];r&&(this._onUnload?.(t,...e),r.destroy(),t._gpuData[this._renderer.uid]=null,this.items[t.uid]=null)}removeAll(...t){Object.values(this.items).forEach(e=>e&&this.remove(e,...t))}destroy(...t){this.removeAll(...t),this.items=Object.create(null),this._renderer=null,this._onUnload=null}},Br=`in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;
uniform float uChannel;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);

    float a;
    if (uChannel == 1.0) {
        a = masky.a * npmAlpha * clip;
    } else {
        float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);
        a = alphaMul * masky.r * npmAlpha * clip;
    }

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`,Ar=`in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`,He=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
  uChannel:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);

    var a: f32;
    if (filterUniforms.uChannel == 1.0) {
        a = mask.a * uAlpha * clip;
    } else {
        var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);
        a = alphaMul * mask.r * uAlpha * clip;
    }

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`,Gr=class extends It{constructor(t){const{sprite:e,...r}=t,s=new Gt(e.texture),n=new fe({uFilterMatrix:{value:new M,type:"mat3x3<f32>"},uMaskClamp:{value:s.uClampFrame,type:"vec4<f32>"},uAlpha:{value:1,type:"f32"},uInverse:{value:t.inverse?1:0,type:"f32"},uChannel:{value:t.channel==="alpha"?1:0,type:"f32"}}),i=Ne.from({vertex:{source:He,entryPoint:"mainVertex"},fragment:{source:He,entryPoint:"mainFragment"}}),o=je.from({vertex:Ar,fragment:Br,name:"mask-filter"});super({...r,gpuProgram:i,glProgram:o,clipToViewport:!1,resources:{filterUniforms:n,uMaskTexture:e.texture.source}}),this.sprite=e,this._textureMatrix=s}setSprite(t){this.sprite=t;const e=this._getSafeTexture();this._textureMatrix.texture=e,this.resources.uMaskTexture=e.source}set inverse(t){this.resources.filterUniforms.uniforms.uInverse=t?1:0}get inverse(){return this.resources.filterUniforms.uniforms.uInverse===1}set channel(t){this.resources.filterUniforms.uniforms.uChannel=t==="alpha"?1:0}get channel(){return this.resources.filterUniforms.uniforms.uChannel===1?"alpha":"red"}apply(t,e,r,s){const n=this._getSafeTexture();this._textureMatrix.texture=n,t.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=n.source,t.applyFilter(this,e,r,s)}_getSafeTexture(){const t=this.sprite.texture;return t.destroyed||!t.source||t.source.destroyed?(B("[MaskFilter] The mask texture was destroyed while the mask is still in use. Remove the mask before destroying its texture."),S.EMPTY):t}destroy(t=!1){this._textureMatrix.destroy(),super.destroy(t)}};function Ur(t,e,r){const s=(t>>24&255)/255;e[r++]=(t&255)/255*s,e[r++]=(t>>8&255)/255*s,e[r++]=(t>>16&255)/255*s,e[r++]=s}var nt=class{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){this.reset()}},pe=class it{constructor(e,r){this.state=zt.for2d(),this._batchersByInstructionSet=Object.create(null),this._activeBatches=Object.create(null),this.renderer=e,this._adaptor=r,this._adaptor.init?.(this)}static getBatcher(e,r){return new this._availableBatchers[e]({maxTextures:r})}buildStart(e){let r=this._batchersByInstructionSet[e.uid];r||(r=this._batchersByInstructionSet[e.uid]=Object.create(null),r.default||(r.default=new st({maxTextures:this.renderer.limits.maxBatchableTextures}))),this._activeBatches=r,this._activeBatch=this._activeBatches.default;for(const s in this._activeBatches)this._activeBatches[s].begin()}addToBatch(e,r){if(this._activeBatch.name!==e.batcherName){this._activeBatch.break(r);let s=this._activeBatches[e.batcherName];s||(s=this._activeBatches[e.batcherName]=it.getBatcher(e.batcherName,this.renderer.limits.maxBatchableTextures),s.begin()),this._activeBatch=s}this._activeBatch.add(e)}break(e){this._activeBatch.break(e)}buildEnd(e){this._activeBatch.break(e);const r=this._activeBatches;for(const s in r){const n=r[s],i=n.geometry;i.indexBuffer.setDataWithSize(n.indexBuffer,n.indexSize,!0),i.buffers[0].setDataWithSize(n.attributeBuffer.float32View,n.attributeSize,!1)}}upload(e){const r=this._batchersByInstructionSet[e.uid];for(const s in r){const n=r[s],i=n.geometry;n.dirty&&(n.dirty=!1,i.buffers[0].update(n.attributeSize*4))}}execute(e){if(e.action==="startBatch"){const r=e.batcher,s=r.geometry,n=r.shader;this._adaptor.start(this,s,n)}this._adaptor.execute(this,e)}destroy(){this.state=null,this.renderer=null,this._adaptor=null;for(const e in this._activeBatches)this._activeBatches[e].destroy();this._activeBatches=null}};pe.extension={type:[h.WebGLPipes,h.WebGPUPipes,h.CanvasPipes],name:"batch"};pe._availableBatchers=Object.create(null);var at=pe;ee.handleByMap(h.Batcher,at._availableBatchers);ee.add(st);var Ir=new ue,Er=class extends Ve{constructor(){super(),this._placeholderSprite=new Vt(S.EMPTY),this.filters=[new Gr({sprite:this._placeholderSprite,inverse:!1,resolution:"inherit",antialias:"inherit"})]}get sprite(){return this.filters[0].sprite}set sprite(t){this.filters[0].setSprite(t)}get inverse(){return this.filters[0].inverse}set inverse(t){this.filters[0].inverse=t}get channel(){return this.filters[0].channel}set channel(t){this.filters[0].channel=t}reset(){this._placeholderSprite.texture=S.EMPTY,this.sprite=this._placeholderSprite}},ot=class{constructor(t){this._activeMaskStage=[],this._usedEffects=[],this._renderer=t,t.runners.postrender.add(this)}push(t,e,r){const s=this._renderer;if(s.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskBegin",mask:t,inverse:e._maskOptions.inverse,canBundle:!1,maskedContainer:e}),t.inverse=e._maskOptions.inverse,t.channel=e._maskOptions.channel??"red",t.renderMaskToTexture){const n=t.mask;n.includeInBuild=!0,n.collectRenderables(r,s,null),n.includeInBuild=!1}s.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskEnd",mask:t,maskedContainer:e,inverse:e._maskOptions.inverse,canBundle:!1})}pop(t,e,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"popMaskEnd",mask:t,inverse:e._maskOptions.inverse,canBundle:!1})}execute(t){const e=this._renderer,r=t.mask.renderMaskToTexture;if(t.action==="pushMaskBegin"){const s=X.get(Er);if(s.inverse=t.inverse,s.channel=t.mask.channel,r){t.mask.mask.measurable=!0;const n=Et(t.mask.mask,!0,Ir);t.mask.mask.measurable=!1,n.ceil();const i=e.renderTarget.renderTarget.colorTexture.source,o=V.getOptimalTexture(n.width,n.height,i._resolution,i.antialias);e.renderTarget.push({target:o,clear:!0}),e.globalUniforms.push({offset:n,worldColor:4294967295});const a=s.sprite;a.texture=o,a.worldTransform.tx=n.minX,a.worldTransform.ty=n.minY,this._activeMaskStage.push({filterEffect:s,maskedContainer:t.maskedContainer,filterTexture:o})}else s.sprite=t.mask.mask,this._activeMaskStage.push({filterEffect:s,maskedContainer:t.maskedContainer})}else if(t.action==="pushMaskEnd"){const s=this._activeMaskStage[this._activeMaskStage.length-1];r&&(e.type===Z.WEBGL&&e.renderTarget.finishRenderPass(),e.renderTarget.pop(),e.globalUniforms.pop()),e.filter.push({renderPipeId:"filter",action:"pushFilter",container:s.maskedContainer,filterEffect:s.filterEffect,canBundle:!1})}else if(t.action==="popMaskEnd"){e.filter.pop();const s=this._activeMaskStage.pop();r&&V.returnTexture(s.filterTexture),this._usedEffects.push(s.filterEffect)}}postrender(){const t=this._usedEffects;for(let e=0;e<t.length;e++)X.return(t[e]);t.length=0}destroy(){this.postrender(),this._renderer.runners.postrender.remove(this),this._renderer=null,this._activeMaskStage=null,this._usedEffects=null}};ot.extension={type:[h.WebGLPipes,h.WebGPUPipes,h.CanvasPipes],name:"alphaMask"};var lt=class{constructor(t){this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=t}buildStart(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}push(t,e,r){this._renderer.renderPipes.batch.break(r);const s=this._colorStack;s[this._colorStackIndex]=s[this._colorStackIndex-1]&t.mask;const n=this._colorStack[this._colorStackIndex];n!==this._currentColor&&(this._currentColor=n,r.add({renderPipeId:"colorMask",colorMask:n,canBundle:!1})),this._colorStackIndex++}pop(t,e,r){this._renderer.renderPipes.batch.break(r);const s=this._colorStack;this._colorStackIndex--;const n=s[this._colorStackIndex-1];n!==this._currentColor&&(this._currentColor=n,r.add({renderPipeId:"colorMask",colorMask:n,canBundle:!1}))}execute(t){this._renderer.colorMask.setMask(t.colorMask)}destroy(){this._renderer=null,this._colorStack=null}};lt.extension={type:[h.WebGLPipes,h.WebGPUPipes],name:"colorMask"};var ut=class{constructor(t){this._maskStackHash={},this._maskHash=new WeakMap,this._renderer=t}push(t,e,r){var s;const n=t,i=this._renderer;i.renderPipes.batch.break(r),i.renderPipes.blendMode.setBlendMode(n.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"pushMaskBegin",mask:t,inverse:e._maskOptions.inverse,canBundle:!1});const o=n.mask;o.includeInBuild=!0,this._maskHash.has(n)||this._maskHash.set(n,{instructionsStart:0,instructionsLength:0});const a=this._maskHash.get(n);a.instructionsStart=r.instructionSize,o.collectRenderables(r,i,null),o.includeInBuild=!1,i.renderPipes.batch.break(r),r.add({renderPipeId:"stencilMask",action:"pushMaskEnd",mask:t,inverse:e._maskOptions.inverse,canBundle:!1}),a.instructionsLength=r.instructionSize-a.instructionsStart-1;const l=i.renderTarget.renderTarget.uid;(s=this._maskStackHash)[l]??(s[l]=0)}pop(t,e,r){const s=t,n=this._renderer;n.renderPipes.batch.break(r),n.renderPipes.blendMode.setBlendMode(s.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"popMaskBegin",inverse:e._maskOptions.inverse,canBundle:!1});const i=this._maskHash.get(t);for(let o=0;o<i.instructionsLength;o++)r.instructions[r.instructionSize++]=r.instructions[i.instructionsStart++];r.add({renderPipeId:"stencilMask",action:"popMaskEnd",canBundle:!1})}execute(t){var e;const r=this._renderer,s=r,n=r.renderTarget.renderTarget.uid;let i=(e=this._maskStackHash)[n]??(e[n]=0);t.action==="pushMaskBegin"?(s.renderTarget.ensureDepthStencil(),s.stencil.setStencilMode(w.RENDERING_MASK_ADD,i),i++,s.colorMask.setMask(0)):t.action==="pushMaskEnd"?(t.inverse?s.stencil.setStencilMode(w.INVERSE_MASK_ACTIVE,i):s.stencil.setStencilMode(w.MASK_ACTIVE,i),s.colorMask.setMask(15)):t.action==="popMaskBegin"?(s.colorMask.setMask(0),i!==0?s.stencil.setStencilMode(w.RENDERING_MASK_REMOVE,i):(s.renderTarget.clear(null,D.STENCIL),s.stencil.setStencilMode(w.DISABLED,i)),i--):t.action==="popMaskEnd"&&(t.inverse?s.stencil.setStencilMode(w.INVERSE_MASK_ACTIVE,i):s.stencil.setStencilMode(w.MASK_ACTIVE,i),s.colorMask.setMask(15)),this._maskStackHash[n]=i}destroy(){this._renderer=null,this._maskStackHash=null,this._maskHash=null}};ut.extension={type:[h.WebGLPipes,h.WebGPUPipes],name:"stencilMask"};var ht=class{constructor(t){this._renderer=t}updateRenderable(){}destroyRenderable(){}validateRenderable(){return!1}addRenderable(t,e){this._renderer.renderPipes.batch.break(e),e.add(t)}execute(t){t.isRenderable&&t.render(this._renderer)}destroy(){this._renderer=null}};ht.extension={type:[h.WebGLPipes,h.WebGPUPipes,h.CanvasPipes],name:"customRender"};function oe(t,e){const r=t.instructionSet,s=r.instructions;for(let n=0;n<r.instructionSize;n++){const i=s[n];e[i.renderPipeId].execute(i)}}var ct=class{constructor(t){this._renderer=t}addRenderGroup(t,e){t.isCachedAsTexture?this._addRenderableCacheAsTexture(t,e):this._addRenderableDirect(t,e)}execute(t){t.isRenderable&&(t.isCachedAsTexture?this._executeCacheAsTexture(t):this._executeDirect(t))}destroy(){this._renderer=null}_addRenderableDirect(t,e){this._renderer.renderPipes.batch.break(e),t._batchableRenderGroup&&(X.return(t._batchableRenderGroup),t._batchableRenderGroup=null),e.add(t)}_addRenderableCacheAsTexture(t,e){const r=t._batchableRenderGroup??(t._batchableRenderGroup=X.get(nt));r.renderable=t.root,r.transform=t.root.relativeGroupTransform,r.texture=t.texture,r.bounds=t._textureBounds,e.add(t),this._renderer.renderPipes.blendMode.pushBlendMode(t,t.root.groupBlendMode,e),this._renderer.renderPipes.batch.addToBatch(r,e),this._renderer.renderPipes.blendMode.popBlendMode(e)}_executeCacheAsTexture(t){if(t.textureNeedsUpdate){t.textureNeedsUpdate=!1;const e=new M().translate(-t._textureBounds.x,-t._textureBounds.y);this._renderer.renderTarget.push({target:t.texture,clear:!0,frame:t.texture.frame}),this._renderer.globalUniforms.push({worldTransformMatrix:e,worldColor:4294967295,offset:{x:0,y:0}}),oe(t,this._renderer.renderPipes),this._renderer.renderTarget.finishRenderPass(),this._renderer.renderTarget.pop(),this._renderer.globalUniforms.pop()}t._batchableRenderGroup._batcher.updateElement(t._batchableRenderGroup),t._batchableRenderGroup._batcher.geometry.buffers[0].update()}_executeDirect(t){this._renderer.globalUniforms.push({worldTransformMatrix:t.inverseParentTextureTransform,worldColor:t.worldColorAlpha}),oe(t,this._renderer.renderPipes),this._renderer.globalUniforms.pop()}};ct.extension={type:[h.WebGLPipes,h.WebGPUPipes,h.CanvasPipes],name:"renderGroup"};var dt=class{constructor(t){this._renderer=t}addRenderable(t,e){const r=this._getGpuSprite(t);t.didViewUpdate&&this._updateBatchableSprite(t,r),this._renderer.renderPipes.batch.addToBatch(r,e)}updateRenderable(t){const e=this._getGpuSprite(t);t.didViewUpdate&&this._updateBatchableSprite(t,e),e._batcher.updateElement(e)}validateRenderable(t){const e=this._getGpuSprite(t);return!e._batcher.checkAndUpdateTexture(e,t._texture)}_updateBatchableSprite(t,e){e.bounds=t.visualBounds,e.texture=t._texture}_getGpuSprite(t){return t._gpuData[this._renderer.uid]||this._initGPUSprite(t)}_initGPUSprite(t){const e=new nt;return e.renderable=t,e.transform=t.groupTransform,e.texture=t._texture,e.bounds=t.visualBounds,e.roundPixels=this._renderer._roundPixels|t._roundPixels,t._gpuData[this._renderer.uid]=e,e}destroy(){this._renderer=null}};dt.extension={type:[h.WebGLPipes,h.WebGPUPipes,h.CanvasPipes],name:"sprite"};var N={};ee.handle(h.BlendMode,t=>{if(!t.name)throw new Error("BlendMode extension must have a name property");N[t.name]=t.ref},t=>{delete N[t.name]});var ft=class{constructor(t){this._blendModeStack=[],this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=t,this._renderer.runners.prerender.add(this)}prerender(){this._activeBlendMode="normal",this._isAdvanced=!1}pushBlendMode(t,e,r){this._blendModeStack.push(e),this.setBlendMode(t,e,r)}popBlendMode(t){this._blendModeStack.pop();const e=this._blendModeStack[this._activeBlendMode.length-1]??"normal";this.setBlendMode(null,e,t)}setBlendMode(t,e,r){const s=t instanceof Ce;if(this._activeBlendMode===e){this._isAdvanced&&t&&!s&&this._renderableList?.push(t);return}this._isAdvanced&&this._endAdvancedBlendMode(r),this._activeBlendMode=e,t&&(this._isAdvanced=!!N[e],this._isAdvanced&&this._beginAdvancedBlendMode(t,r))}_beginAdvancedBlendMode(t,e){this._renderer.renderPipes.batch.break(e);const r=this._activeBlendMode;if(!N[r]){B(`Unable to assign BlendMode: '${r}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);return}const s=this._ensureFilterEffect(r),n=t instanceof Ce,i={renderPipeId:"filter",action:"pushFilter",filterEffect:s,renderables:n?null:[t],container:n?t.root:null,canBundle:!1};this._renderableList=i.renderables,e.add(i)}_ensureFilterEffect(t){let e=this._filterHash[t];return e||(e=this._filterHash[t]=new Ve,e.filters=[new N[t]]),e}_endAdvancedBlendMode(t){this._isAdvanced=!1,this._renderableList=null,this._renderer.renderPipes.batch.break(t),t.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}buildStart(){this._isAdvanced=!1}buildEnd(t){this._isAdvanced&&this._endAdvancedBlendMode(t)}destroy(){this._renderer=null,this._renderableList=null;for(const t in this._filterHash)this._filterHash[t].destroy();this._filterHash=null}};ft.extension={type:[h.WebGLPipes,h.WebGPUPipes,h.CanvasPipes],name:"blendMode"};function le(t,e){e||(e=0);for(let r=e;r<t.length&&t[r];r++)t[r]=null}var Dr=new $,Oe=7;function pt(t,e=!1){zr(t);const r=t.childrenToUpdate,s=t.updateTick++;for(const n in r){const i=Number(n),o=r[n],a=o.list,l=o.index;for(let u=0;u<l;u++){const d=a[u];d.parentRenderGroup===t&&d.relativeRenderGroupDepth===i&&mt(d,s,0)}le(a,l),o.index=0}if(e)for(let n=0;n<t.renderGroupChildren.length;n++)pt(t.renderGroupChildren[n],e)}function zr(t){const e=t.root;let r;if(t.renderGroupParent){const s=t.renderGroupParent;t.worldTransform.appendFrom(e.relativeGroupTransform,s.worldTransform),t.worldColor=$e(e.groupColor,s.worldColor),r=e.groupAlpha*s.worldAlpha}else t.worldTransform.copyFrom(e.localTransform),t.worldColor=e.localColor,r=e.localAlpha;r=r<0?0:r>1?1:r,t.worldAlpha=r,t.worldColorAlpha=t.worldColor+((r*255|0)<<24)}function mt(t,e,r){if(e===t.updateTick)return;t.updateTick=e,t.didChange=!1;const s=t.localTransform;t.updateLocalTransform();const n=t.parent;if(n&&!n.renderGroup?(r|=t._updateFlags,t.relativeGroupTransform.appendFrom(s,n.relativeGroupTransform),r&Oe&&Fe(t,n,r)):(r=t._updateFlags,t.relativeGroupTransform.copyFrom(s),r&Oe&&Fe(t,Dr,r)),!t.renderGroup){const i=t.children,o=i.length;for(let u=0;u<o;u++)mt(i[u],e,r);const a=t.parentRenderGroup,l=t;l.renderPipeId&&!a.structureDidChange&&a.updateRenderable(l)}}function Fe(t,e,r){if(r&1){t.groupColor=$e(t.localColor,e.groupColor);let s=t.localAlpha*e.groupAlpha;s=s<0?0:s>1?1:s,t.groupAlpha=s,t.groupColorAlpha=t.groupColor+((s*255|0)<<24)}r&2&&(t.groupBlendMode=t.localBlendMode==="inherit"?e.groupBlendMode:t.localBlendMode),r&4&&(t.globalDisplayStatus=t.localDisplayStatus&e.globalDisplayStatus),t._updateFlags=0}function Hr(t,e){const{list:r}=t.childrenRenderablesToUpdate;let s=!1;for(let n=0;n<t.childrenRenderablesToUpdate.index;n++){const i=r[n];if(s=e[i.renderPipeId].validateRenderable(i),s)break}return t.structureDidChange=s,s}var Or=new M,gt=class{constructor(t){this._renderer=t}render({container:t,transform:e}){const r=t.parent,s=t.renderGroup.renderGroupParent;t.parent=null,t.renderGroup.renderGroupParent=null;const n=this._renderer,i=Or;e&&(i.copyFrom(t.renderGroup.localTransform),t.renderGroup.localTransform.copyFrom(e));const o=n.renderPipes;this._updateCachedRenderGroups(t.renderGroup,null),this._updateRenderGroups(t.renderGroup),n.globalUniforms.start({worldTransformMatrix:e?t.renderGroup.localTransform:t.renderGroup.worldTransform,worldColor:t.renderGroup.worldColorAlpha}),oe(t.renderGroup,o),o.uniformBatch&&o.uniformBatch.renderEnd(),e&&t.renderGroup.localTransform.copyFrom(i),t.parent=r,t.renderGroup.renderGroupParent=s}destroy(){this._renderer=null}_updateCachedRenderGroups(t,e){if(t._parentCacheAsTextureRenderGroup=e,t.isCachedAsTexture){if(!t.textureNeedsUpdate)return;e=t}for(let r=t.renderGroupChildren.length-1;r>=0;r--)this._updateCachedRenderGroups(t.renderGroupChildren[r],e);if(t.invalidateMatrices(),t.isCachedAsTexture){if(t.textureNeedsUpdate){const r=t.root.getLocalBounds(),s=this._renderer,n=t.textureOptions.resolution||s.view.resolution,i=t.textureOptions.antialias??s.view.antialias,o=t.textureOptions.scaleMode??"linear",a=t.texture;r.ceil(),t.texture&&V.returnTexture(t.texture,!0);const l=V.getOptimalTexture(r.width,r.height,n,i);l._source.style=new At({scaleMode:o}),t.texture=l,t._textureBounds||(t._textureBounds=new ue),t._textureBounds.copyFrom(r),a!==t.texture&&t.renderGroupParent&&(t.renderGroupParent.structureDidChange=!0)}}else t.texture&&(V.returnTexture(t.texture,!0),t.texture=null)}_updateRenderGroups(t){const e=this._renderer,r=e.renderPipes;if(t.runOnRender(e),t.instructionSet.renderPipes=r,t.structureDidChange?le(t.childrenRenderablesToUpdate.list,0):Hr(t,r),pt(t),t.structureDidChange?(t.structureDidChange=!1,this._buildInstructions(t,e)):this._updateRenderables(t),t.childrenRenderablesToUpdate.index=0,e.renderPipes.batch.upload(t.instructionSet),!(t.isCachedAsTexture&&!t.textureNeedsUpdate))for(let s=0;s<t.renderGroupChildren.length;s++)this._updateRenderGroups(t.renderGroupChildren[s])}_updateRenderables(t){const{list:e,index:r}=t.childrenRenderablesToUpdate;for(let s=0;s<r;s++){const n=e[s];n.didViewUpdate&&t.updateRenderable(n)}le(e,r)}_buildInstructions(t,e){const r=t.root,s=t.instructionSet;s.reset();const n=e.renderPipes?e:e.batch.renderer,i=n.renderPipes;i.batch.buildStart(s),i.blendMode.buildStart(),i.colorMask.buildStart(),r.sortableChildren&&r.sortChildren(),r.collectRenderablesWithEffects(s,n,null),i.batch.buildEnd(s),i.blendMode.buildEnd(s)}};gt.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"renderGroup"};var me=class _t{constructor(){this.clearBeforeRender=!0,this._backgroundColor=new E(0),this.color=this._backgroundColor,this.alpha=1}init(e){e={..._t.defaultOptions,...e},this.clearBeforeRender=e.clearBeforeRender,this.color=e.background||e.backgroundColor||this._backgroundColor,this.alpha=e.backgroundAlpha,this._backgroundColor.setAlpha(e.backgroundAlpha)}get color(){return this._backgroundColor}set color(e){E.shared.setValue(e).alpha<1&&this._backgroundColor.alpha===1&&B("Cannot set a transparent background on an opaque canvas. To enable transparency, set backgroundAlpha < 1 when initializing your Application."),this._backgroundColor.setValue(e)}get alpha(){return this._backgroundColor.alpha}set alpha(e){this._backgroundColor.setAlpha(e)}get colorRgba(){return this._backgroundColor.toArray()}destroy(){}};me.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"background",priority:0};me.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};var Fr=me,ne={png:"image/png",jpg:"image/jpeg",webp:"image/webp"},ge=class xt{constructor(e){this._renderer=e}_normalizeOptions(e,r={}){return e instanceof $||e instanceof S?{target:e,...r}:{...r,...e}}async image(e){const r=de.get().createImage();return r.src=await this.base64(e),r}async base64(e){e=this._normalizeOptions(e,xt.defaultImageOptions);const{format:r,quality:s}=e,n=this.canvas(e);if(n.toBlob!==void 0)return new Promise((i,o)=>{n.toBlob(a=>{if(!a){o(new Error("ICanvas.toBlob failed!"));return}const l=new FileReader;l.onload=()=>i(l.result),l.onerror=o,l.readAsDataURL(a)},ne[r],s)});if(n.toDataURL!==void 0)return n.toDataURL(ne[r],s);if(n.convertToBlob!==void 0){const i=await n.convertToBlob({type:ne[r],quality:s});return new Promise((o,a)=>{const l=new FileReader;l.onload=()=>o(l.result),l.onerror=a,l.readAsDataURL(i)})}throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")}canvas(e){e=this._normalizeOptions(e);const r=e.target,s=this._renderer;if(r instanceof S)return s.texture.generateCanvas(r);const n=s.textureGenerator.generateTexture(e),i=s.texture.generateCanvas(n);return n.destroy(!0),i}pixels(e){e=this._normalizeOptions(e);const r=e.target,s=this._renderer,n=r instanceof S?r:s.textureGenerator.generateTexture(e),i=s.texture.getPixels(n);return r instanceof $&&n.destroy(!0),i}texture(e){return e=this._normalizeOptions(e),e.target instanceof S?e.target:this._renderer.textureGenerator.generateTexture(e)}download(e){e=this._normalizeOptions(e);const r=this.canvas(e),s=document.createElement("a");s.download=e.filename??"image.png",s.href=r.toDataURL("image/png"),document.body.appendChild(s),s.click(),document.body.removeChild(s)}log(e){const r=e.width??200;e=this._normalizeOptions(e);const s=this.canvas(e),n=s.toDataURL();console.log(`[Pixi Texture] ${s.width}px ${s.height}px`);const i=["font-size: 1px;",`padding: ${r}px 300px;`,`background: url(${n}) no-repeat;`,"background-size: contain;"].join(" ");console.log("%c ",i)}destroy(){this._renderer=null}};ge.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"extract"};ge.defaultImageOptions={format:"png",quality:1};var Lr=ge,Vr=class vt extends S{static create(e){const{dynamic:r,textureOptions:s,...n}=e;return new vt({...s,source:new L(n),dynamic:r??!1})}resize(e,r,s){return this.source.resize(e,r,s),this}},Wr=new F,Nr=new ue,$r=[0,0,0,0],bt=class{constructor(t){this._renderer=t}generateTexture(t){t instanceof $&&(t={target:t,frame:void 0,textureSourceOptions:{},resolution:void 0});const e=t.resolution||this._renderer.resolution,r=t.antialias||this._renderer.view.antialias,s=t.target;let n=t.clearColor;n?n=Array.isArray(n)&&n.length===4?n:E.shared.setValue(n).toArray():n=$r;const i=t.frame?.copyTo(Wr)||Bt(s,Nr).rectangle,o=t.defaultAnchor&&{defaultAnchor:t.defaultAnchor};i.width=Math.max(i.width,1/e)|0,i.height=Math.max(i.height,1/e)|0;const a=Vr.create({...t.textureSourceOptions,width:i.width,height:i.height,resolution:e,antialias:r,textureOptions:o}),l=M.shared.translate(-i.x,-i.y);return this._renderer.render({container:s,transform:l,target:a,clearColor:n}),a.source.updateMipmaps(),a}destroy(){this._renderer=null}};bt.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"textureGenerator"};function jr(t){let e=!1;for(const s in t)if(t[s]==null){e=!0;break}if(!e)return t;const r=Object.create(null);for(const s in t){const n=t[s];n&&(r[s]=n)}return r}function Yr(t){let e=0;for(let r=0;r<t.length;r++)t[r]==null?e++:t[r-e]=t[r];return t.length-=e,t}var _e=class yt{constructor(e){this._managedResources=[],this._managedResourceHashes=[],this._managedCollections=[],this._ready=!1,this._renderer=e}init(e){e={...yt.defaultOptions,...e},this.maxUnusedTime=e.gcMaxUnusedTime,this._frequency=e.gcFrequency,this.enabled=e.gcActive,this.now=performance.now()}get enabled(){return!!this._handler}set enabled(e){this.enabled!==e&&(e?(this._handler=this._renderer.scheduler.repeat(()=>{this._ready=!0},this._frequency,!1),this._collectionsHandler=this._renderer.scheduler.repeat(()=>{for(const r of this._managedCollections){const{context:s,collection:n,type:i}=r;i==="hash"?s[n]=jr(s[n]):s[n]=Yr(s[n])}},this._frequency)):(this._renderer.scheduler.cancel(this._handler),this._renderer.scheduler.cancel(this._collectionsHandler),this._handler=0,this._collectionsHandler=0))}prerender({container:e}){this.now=performance.now(),e.renderGroup.gcTick=this._renderer.tick++,this._updateInstructionGCTick(e.renderGroup,e.renderGroup.gcTick)}postrender(){!this._ready||!this.enabled||(this.run(),this._ready=!1)}_updateInstructionGCTick(e,r){e.instructionSet.gcTick=r,e.gcTick=r;for(const s of e.renderGroupChildren)this._updateInstructionGCTick(s,r)}addCollection(e,r,s){this._managedCollections.push({context:e,collection:r,type:s})}addResource(e,r){if(e._gcLastUsed!==-1){e._gcLastUsed=this.now,e._onTouch?.(this.now);return}e._gcData={index:this._managedResources.length,type:r},e._gcLastUsed=this.now,e._onTouch?.(this.now),e.once("unload",this.removeResource,this),this._managedResources.push(e)}removeResource(e){const r=e._gcData;if(!r)return;const s=r.index,n=this._managedResources.length-1;if(s!==n){const i=this._managedResources[n];this._managedResources[s]=i,i._gcData.index=s}this._managedResources.length--,e._gcData=null,e._gcLastUsed=-1}addResourceHash(e,r,s,n=0){this._managedResourceHashes.push({context:e,hash:r,type:s,priority:n}),this._managedResourceHashes.sort((i,o)=>i.priority-o.priority)}run(){const e=performance.now(),r=this._managedResourceHashes;for(const n of r)this.runOnHash(n,e);let s=0;for(let n=0;n<this._managedResources.length;n++){const i=this._managedResources[n];s=this.runOnResource(i,e,s)}this._managedResources.length=s}updateRenderableGCTick(e,r){const s=e.renderGroup??e.parentRenderGroup,n=s?.instructionSet?.gcTick??-1;(s?.gcTick??0)===n&&(e._gcLastUsed=r,e._onTouch?.(r))}runOnResource(e,r,s){const n=e._gcData;return n.type==="renderable"&&this.updateRenderableGCTick(e,r),r-e._gcLastUsed<this.maxUnusedTime||!e.autoGarbageCollect?(this._managedResources[s]=e,n.index=s,s++):(e.unload(),e._gcData=null,e._gcLastUsed=-1,e.off("unload",this.removeResource,this)),s}_createHashClone(e,r){const s=Object.create(null);for(const n in e){if(n===r)break;e[n]!==null&&(s[n]=e[n])}return s}runOnHash(e,r){const{context:s,hash:n,type:i}=e,o=s[n];let a=null,l=0;for(const u in o){const d=o[u];if(d===null){l++,l===1e4&&!a&&(a=this._createHashClone(o,u));continue}if(d._gcLastUsed===-1){d._gcLastUsed=r,d._onTouch?.(r),a&&(a[u]=d);continue}if(i==="renderable"&&this.updateRenderableGCTick(d,r),!(r-d._gcLastUsed<this.maxUnusedTime)&&d.autoGarbageCollect){if(i==="renderable"){const f=d,p=f.renderGroup??f.parentRenderGroup;p&&(p.structureDidChange=!0)}d.unload(),d._gcData=null,d._gcLastUsed=-1,a||(l+1!==1e4?(o[u]=null,l++):a=this._createHashClone(o,u))}else a&&(a[u]=d)}a&&(s[n]=a)}destroy(){this.enabled=!1,this._managedResources.forEach(e=>{e.off("unload",this.removeResource,this)}),this._managedResources.length=0,this._managedResourceHashes.length=0,this._managedCollections.length=0,this._renderer=null}};_e.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"gc",priority:0};_e.defaultOptions={gcActive:!0,gcMaxUnusedTime:6e4,gcFrequency:3e4};var Kr=_e,Tt=class{constructor(t){this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=t}reset(){this._stackIndex=0;for(let t=0;t<this._activeUniforms.length;t++)this._uniformsPool.push(this._activeUniforms[t]);for(let t=0;t<this._activeBindGroups.length;t++)this._bindGroupPool.push(this._activeBindGroups[t]);this._activeUniforms.length=0,this._activeBindGroups.length=0}start(t){this.reset(),this.push(t)}bind({size:t,projectionMatrix:e,worldTransformMatrix:r,worldColor:s,offset:n}){const i=this._renderer.renderTarget.renderTarget,o=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{projectionData:i,worldTransformMatrix:new M,worldColor:4294967295,offset:new Dt},a={projectionMatrix:e||this._renderer.renderTarget.projectionMatrix,resolution:t||i.size,worldTransformMatrix:r||o.worldTransformMatrix,worldColor:s||o.worldColor,offset:n||o.offset,bindGroup:null},l=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(l);const u=l.uniforms;u.uProjectionMatrix=a.projectionMatrix,u.uResolution=a.resolution,u.uWorldTransformMatrix.copyFrom(a.worldTransformMatrix),u.uWorldTransformMatrix.tx-=a.offset.x,u.uWorldTransformMatrix.ty-=a.offset.y,Ur(a.worldColor,u.uWorldColorAlpha,0),l.update();let d;this._renderer.renderPipes.uniformBatch?d=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(l,!1):(d=this._bindGroupPool.pop()||new Lt,this._activeBindGroups.push(d),d.setResource(l,0)),a.bindGroup=d,this._currentGlobalUniformData=a}push(t){this.bind(t),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}pop(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===Z.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}get bindGroup(){return this._currentGlobalUniformData.bindGroup}get globalUniformData(){return this._currentGlobalUniformData}get uniformGroup(){return this._currentGlobalUniformData.bindGroup.resources[0]}_createUniforms(){return new fe({uProjectionMatrix:{value:new M,type:"mat3x3<f32>"},uWorldTransformMatrix:{value:new M,type:"mat3x3<f32>"},uWorldColorAlpha:{value:new Float32Array(4),type:"vec4<f32>"},uResolution:{value:[0,0],type:"vec2<f32>"}},{isStatic:!0})}destroy(){this._renderer=null,this._globalUniformDataStack.length=0,this._uniformsPool.length=0,this._activeUniforms.length=0,this._bindGroupPool.length=0,this._activeBindGroups.length=0,this._currentGlobalUniformData=null}};Tt.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"globalUniforms"};var qr=1,St=class{constructor(){this._tasks=[],this._offset=0}init(){Te.system.add(this._update,this)}repeat(t,e,r=!0){const s=qr++;let n=0;return r&&(this._offset+=1e3,n=this._offset),this._tasks.push({func:t,duration:e,start:performance.now(),offset:n,last:performance.now(),repeat:!0,id:s}),s}cancel(t){for(let e=0;e<this._tasks.length;e++)if(this._tasks[e].id===t){this._tasks.splice(e,1);return}}_update(){const t=performance.now();for(let e=0;e<this._tasks.length;e++){const r=this._tasks[e];if(t-r.offset-r.last>=r.duration){const s=t-r.start;r.func(s),r.last=t}}}destroy(){Te.system.remove(this._update,this),this._tasks.length=0}};St.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"scheduler",priority:0};var Le=!1;function Xr(t){if(!Le){if(de.get().getNavigator().userAgent.toLowerCase().indexOf("chrome")>-1){const e=[`%c  %c  %c  %c  %c PixiJS %c v${Q} (${t}) http://www.pixijs.com/

`,"background: #E72264; padding:5px 0;","background: #6CA2EA; padding:5px 0;","background: #B5D33D; padding:5px 0;","background: #FED23F; padding:5px 0;","color: #FFFFFF; background: #E72264; padding:5px 0;","color: #E72264; background: #FFFFFF; padding:5px 0;"];globalThis.console.log(...e)}else globalThis.console&&globalThis.console.log(`PixiJS ${Q} - ${t} - http://www.pixijs.com/`);Le=!0}}var xe=class{constructor(t){this._renderer=t}init(t){if(t.hello){let e=this._renderer.name;this._renderer.type===Z.WEBGL&&(e+=` ${this._renderer.context.webGLVersion}`),Xr(e)}}};xe.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"hello",priority:-2};xe.defaultOptions={hello:!1};var ve=class Ct{constructor(e){this._renderer=e}init(e){e={...Ct.defaultOptions,...e},this.maxUnusedTime=e.renderableGCMaxUnusedTime}get enabled(){return v("8.15.0","RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."),this._renderer.gc.enabled}set enabled(e){v("8.15.0","RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead."),this._renderer.gc.enabled=e}addManagedHash(e,r){v("8.15.0","RenderableGCSystem.addManagedHash is deprecated, please use the GCSystem.addCollection instead."),this._renderer.gc.addCollection(e,r,"hash")}addManagedArray(e,r){v("8.15.0","RenderableGCSystem.addManagedArray is deprecated, please use the GCSystem.addCollection instead."),this._renderer.gc.addCollection(e,r,"array")}addRenderable(e){v("8.15.0","RenderableGCSystem.addRenderable is deprecated, please use the GCSystem instead."),this._renderer.gc.addResource(e,"renderable")}run(){v("8.15.0","RenderableGCSystem.run is deprecated, please use the GCSystem instead."),this._renderer.gc.run()}destroy(){this._renderer=null}};ve.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"renderableGC",priority:0};ve.defaultOptions={renderableGCActive:!0,renderableGCMaxUnusedTime:6e4,renderableGCFrequency:3e4};var Qr=ve,be=class K{get count(){return this._renderer.tick}get checkCount(){return this._checkCount}set checkCount(e){v("8.15.0","TextureGCSystem.run is deprecated, please use the GCSystem instead."),this._checkCount=e}get maxIdle(){return this._renderer.gc.maxUnusedTime/1e3*60}set maxIdle(e){v("8.15.0","TextureGCSystem.run is deprecated, please use the GCSystem instead."),this._renderer.gc.maxUnusedTime=e/60*1e3}get checkCountMax(){return Math.floor(this._renderer.gc._frequency/1e3)}set checkCountMax(e){v("8.15.0","TextureGCSystem.run is deprecated, please use the GCSystem instead.")}get active(){return this._renderer.gc.enabled}set active(e){v("8.15.0","TextureGCSystem.run is deprecated, please use the GCSystem instead."),this._renderer.gc.enabled=e}constructor(e){this._renderer=e,this._checkCount=0}init(e){e.textureGCActive!==K.defaultOptions.textureGCActive&&(this.active=e.textureGCActive),e.textureGCMaxIdle!==K.defaultOptions.textureGCMaxIdle&&(this.maxIdle=e.textureGCMaxIdle),e.textureGCCheckCountMax!==K.defaultOptions.textureGCCheckCountMax&&(this.checkCountMax=e.textureGCCheckCountMax)}run(){v("8.15.0","TextureGCSystem.run is deprecated, please use the GCSystem instead."),this._renderer.gc.run()}destroy(){this._renderer=null}};be.extension={type:[h.WebGLSystem,h.WebGPUSystem],name:"textureGC"};be.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:null,textureGCMaxIdle:3600,textureGCCheckCountMax:600};var Jr=be,wt=class kt{constructor(e={}){this.uid=ce("renderTarget"),this.colorAttachments=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),this._managedColorTextures=!1,this._depth=!1,this._stencil=!1,this._colorTextures=null;const r="colorAttachments"in e?e:this._normalizeOptions(e);if(this.isRoot=r.isRoot??!1,this.label=r.label,this.colorAttachments=r.colorAttachments,this.depthStencilAttachment=r.depthStencilAttachment,this.depthStencilAttachment){const s=this.depthStencilAttachment.texture.format;this._depth||(this._depth=s.includes("depth")),this._stencil||(this._stencil=s.includes("stencil"))}if(this.colorAttachments.length===0&&!this.depthStencilAttachment)throw new Error("[RenderTarget] no color textures or depth textures were provided. Provide a depthStencilTexture or set depth/stencil to true when using colorTextures: 0.");if(this.colorAttachments.length>0){const s=this.colorTexture;this.resize(s.width,s.height,s._resolution)}this.sizeSource&&this.sizeSource.on("resize",this.onSourceResize,this)}_normalizeOptions(e){const r={...kt.defaultOptions,...e},s=[];let n;if(typeof r.colorTextures=="number"){if(r.colorTextures>0){this._managedColorTextures=!0;for(let o=0;o<r.colorTextures;o++)s.push({texture:new L({width:r.width,height:r.height,resolution:r.resolution,antialias:r.antialias}),loadOp:"clear",storeOp:"store"})}}else r.colorTextures.forEach(o=>{s.push({texture:o.source,loadOp:"clear",storeOp:"store"})});const i=r.depthStencilTexture===!0;if(this._depth=!!(r.depth||i),this._stencil=!!(r.stencil||i),r.depthStencilTexture instanceof S||r.depthStencilTexture instanceof L){if(r.isRoot)throw new Error("[RenderTarget] cannot attach a depth-stencil texture to the screen — the canvas owns its own depth/stencil buffers. Render to a texture target instead.");n={texture:r.depthStencilTexture.source}}else(i&&!r.isRoot||(r.stencil||r.depth)&&s.length===0)&&(n=this._createDepthStencilTexture(r.width,r.height,r.resolution));return{colorAttachments:s,depthStencilAttachment:n,isRoot:r.isRoot,label:r.label}}get size(){const e=this._size;return e[0]=this.pixelWidth,e[1]=this.pixelHeight,e}get width(){return this.sizeSource.width}get height(){return this.sizeSource.height}get pixelWidth(){return this.sizeSource.pixelWidth}get pixelHeight(){return this.sizeSource.pixelHeight}get resolution(){return this.sizeSource._resolution}get colorTextures(){return this._colorTextures||(this._colorTextures=this.colorAttachments.map(e=>e.texture)),this._colorTextures}get depthStencilTexture(){return this.depthStencilAttachment?.texture??null}get depth(){return this._depth}get stencil(){return this._stencil}get colorTexture(){return this.colorAttachments[0]?.texture}get sizeSource(){return this.colorAttachments[0]?.texture??this.depthStencilAttachment?.texture}onSourceResize(e){this.resize(e.width,e.height,e._resolution,!0)}ensureDepthStencilTexture(){this._createDepthStencilTexture(this.sizeSource.width,this.sizeSource.height,this.sizeSource._resolution),this._depth=!0,this._stencil=!0}resize(e,r,s=this.resolution,n=!1){if(this.dirtyId++,this.colorAttachments.forEach((i,o)=>{n&&o===0||i.texture.resize(e,r,s)}),this.depthStencilAttachment){if(n&&this.colorAttachments.length===0)return;this.depthStencilAttachment.texture.resize(e,r,s)}}destroy(){!this.colorAttachments&&!this.depthStencilAttachment||(this.sizeSource.off("resize",this.onSourceResize,this),this._managedColorTextures&&this.colorAttachments.forEach(e=>{e.texture.destroy()}),this.depthStencilAttachment&&(this.depthStencilAttachment.texture.destroy(),delete this.depthStencilAttachment),this.colorAttachments=null,this._colorTextures=null)}_createDepthStencilTexture(e,r,s){return this.depthStencilAttachment??(this.depthStencilAttachment={texture:new L({width:e,height:r,resolution:s,format:"depth24plus-stencil8",autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1})}),this.depthStencilAttachment}};wt.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1};var q=wt,I=new Map;he.register(I);function Mt(t,e){if(!I.has(t)){const r=new S({source:new ie({resource:t,...e})}),s=()=>{I.get(t)===r&&I.delete(t)};r.once("destroy",s),r.source.once("destroy",s),I.set(t,r)}return I.get(t)}var ye=class Rt{get autoDensity(){return this.texture.source.autoDensity}set autoDensity(e){this.texture.source.autoDensity=e}get resolution(){return this.texture.source._resolution}set resolution(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}init(e){e={...Rt.defaultOptions,...e},e.view&&(v(We,"ViewSystem.view has been renamed to ViewSystem.canvas"),e.canvas=e.view),this.screen=new F(0,0,e.width,e.height),this.canvas=e.canvas||de.get().createCanvas(),this.antialias=!!e.antialias,this.texture=Mt(this.canvas,e),this.renderTarget=new q({colorTextures:[this.texture],depth:!!e.depth,isRoot:!0}),this.texture.source.transparent=e.backgroundAlpha<1,this.resolution=e.resolution}resize(e,r,s){this.texture.source.resize(e,r,s),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height}destroy(e=!1){(typeof e=="boolean"?e:e?.removeView)&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),this.texture.destroy()}};ye.extension={type:[h.WebGLSystem,h.WebGPUSystem,h.CanvasSystem],name:"view",priority:0};ye.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};var Zr=ye,is=[Fr,Tt,xe,Zr,gt,Kr,Jr,bt,Lr,Xe,Qr,St],as=[ft,at,dt,ct,ot,ut,lt,ht];function es(t,e,r,s,n,i){const o=i?1:-1;return t.identity(),t.a=1/s*2,t.d=o*(1/n*2),t.tx=-1-e*t.a,t.ty=-o-r*t.d,t}function ts(t){if(t.colorAttachments.length===0)return!1;const e=t.colorTexture.resource;return globalThis.HTMLCanvasElement&&e instanceof HTMLCanvasElement&&document.body.contains(e)}var os=class{constructor(t){this.rootViewPort=new F,this.viewport=new F,this.onRenderTargetChange=new Ye("onRenderTargetChange"),this.projectionMatrix=new M,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._bindState={target:null,frame:void 0,mipLevel:0,layer:0,flipY:!1},this._bindFrame=new F,this._renderer=t,t.gc.addCollection(this,"_gpuRenderTargetHash","hash")}get renderSurface(){return this._bindState.target}get mipLevel(){return this._bindState.mipLevel}get layer(){return this._bindState.layer}finishRenderPass(){this.adaptor.finishRenderPass(this.renderTarget)}renderStart(t){this._renderTargetStack.length=0,this.push(t),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=ts(this.rootRenderTarget),this.adaptor.prerender?.(this.rootRenderTarget)}postrender(){this.adaptor.postrender?.(this.rootRenderTarget)}bind(t,e=!0,r,s,n=0,i=0,o){let a;"target"in t?a=t:(v("8.20.0","RenderTargetSystem.bind: positional arguments are deprecated, please use an options object instead: bind({ target, clear, clearColor, frame, mipLevel, layer, flipY })"),a={target:t,clear:e,clearColor:r,frame:s,mipLevel:n,layer:i,flipY:o});const l=a.target;e=a.clear??!0,r=a.clearColor,n=(a.mipLevel??0)|0,i=(a.layer??0)|0,o=a.flipY,s=a.frame;const u=this.getRenderTarget(l),d=this.renderTarget!==u;this.renderTarget=u;const f=this.getGpuRenderTarget(u);(u.pixelWidth!==f.width||u.pixelHeight!==f.height)&&(this.adaptor.resizeGpuRenderTarget(u),f.width=u.pixelWidth,f.height=u.pixelHeight);const p=u.colorAttachments[0]?.texture||u.depthStencilAttachment?.texture,m=this.viewport,x=p.arrayLayerCount||1;if(i<0||i>=x)throw new Error(`[RenderTargetSystem] layer ${i} is out of bounds (arrayLayerCount=${x}).`);const b=this._bindState;b.target=l,b.frame=s?this._bindFrame.copyFrom(s):void 0,b.mipLevel=n,b.layer=i,b.flipY=o;const y=Math.max(p.pixelWidth>>n,1),c=Math.max(p.pixelHeight>>n,1);if(!s&&l instanceof S&&(s=l.frame),s){const _=p._resolution,g=1<<Math.max(n,0),T=s.x*_+.5|0,C=s.y*_+.5|0,j=s.width*_+.5|0,Pt=s.height*_+.5|0;let R=Math.floor(T/g),P=Math.floor(C/g),A=Math.ceil(j/g),G=Math.ceil(Pt/g);R<0&&(A+=R,R=0),P<0&&(G+=P,P=0),R=Math.min(R,y-1),P=Math.min(P,c-1),A=Math.min(A,y-R),G=Math.min(G,c-P),A=Math.max(A,1),G=Math.max(G,1),m.x=R,m.y=P,m.width=A,m.height=G}else m.x=0,m.y=0,m.width=y,m.height=c;return u.flipY=o,es(this.projectionMatrix,0,0,m.width/p.resolution,m.height/p.resolution,!u.isRoot!=!!u.flipY),this.adaptor.startRenderPass(u,e,r,m,n,i),d&&this.onRenderTargetChange.emit(u),u}getBindState(t){if(!this.renderTarget)throw new Error("[RenderTargetSystem] getBindState is only valid while a render surface is bound");const e=this._bindState;return t??(t={}),t.target=e.target,t.clear=D.NONE,t.clearColor=void 0,e.frame?t.frame?t.frame.copyFrom(e.frame):t.frame=e.frame.clone():t.frame=void 0,t.mipLevel=e.mipLevel,t.layer=e.layer,t.flipY=!!e.flipY,t}get frontFaceInverted(){const t=this.renderTarget;if(!t)return!1;const e=this._renderer.type===Z.WEBGL&&!t.isRoot;return!!t.flipY!==e}clear(t,e=D.ALL,r,s=this.mipLevel,n=this.layer){e&&(t&&(t=this.getRenderTarget(t)),this.adaptor.clear(t||this.renderTarget,e,r,this.viewport,s,n))}contextChange(){this._gpuRenderTargetHash=Object.create(null)}push(t,e=D.ALL,r,s,n=0,i=0,o){let a;"target"in t?a=t:(v("8.20.0","RenderTargetSystem.push: positional arguments are deprecated, please use an options object instead: push({ target, clear, clearColor, frame, mipLevel, layer, flipY })"),a={target:t,clear:e,clearColor:r,frame:s,mipLevel:n,layer:i,flipY:o});const l=this.bind(a);return this._renderTargetStack.push({target:a.target,clear:!1,clearColor:void 0,frame:a.frame?a.frame.clone():void 0,mipLevel:a.mipLevel,layer:a.layer,flipY:a.flipY}),l}pop(){this._renderTargetStack.pop();const t=this._renderTargetStack[this._renderTargetStack.length-1];if(!t)throw new Error("[RenderTargetSystem] pop: no previous binding to restore (unbalanced pop)");return this.bind(t)}getRenderTarget(t){return t.isTexture&&(t=t.source),this._renderSurfaceToRenderTargetHash.get(t)??this._initRenderTarget(t)}copyToTexture(t,e,r,s,n){const i=this.getRenderTarget(t);r.x<0&&(s.width+=r.x,n.x-=r.x,r.x=0),r.y<0&&(s.height+=r.y,n.y-=r.y,r.y=0);const{pixelWidth:o,pixelHeight:a}=i;return s.width=Math.min(s.width,o-r.x),s.height=Math.min(s.height,a-r.y),this.adaptor.copyToTexture(i,e,r,s,n)}copyDepthTexture(t,e,r,s,n={x:0,y:0}){const i=this.getRenderTarget(t);if(!i.depthStencilAttachment){B("[RenderTargetSystem] copyDepthTexture: the source render target has no depth attachment to copy from");return}const o=e.source;if(!o.format.includes("depth")&&!o.format.includes("stencil")){B(`[RenderTargetSystem] copyDepthTexture: the destination texture must have a depth/stencil format (got '${o.format}')`);return}let a=r.x,l=r.y,u=n.x,d=n.y,f=s.width,p=s.height;a<0&&(f+=a,u-=a,a=0),l<0&&(p+=l,d-=l,l=0),f=Math.min(f,i.pixelWidth-a),p=Math.min(p,i.pixelHeight-l),f=Math.min(f,o.pixelWidth-u),p=Math.min(p,o.pixelHeight-d),!(f<=0||p<=0)&&this.adaptor.copyDepthTexture(i,e,{x:a,y:l},{width:f,height:p},{x:u,y:d})}ensureDepthStencil(){if(!this.renderTarget.stencil){if(this.renderTarget.depthStencilTexture){B(`[RenderTargetSystem] a stencil mask is being used, but the render target's depthStencilTexture format '${this.renderTarget.depthStencilTexture.format}' has no stencil aspect, so masking cannot work here. Use a 'depth24plus-stencil8' texture instead.`);return}this.renderTarget._depth=!0,this.renderTarget._stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport,0,this.layer)}}destroy(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach((t,e)=>{t!==e&&this._releaseRenderTarget(e,t)}),this._renderSurfaceToRenderTargetHash.clear(),this._gpuRenderTargetHash=Object.create(null)}_initRenderTarget(t){let e=null;if(ie.test(t)&&(t=Mt(t).source),t instanceof q)e=t;else if(t instanceof L){const r=t.format;e=r.includes("depth")||r.includes("stencil")?new q({colorTextures:0,depthStencilTexture:t}):new q({colorTextures:[t]}),t.source instanceof ie&&(e.isRoot=!0),t.once("destroy",this._onRenderSurfaceDestroy,this)}return this._renderSurfaceToRenderTargetHash.set(t,e),e}_onRenderSurfaceDestroy(t){const e=this._renderSurfaceToRenderTargetHash.get(t);e&&this._releaseRenderTarget(t,e)}_releaseRenderTarget(t,e){e.destroy(),this._renderSurfaceToRenderTargetHash.delete(t),t.off("destroy",this._onRenderSurfaceDestroy,this);const r=this._gpuRenderTargetHash[e.uid];r&&(this._gpuRenderTargetHash[e.uid]=null,this.adaptor.destroyGpuRenderTarget(r))}getGpuRenderTarget(t){return this._gpuRenderTargetHash[t.uid]||(this._gpuRenderTargetHash[t.uid]=this.adaptor.initGpuRenderTarget(t))}resetState(){this.renderTarget=null,this._bindState.target=null}};export{Xt as C,ss as D,jt as E,D as O,xr as S,ke as T,Cr as _,dt as a,yr as b,ot as c,Ur as d,ns as f,Rr as g,Mr as h,ft as i,Nt as k,at as l,Pr as m,as as n,ct as o,st as p,is as r,ht as s,os as t,nt as u,kr as v,w,vr as x,br as y};
