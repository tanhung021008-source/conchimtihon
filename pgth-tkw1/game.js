const canvas=document.getElementById("game")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let gameRunning=false

let score=0
let hp=5
let weapon=1

let combo=0
let comboTimer=0

let bullets=[]
let chickens=[]
let eggs=[]
let meats=[]
let bossBullets=[]
let lasers=[]
let boss=null

let left=false
let right=false

const player={
x:canvas.width/2,
y:canvas.height-80,
w:50,
h:40,
speed:7
}

document.addEventListener("keydown",e=>{
if(e.key==="ArrowLeft") left=true
if(e.key==="ArrowRight") right=true
if(e.key===" ") shoot()
})

document.addEventListener("keyup",e=>{
if(e.key==="ArrowLeft") left=false
if(e.key==="ArrowRight") right=false
})

function startGame(){

document.getElementById("menu").style.display="none"

spawnFormation()

gameRunning=true

}

function shoot(){

if(weapon===1){
bullets.push({x:player.x+20,y:player.y,w:6,h:15,dx:0})
}

if(weapon===2){
bullets.push({x:player.x+20,y:player.y,w:6,h:15,dx:-2})
bullets.push({x:player.x+20,y:player.y,w:6,h:15,dx:0})
bullets.push({x:player.x+20,y:player.y,w:6,h:15,dx:2})
}

}

function spawnFormation(){

for(let r=0;r<4;r++){
for(let c=0;c<8;c++){

chickens.push({
x:120+c*80,
y:50+r*60,
w:40,
h:40,
dir:1
})

}
}

}

function spawnBoss(){

boss={
x:canvas.width/2-120,
y:50,
w:240,
h:120,
hp:50,
dir:3
}

}

function update(){

if(!gameRunning)return

if(left) player.x-=player.speed
if(right) player.x+=player.speed

bullets.forEach((b,i)=>{
b.y-=10
b.x+=b.dx
if(b.y<0) bullets.splice(i,1)
})

eggs.forEach((e,i)=>{
e.y+=5

if(
e.x<player.x+player.w &&
e.x+10>player.x &&
e.y<player.y+player.h &&
e.y+10>player.y
){
hp--
eggs.splice(i,1)
updateUI()
}

})

meats.forEach((m,i)=>{

m.y+=3

if(
m.x<player.x+player.w &&
m.x+20>player.x &&
m.y<player.y+player.h &&
m.y+20>player.y
){

combo++
comboTimer=120

score+=5*combo
weapon=2

meats.splice(i,1)
updateUI()

}

})

if(comboTimer>0) comboTimer--
else combo=0

chickens.forEach((c)=>{

c.x+=c.dir

if(Math.random()<0.003){
eggs.push({x:c.x+20,y:c.y+20})
}

if(c.x<0||c.x>canvas.width-40){
c.dir*=-1
c.y+=20
}

})

if(boss){

boss.x+=boss.dir

if(Math.random()<0.02){
bossBullets.push({x:boss.x+boss.w/2,y:boss.y+boss.h})
}

if(Math.random()<0.01){
lasers.push({x:boss.x+boss.w/2-5,y:boss.y+boss.h,w:10})
}

if(boss.x<0||boss.x>canvas.width-boss.w){
boss.dir*=-1
}

}

bossBullets.forEach((b,i)=>{

b.y+=7

if(
b.x<player.x+player.w &&
b.x+10>player.x &&
b.y<player.y+player.h &&
b.y+10>player.y
){
hp--
bossBullets.splice(i,1)
updateUI()
}

})

lasers.forEach((l,i)=>{

if(
l.x<player.x+player.w &&
l.x+l.w>player.x
){
hp--
lasers.splice(i,1)
updateUI()
}

})

bullets.forEach((b,bi)=>{

chickens.forEach((c,ci)=>{

if(
b.x<c.x+c.w &&
b.x+b.w>c.x &&
b.y<c.y+c.h &&
b.y+b.h>c.y
){

bullets.splice(bi,1)
chickens.splice(ci,1)

if(Math.random()<0.3){
meats.push({x:c.x,y:c.y})
}

score++
updateUI()

}

})

if(boss){

if(
b.x<boss.x+boss.w &&
b.x+b.w>boss.x &&
b.y<boss.y+boss.h &&
b.y+b.h>boss.y
){

boss.hp--
bullets.splice(bi,1)

if(boss.hp<=0){
score+=100
boss=null
updateUI()
}

}

}

})

if(chickens.length===0 && !boss){
spawnBoss()
}

if(hp<=0){
alert("GAME OVER\nScore: "+score)
location.reload()
}

}

function updateUI(){

document.getElementById("score").innerText=score
document.getElementById("hp").innerText=hp

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

ctx.fillStyle="cyan"
ctx.fillRect(player.x,player.y,player.w,player.h)

ctx.fillStyle="yellow"
bullets.forEach(b=>{
ctx.fillRect(b.x,b.y,b.w,b.h)
})

ctx.fillStyle="orange"
chickens.forEach(c=>{
ctx.fillRect(c.x,c.y,c.w,c.h)
})

ctx.fillStyle="white"
eggs.forEach(e=>{
ctx.fillRect(e.x,e.y,10,10)
})

ctx.fillStyle="brown"
meats.forEach(m=>{
ctx.fillRect(m.x,m.y,20,20)
})

if(boss){
ctx.fillStyle="red"
ctx.fillRect(boss.x,boss.y,boss.w,boss.h)

ctx.fillStyle="white"
ctx.fillText("BOSS HP: "+boss.hp,boss.x+60,boss.y-10)
}

ctx.fillStyle="purple"
bossBullets.forEach(b=>{
ctx.fillRect(b.x,b.y,10,10)
})

ctx.fillStyle="red"
lasers.forEach(l=>{
ctx.fillRect(l.x,l.y,l.w,canvas.height)
})

ctx.fillStyle="yellow"
ctx.fillText("Combo: "+combo,20,80)

}

function loop(){

update()
draw()

requestAnimationFrame(loop)

}

loop()