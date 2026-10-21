import numpy as np, trimesh, math, os
from trimesh.transformations import rotation_matrix
OUT='/mnt/data/ashen_veil_haunt02'
scene=trimesh.Scene()
skin=[174,169,160,255]; dark=[26,21,26,255]; bone=[214,207,189,255]; hair=[86,80,81,255]
def add(name, mesh, color):
 mesh.visual.vertex_colors=np.tile(np.array(color,dtype=np.uint8),(len(mesh.vertices),1))
 scene.add_geometry(mesh,geom_name=name,node_name=name)
def orb(name, xyz, scales, color=skin,sub=2):
 m=trimesh.creation.icosphere(subdivisions=sub,radius=1);m.apply_scale(scales);m.apply_translation(xyz);add(name,m,color)
def tube(name,points,radii,color=skin,n=12):
 pts=np.array(points,dtype=float);verts=[];faces=[]
 for i,p in enumerate(pts):
  d=pts[min(i+1,len(pts)-1)]-pts[max(0,i-1)];d=d/np.linalg.norm(d)
  ref=np.array([0,0,1.]) if abs(d[2])<.9 else np.array([0,1.,0]);a=np.cross(d,ref);a/=np.linalg.norm(a);b=np.cross(d,a)
  for j in range(n):
   ang=j*2*np.pi/n;verts.append(p+radii[i]*(np.cos(ang)*a+np.sin(ang)*b))
 for i in range(len(pts)-1):
  for j in range(n):
   k=i*n+j; l=i*n+(j+1)%n;faces.extend([[k,l,l+n],[k,l+n,k+n]])
 faces.extend([[0,j+1,j] for j in range(1,n-1)]); faces.extend([[(len(pts)-1)*n,(len(pts)-1)*n+j,(len(pts)-1)*n+j+1] for j in range(1,n-1)]);m=trimesh.Trimesh(vertices=verts,faces=faces,process=False);add(name,m,color)
# upright torso and pelvis, long gaunt frame
orb('narrow_pelvis',[0,0,5.2],[.39,.27,.5]);
tube('single_torso',[[0,0,5.35],[0,0,6.1],[0,0,6.9],[0,0,7.7],[0,0,8.1]],[.30,.34,.45,.52,.27],n=20)
# sharp shoulder collar and visible ribs
for side in (-1,1):
 tube(f'collar_{side}',[[0,-.1,7.92],[side*.35,-.12,7.89],[side*.68,0,7.75]],[.12,.1,.13])
 for ix,z in enumerate(np.linspace(6.6,7.65,5)):
  tube(f'rib_{side}_{ix}',[[side*.11,-.38,z],[side*.37,-.34,z-.055],[side*.44,-.11,z-.16]],[.047,.055,.028],bone,8)
 # standing elongated legs, knees, shins; feet extend beyond the knees to ground
 hip=[side*.24,0,5.12];knee=[side*.60,.08,2.62];ankle=[side*.77,-.04,.29]
 tube(f'leg_{side}',[hip,[side*.36,0,4.2],knee,[side*.68,.02,1.43],ankle],[.19,.13,.15,.095,.13],n=16)
 orb(f'knee_{side}',knee,[.17,.16,.2]);orb(f'ankle_{side}',ankle,[.15,.15,.18])
 orb(f'foot_{side}',[side*.77,-.3,.14],[.21,.47,.12]);
 for k in range(5):
  tube(f'toe_{side}_{k}',[[side*.77+(k-2)*.066,-.55,.11],[side*.77+(k-2)*.072,-.77+(abs(k-2)*.035),.095]],[.05,.035],n=8)
 # very long arms reaching towards viewer with unnatural but anatomically connected bends
 shoulder=[side*.65,0,7.78];elbow=[side*1.32,-.19,5.62];bend=[side*1.64,-.64,5.0];wrist=[side*1.84,-1.26,4.38]
 tube(f'arm_{side}',[shoulder,[side*.91,-.08,6.68],elbow,bend,wrist],[.15,.105,.115,.095,.072],n=14)
 orb(f'elbow_{side}',elbow,[.13,.13,.13]);orb(f'hand_{side}',[side*1.86,-1.31,4.18],[.14,.085,.27])
 for k in range(4):
  x=side*1.86+(k-1.5)*.065
  tube(f'finger_{side}_{k}',[[x,-1.35,4.02],[x+(k-1.5)*.022,-1.47,3.82],[x+(k-1.5)*.026,-1.51,3.7+abs(k-1.5)*.035]],[.038,.03,.022],n=8)
 tube(f'thumb_{side}',[[side*1.73,-1.33,4.26],[side*1.64,-1.44,4.04]],[.043,.025],n=8)
# neck: clear continuous and sharply bent backward / down toward viewer
neck=[[0,0,8.1],[0,-.08,8.6],[.04,-.36,8.8],[.14,-.85,8.78],[.2,-1.25,8.42],[.25,-1.43,7.88],[.29,-1.54,7.38]]
tube('single_extensible_hooked_neck',neck,[.2,.19,.17,.15,.16,.17,.2],n=20)
# head in lower forward end of neck, broadly human not animal or insect
orb('cranium',[.3,-1.65,7.11],[.36,.30,.47],sub=3)
orb('jaw',[.3,-1.76,6.82],[.3,.27,.26],sub=2)
# face points toward camera front (-Y), a dramatic black gaping smile and pale teeth
orb('gaping_grin',[.3,-2.01,6.85],[.28,.055,.165],dark,sub=3)
for i in range(11):
 x=.3+(i-5)*.044
 z_top=6.93 - .025*(abs(i-5)/5)
 z_bot=6.76 + .015*(abs(i-5)/5)
 orb(f'top_tooth_{i}',[x,-2.067,z_top],[.019,.022,.045],bone,1)
 orb(f'bottom_tooth_{i}',[x,-2.066,z_bot],[.018,.021,.033],bone,1)
# no eyeballs: smoothly sealed eye hollows
for side in (-1,1):
 orb(f'sealed_eye_{side}',[.3+side*.15,-1.91,7.23],[.108,.037,.061],dark,2)
 tube(f'brow_{side}',[[.3+side*.055,-1.936,7.3],[.3+side*.17,-1.93,7.32],[.3+side*.245,-1.9,7.29]],[.03,.039,.022],skin,8)
# sparse hanging hair around sides of head
for i in range(14):
 th=2*np.pi*i/14;xx=.3+.32*np.cos(th);yy=-1.65+.25*np.sin(th)
 if yy>-1.48:continue
 tube(f'hair_{i}',[[xx,yy,7.4],[xx+.07*np.cos(th),yy+.03,7.1],[xx+.05*np.cos(th),yy-.04,6.76]],[.014,.009,.002],hair,5)
scene.export(os.path.join(OUT,'haunt02_elongated_grinner.glb'))
# export OBJ as compatible alternative
with open(os.path.join(OUT,'haunt02_elongated_grinner.obj'),'w') as f: f.write(trimesh.exchange.obj.export_obj(scene))
print('geometry:',len(scene.geometry),'bounds:',scene.bounds)
loaded=trimesh.load(os.path.join(OUT,'haunt02_elongated_grinner.glb'))
print('validated:',type(loaded).__name__,len(loaded.geometry),os.stat(os.path.join(OUT,'haunt02_elongated_grinner.glb')).st_size)
