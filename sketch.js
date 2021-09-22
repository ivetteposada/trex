var trex,edges,ground,obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6,obstacle;

var PLAY=1, END=0, gameState=PLAY;
    
var score=0;

function preload(){
  
  trex_running=loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  trex_collided=loadAnimation("trex_collided.png")
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkSound=loadSound("checkPoint.mp3");
  
}

function setup(){
  
  createCanvas(600,200);
  

  
  //crea sprite de trex
  trex=createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  //crea los bordes
  edges=createEdgeSprites();


  //cambia tamaño y posicion del dinosaurio
  trex.scale=0.5;
  trex.x=50;
  
  ground=createSprite(200,180,400,20);
  ground.addImage("ground2.png", groundImage);
  ground.x=ground.width/2;
  
  gameOver=createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  
  restart=createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale=0.5
  
  invground=createSprite(200,190,400,10);
  invground.visible=false;
  
  obstaclesGroup=new Group();
  cloudsGroup=new Group();
}

function draw(){
  
  background("White");
  fill("black");
  text("Score: "+score,450,50);
  
  
  if(gameState===PLAY){
    
    ground.velocityX=-(4+3*score/100);
    
    score=score+Math.round(frameCount/60);
    
    if(ground.x<0){
      ground.x=200;
    }
      
    //hace que el dinosaurio salte
    if(keyDown("space")&&trex.y>=100){
      trex.velocityY=-10;
      jumpSound.play();
    }
  
    //asigna gravedad al dinosaurio
    trex.velocityY=trex.velocityY+0.8;
    
    score=score+Math.round(getFrameRate()/60);
    
    if(score>0&&score%100===0){
      checkSound.play();
    }
    
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
     // trex.velocityY=-12;
      //jumpSound.play();
      
      gameState=END;
      dieSound.play();
    }
    
    gameOver.visible=false;
    restart.visible=false;
    
  }else if (gameState===END){
    ground.velocityX=-0;
    trex.velocityY=0;
    
    trex.changeAnimation("collided", trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    gameOver.visible=true;
    restart.visible=true;
  }
  

  


  
  //hace que el dinosaurio no se caiga
  trex.collide(edges[3]);
  trex.collide([invground]);
  

  
 trex.setCollider("rectangle",0,30,trex.width,trex.height);
  trex.debug=false;

  if(mousePressedOver(restart)){
    reset();
  }  


  drawSprites();
}

function spawnClouds(){
  if(frameCount%60===0){
    cloud=createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    cloud.y=Math.round(random(10,100))
    cloud.scale=0.6
    cloud.velocityX=-3; 
    
    cloud.lifetime=200;
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    
   
    cloudsGroup.add(cloud);
    

  }
  
  
}  

  function spawnObstacles(){
    
    if(frameCount%60===0){
      obstacle=createSprite(600,165,10,40);
      
      obstacle.velocityX=-(6+score/100);
    
        console.log(obstacle.velocityX)
  
    var rand= Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default:break;
      }
      
      obstacle.scale=0.5;
      obstacle.lifetime=300;
      
      obstaclesGroup.add(obstacle);
    }
  
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score=0;
  
  trex.changeAnimation("running", trex_running);
}