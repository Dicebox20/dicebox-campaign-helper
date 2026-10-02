import{B as S,H as _,R as I,T as F,at as T,d as B,f as O,i as A,l as M,m as U,ot as w,t as E,tt as k,u as z}from"./Geometry-JcOjYH16.js";import{t as V}from"./canvasUtils-kkO-fDXp.js";import{t as Y}from"./CanvasPool-nK2xjHDz.js";import{t as q}from"./index-C1s9PXL-.js";var v=new k;function P(e,t){t.clear();const r=t.matrix;for(let i=0;i<e.length;i++){const n=e[i];if(n.globalDisplayStatus<7)continue;const s=n.renderGroup??n.parentRenderGroup;s?.isCachedAsTexture?t.matrix=v.copyFrom(s.textureOffsetInverseTransform).append(n.worldTransform):s?._parentCacheAsTextureRenderGroup?t.matrix=v.copyFrom(s._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(n.groupTransform):t.matrix=n.worldTransform,t.addBounds(n.bounds)}return t.matrix=r,t}function b(e){return typeof e.getCanvasFilterString=="function"}var L=class{constructor(){this.skip=!1,this.useClip=!1,this.filters=null,this.container=null,this.bounds=new S,this.cssFilterString=""}},R=class{constructor(e){this._filterStack=[],this._filterStackIndex=0,this._savedStates=[],this._alphaMultiplier=1,this._warnedFilterTypes=new Set,this.renderer=e}push(e){const t=this._pushFilterFrame(),r=e.filterEffect.filters;if(t.skip=!1,t.useClip=!1,t.filters=r,t.container=e.container,t.cssFilterString="",r.every(a=>!a.enabled)){t.skip=!0;return}const i=[];for(const a of r){if(!a.enabled)continue;if(!b(a)){this._warnUnsupportedFilter(a);continue}const l=a.getCanvasFilterString();if(l===null){this._warnUnsupportedFilter(a);continue}l&&i.push(l)}if(i.length===0){t.skip=!0;return}t.cssFilterString=i.join(" "),this._calculateFilterArea(e,t.bounds),t.useClip=!!e.filterEffect.filterArea;const n=this.renderer.canvasContext.activeContext,s=n.filter||"none";if(this._savedStates.push({filter:s,alphaMultiplier:this._alphaMultiplier}),t.useClip&&Number.isFinite(t.bounds.width)&&Number.isFinite(t.bounds.height)&&t.bounds.width>0&&t.bounds.height>0){const a=this.renderer.canvasContext.activeResolution||1;n.save(),n.setTransform(1,0,0,1,0,0),n.beginPath(),n.rect(t.bounds.x*a,t.bounds.y*a,t.bounds.width*a,t.bounds.height*a),n.clip()}else t.useClip=!1;t.cssFilterString&&(n.filter=s!=="none"?`${s} ${t.cssFilterString}`:t.cssFilterString)}pop(){const e=this._popFilterFrame();if(e.skip)return;const t=this._savedStates.pop();if(!t)return;const r=this.renderer.canvasContext.activeContext;e.useClip?r.restore():r.filter=t.filter,this._alphaMultiplier=t.alphaMultiplier}generateFilteredTexture({texture:e,filters:t}){if(!t?.length||t.every(d=>!d.enabled))return e;const r=[];for(const d of t){if(!d.enabled)continue;if(!b(d)){this._warnUnsupportedFilter(d);continue}const m=d.getCanvasFilterString();if(m===null){this._warnUnsupportedFilter(d);continue}m&&r.push(m)}if(r.length===0)return e;const i=V.getCanvasSource(e);if(!i)return e;const n=e.frame,s=e.source._resolution??e.source.resolution??1,a=n.width,l=n.height,{canvas:o,context:u}=Y.getOptimalCanvasAndContext(a,l,s);u.setTransform(1,0,0,1,0,0),u.clearRect(0,0,o.width,o.height),r.length&&(u.filter=r.join(" "));const c=n.x*s,f=n.y*s,p=a*s,h=l*s;return u.drawImage(i,c,f,p,h,0,0,p,h),u.filter="none",u.globalAlpha=1,q(o,a,l,s)}_calculateFilterArea(e,t){if(e.renderables?P(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const r=(e.container.renderGroup||e.container.parentRenderGroup)?.cacheToLocalTransform;r&&t.applyMatrix(r)}}_warnUnsupportedFilter(e){const t=e?.constructor?.name||"Filter";this._warnedFilterTypes.has(t)||(this._warnedFilterTypes.add(t),console.warn(`CanvasRenderer: filter "${t}" is not supported in Canvas2D and will be skipped.`))}get alphaMultiplier(){return this._alphaMultiplier}_pushFilterFrame(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new L),this._filterStackIndex++,e}_popFilterFrame(){return this._filterStackIndex<=0?this._filterStack[0]:(this._filterStackIndex--,this._filterStack[this._filterStackIndex])}destroy(){this._filterStack=null,this._savedStates=null,this._warnedFilterTypes=null,this._alphaMultiplier=1}};R.extension={type:[T.CanvasSystem],name:"filter"};var W=`in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,X=`in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,y=`struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`,j=class extends A{constructor(){const e=O.from({vertex:{source:y,entryPoint:"mainVertex"},fragment:{source:y,entryPoint:"mainFragment"},name:"passthrough-filter"}),t=U.from({vertex:W,fragment:X,name:"passthrough-filter"});super({gpuProgram:e,glProgram:t})}},G=class{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}};G.extension={type:[T.WebGLPipes,T.WebGPUPipes,T.CanvasPipes],name:"filter"};var N=new E({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])}),$=class{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new S,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0},this.firstEnabledIndex=-1,this.lastEnabledIndex=-1}},C=class{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new B({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new z({}),this.renderer=e}get activeBackTexture(){return this._activeFilterData?.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,i=this._pushFilterData();i.skip=!1,i.filters=r,i.container=e.container,i.outputRenderSurface=t.renderTarget.renderSurface;const n=t.renderTarget.renderTarget.colorTexture.source,s=n.resolution,a=n.antialias;if(r.every(p=>!p.enabled)){i.skip=!0;return}const l=i.bounds;if(this._calculateFilterArea(e,l),this._calculateFilterBounds(i,t.renderTarget.rootViewPort,a,s,1),i.skip)return;const o=this._getPreviousFilterData(),u=this._findFilterResolution(s);let c=0,f=0;o&&(c=o.bounds.minX,f=o.bounds.minY),this._calculateGlobalFrame(i,c,f,u,n.width,n.height),this._setupFilterTextures(i,l,t,o)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const i=e.source,n=i.resolution,s=i.antialias;if(t.every(u=>!u.enabled))return r.skip=!0,e;const a=r.bounds;if(a.addRect(e.frame),this._calculateFilterBounds(r,a.rectangle,s,n,0),r.skip)return e;const l=n;this._calculateGlobalFrame(r,0,0,l,i.width,i.height),r.outputRenderSurface=F.getOptimalTexture(a.width,a.height,r.resolution,r.antialias),r.backTexture=_.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const o=r.outputRenderSurface;return o.source.alphaMode="premultiplied-alpha",o}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&F.returnTexture(t.backTexture),F.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const i=e.colorTexture.source._resolution,n=F.getOptimalTexture(t.width,t.height,i,!1);let s=t.minX,a=t.minY;r&&(s-=r.minX,a-=r.minY),s=Math.floor(s*i),a=Math.floor(a*i);const l=Math.ceil(t.width*i),o=Math.ceil(t.height*i);return this.renderer.renderTarget.copyToTexture(e,n,{x:s,y:a},{width:l,height:o},{x:0,y:0}),n}applyFilter(e,t,r,i){const n=this.renderer,s=this._activeFilterData,a=s.outputRenderSurface===r,l=n.renderTarget.rootRenderTarget.colorTexture.source._resolution,o=this._findFilterResolution(l);let u=0,c=0;if(a){const p=this._findPreviousFilterOffset();u=p.x,c=p.y}this._updateFilterUniforms(t,r,s,u,c,o,a,i);const f=e.enabled?e:this._getPassthroughFilter();this._setupBindGroupsAndRender(f,t,n)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,i=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),n=t.worldTransform.copyTo(k.shared),s=t.renderGroup||t.parentRenderGroup;return s&&s.cacheToLocalTransform&&n.prepend(s.cacheToLocalTransform),n.invert(),i.prepend(n),i.scale(1/t.texture.orig.width,1/t.texture.orig.height),i.translate(t.anchor.x,t.anchor.y),i}destroy(){this._passthroughFilter?.destroy(!0),this._passthroughFilter=null}_getPassthroughFilter(){return this._passthroughFilter??(this._passthroughFilter=new j),this._passthroughFilter}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const i=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(i,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:N,shader:e,state:e._state,topology:"triangle-list"}),r.type===M.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,i){if(e.backTexture=_.EMPTY,e.inputTexture=F.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),e.blendRequired){r.renderTarget.finishRenderPass();const n=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(n,t,i?.bounds)}r.renderTarget.bind({target:e.inputTexture,clear:!0}),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,i,n,s){const a=e.globalFrame;a.x=t*i,a.y=r*i,a.width=n*i,a.height=s*i}_updateFilterUniforms(e,t,r,i,n,s,a,l){const o=this._filterGlobalUniforms.uniforms,u=o.uOutputFrame,c=o.uInputSize,f=o.uInputPixel,p=o.uInputClamp,h=o.uGlobalFrame,d=o.uOutputTexture;a?(u[0]=r.bounds.minX-i,u[1]=r.bounds.minY-n):(u[0]=0,u[1]=0),u[2]=e.frame.width,u[3]=e.frame.height,c[0]=e.source.width,c[1]=e.source.height,c[2]=1/c[0],c[3]=1/c[1],f[0]=e.source.pixelWidth,f[1]=e.source.pixelHeight,f[2]=1/f[0],f[3]=1/f[1],p[0]=.5*f[2],p[1]=.5*f[3],p[2]=e.frame.width*c[2]-.5*f[2],p[3]=e.frame.height*c[3]-.5*f[3];const m=this.renderer.renderTarget.rootRenderTarget.colorTexture;h[0]=i*s,h[1]=n*s,h[2]=m.source.width*s,h[3]=m.source.height*s,t instanceof _&&(t.source.resource=null);const g=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind({target:t,clear:!!l}),t instanceof _?(d[0]=t.frame.width,d[1]=t.frame.height):(d[0]=g.width,d[1]=g.height),d[2]=g.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const i=this._filterStack[r];if(!i.skip){e=i.bounds.minX,t=i.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?P(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const r=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;r&&t.applyMatrix(r)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,i=e.bounds,n=e.filters,s=e.firstEnabledIndex,a=e.lastEnabledIndex;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),s===a)n[s].apply(this,r,e.outputRenderSurface,t);else{let l=e.inputTexture;const o=F.getOptimalTexture(i.width,i.height,l.source._resolution,!1);let u=o;for(let c=s;c<a;c++){const f=n[c];if(!f.enabled)continue;f.apply(this,l,u,!0);const p=l;l=u,u=p}n[a].apply(this,l,e.outputRenderSurface,t),F.returnTexture(o)}}_calculateFilterBounds(e,t,r,i,n){const s=this.renderer,a=e.bounds,l=e.filters;let o=1/0,u=0,c=!0,f=!1,p=!1,h=!0,d=-1,m=-1;for(let g=0;g<l.length;g++){const x=l[g];if(x.enabled){if(d===-1&&(d=g),m=g,o=Math.min(o,x.resolution==="inherit"?i:x.resolution),u+=x.padding,x.antialias==="off"?c=!1:x.antialias==="inherit"&&c&&(c=r),x.clipToViewport||(h=!1),!(x.compatibleRenderers&s.type)){p=!1;break}if(x.blendRequired&&!(s.backBuffer?.useBackBuffer??!0)){I("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),p=!1;break}p=!0,f||(f=x.blendRequired)}}if(!p){e.skip=!0;return}if(h&&a.fitBounds(0,t.width/i,0,t.height/i),a.scale(o).ceil().scale(1/o).pad((u|0)*n),!a.isPositive){e.skip=!0;return}e.antialias=c,e.resolution=o,e.blendRequired=f,e.firstEnabledIndex=d,e.lastEnabledIndex=m}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>0&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new $),this._filterStackIndex++,e}};C.extension={type:[T.WebGLSystem,T.WebGPUSystem],name:"filter"};w.add(C,R);w.add(G);
