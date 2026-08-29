export class Player{
 constructor(spawn){this.spawn=spawn;this.reset()}
 reset(){Object.assign(this,{x:this.spawn.x,y:this.spawn.y,w:28,h:52,vx:0,vy:0,onGround:false,onClimb:false,state:'idle',facing:1,invincible:0,coyote:0,jumpBuffer:0,jumpHeld:false})}
 update(dt,input,world){
  const speed=input.run?290:230,acc=1500;
  this.vx+=(input.axis*speed-this.vx)*Math.min(1,acc*dt/speed);
  if(input.axis)this.facing=Math.sign(input.axis);

  // Stairs / ladders: Up climbs, Down descends. Jump (Space or Up when not on a climb) still leaps.
  const zone=world.climbAt(this),wantClimb=!!zone&&(input.climb||input.descend||(this.onClimb&&!this.onGround));
  const jumpPressed=input.jump&&!wantClimb;
  this.coyote=this.onGround?.13:Math.max(0,this.coyote-dt);
  if(jumpPressed&&!this.jumpHeld)this.jumpBuffer=.14;else this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
  this.jumpHeld=jumpPressed;
  let jumped=false;
  if(this.jumpBuffer>0&&(this.coyote>0||this.onClimb||wantClimb)){this.vy=-620;this.onGround=false;this.onClimb=false;this.coyote=0;this.jumpBuffer=0;jumped=true}

  if(wantClimb&&!jumped){
   this.onClimb=true;
   this.vy=input.climb?-150:input.descend?150:0;
   this.x+=this.vx*dt;this.x=Math.max(0,Math.min(world.level.width-this.w,this.x));
   this.y+=this.vy*dt;this.onGround=false;
   if(this.y+this.h<=zone.y){this.y=zone.y-this.h;this.vy=0}
   if(this.y+this.h>=zone.y+zone.h){this.y=zone.y+zone.h-this.h;this.vy=0;this.onGround=true}
   this.state='climb';
  }else{
   this.onClimb=false;
   if(!input.jump&&this.vy<-360)this.vy=-360;
   this.vy=Math.min(720,this.vy+1000*dt);
   this.x+=this.vx*dt;world.resolveX(this);
   this.y+=this.vy*dt;this.onGround=false;world.resolveY(this);
   if(!this.onGround)this.state=this.vy<0?'jump':'fall';
   else if(Math.abs(this.vx)>25)this.state='run';
   else this.state='idle';
  }
  this.invincible=Math.max(0,this.invincible-dt);
 }
 hurt(respawn){if(this.invincible)return;Object.assign(this,{x:respawn.x,y:respawn.y,vx:0,vy:-180,state:'hurt',onClimb:false,invincible:1.2,coyote:0,jumpBuffer:0})}
}
