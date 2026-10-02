import{Q as m,R as _,n as y,p as g,r as l,rt as U}from"./Geometry-JcOjYH16.js";import{k as I,w as c}from"./RenderTargetSystem-CipHaLlf.js";var p={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},R={...p,vertex:{...p.vertex,header:p.vertex.header.replace("group(1)","group(2)")}},C={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}},D={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},E={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function O(t,e){for(const s in t.attributes){const a=t.attributes[s],f=e[s];f?(a.format??(a.format=f.format),a.offset??(a.offset=f.offset),a.instance??(a.instance=f.instance)):_(`Attribute ${s} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}S(t)}function S(t){const{buffers:e,attributes:s}=t,a={},f={};for(const o in e){const r=e[o];a[r.uid]=0,f[r.uid]=0}for(const o in s){const r=s[o];a[r.buffer.uid]+=g(r.format).stride}for(const o in s){const r=s[o];r.stride??(r.stride=a[r.buffer.uid]),r.start??(r.start=f[r.buffer.uid]),f[r.buffer.uid]+=g(r.format).stride}}var d=[];d[c.NONE]=void 0;d[c.DISABLED]={stencilWriteMask:0,stencilReadMask:0};d[c.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};d[c.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};d[c.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};d[c.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}};var k=class{constructor(t){this._syncFunctionHash=Object.create(null),this._adaptor=t,this._systemCheck()}_systemCheck(){if(!I())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(t){const e=this.getUniformGroupData(t);t.buffer||(t.buffer=new y({data:new Float32Array(e.layout.size/4),usage:l.UNIFORM|l.COPY_DST}))}getUniformGroupData(t){return this._syncFunctionHash[t._signature]||this._initUniformGroup(t)}_initUniformGroup(t){const e=t._signature;let s=this._syncFunctionHash[e];if(!s){const a=Object.keys(t.uniformStructures).map(r=>t.uniformStructures[r]),f=this._adaptor.createUboElements(a),o=this._generateUboSync(f.uboElements);s=this._syncFunctionHash[e]={layout:f,syncFunction:o}}return this._syncFunctionHash[e]}_generateUboSync(t){return this._adaptor.generateUboSync(t)}syncUniformGroup(t,e,s){const a=this.getUniformGroupData(t);t.buffer||(t.buffer=new y({data:new Float32Array(a.layout.size/4),usage:l.UNIFORM|l.COPY_DST}));let f=null;return e||(e=t.buffer.data,f=t.buffer.dataInt32),s||(s=0),a.syncFunction(t.uniforms,e,f,s),!0}updateUniformGroup(t){if(t.isStatic&&!t._dirtyId)return!1;t._dirtyId=0;const e=this.syncUniformGroup(t);return t.buffer.update(),e}destroy(){this._syncFunctionHash=null}},h=[{type:"mat3x3<f32>",test:t=>t.value.a!==void 0,ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:`
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:t=>t.type==="vec4<f32>"&&t.size===1&&t.value.width!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:t=>t.type==="vec2<f32>"&&t.size===1&&t.value.x!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:t=>t.type==="vec4<f32>"&&t.size===1&&t.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:t=>t.type==="vec3<f32>"&&t.size===1&&t.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function A(t,e,s){const a=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let f=0;for(let r=0;r<t.length;r++){const n=t[r],x=n.data.name;let b=!1,i=0;for(let u=0;u<h.length;u++)if(h[u].test(n.data)){i=n.offset/4,a.push(`name = "${x}";`,`offset += ${i-f};`,h[u].ubo),b=!0;break}if(!b)if(n.data.size>1)i=n.offset/4,a.push(s(n,i-f));else{const u=e[n.data.type];i=n.offset/4,a.push(`
                    v = uv.${x};
                    offset += ${i-f};
                    ${u};
                `)}f=i}const o=a.join(`
`);return new Function("uv","data","dataInt32","offset",o)}function v(t,e){return`
        for (let i = 0; i < ${t*e}; i++) {
            data[offset + (((i / ${t})|0) * 4) + (i % ${t})] = v[i];
        }
    `}var M={f32:`
        data[offset] = v;`,i32:`
        dataInt32[offset] = v;`,u32:`
        dataInt32[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"vec2<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"vec2<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<u32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":v(3,2),"mat4x2<f32>":v(4,2),"mat2x3<f32>":v(2,3),"mat4x3<f32>":v(4,3),"mat2x4<f32>":v(2,4),"mat3x4<f32>":v(3,4)},w={...M,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `},B=class extends U{constructor({buffer:t,offset:e,size:s}){super(),this.uid=m("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=m("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=t,this.offset=e|0,this.size=s,this.buffer.on("change",this.onBufferChange,this)}get _gcLastUsed(){return this.buffer?._gcLastUsed??-1}set _gcLastUsed(t){this.buffer&&(this.buffer._gcLastUsed=t)}onBufferChange(){this._resourceId=m("resource"),this.emit("change",this)}destroy(t=!1){this.destroyed=!0,t&&this.buffer.destroy(),this.emit("change",this),this.buffer=null,this.removeAllListeners()}};export{h as a,O as c,p as d,C as f,A as i,D as l,M as n,k as o,R as p,w as r,d as s,B as t,E as u};
