var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var Radius=[25,35,45];//constant, look at types
var Weigth=[1,2,3];//constant, look at types
var WeigthWords=['small','medium','big'];
var Balls=[];//[{x:100,y:100,type:0,checked:0,time:0},{x:180,y:120,type:1,checked:0,time:0},{x:30,y:150,type:2,checked:0,time:0}];
var Walls=[];//[{x1:20,y1:10,x2:70,y2:50},{x1:200,y1:170,x2:170,y2:150}];
var Speed=[];//[{dx:2,dy:2},{dx:3,dy:3},{dx:4,dy:1}];
var Color=[];//[0,1,2];
var WallColor=[];//[0,2];
var Styles=['red','blue','green'];
var ButtonText=["Continue","","Stop"];
var ButtonColor=["green","","red"];
var type=1;
//var tact=0;
var newSpeed={dx:0,dy:0};
var newSpeedWorkFlag=0;
var newBallType=0;
var newBallColor=0;

var newWallColor=0;

var tempSave={Balls:[],Walls:[],Speed:[],Color:[],WallColor:[]};

var number;//number of chosen element
function checkBall(i){
    if(Balls[i].checked==0){
        Balls[i].checked=1;
        Balls[i].time=0;
        return true;
    }
    else{
        Balls[i].time=0;//ball in need but you cant touch it
        return false;
    }
}
function ballTimerCalc(){
    for(var i=0;i<Balls.length;i++){
        Balls[i].time=Balls[i].time+1;
        if(Balls[i].time>1){
            Balls[i].checked=0;
        }
    }
}
function drawBalls() {
    function drawBall(i){
        ctx.beginPath();
        ctx.arc(Balls[i].x,Balls[i].y, Radius[Balls[i].type], 0, Math.PI*2);
        ctx.fillStyle = Styles[Color[i]];
        ctx.fill();
        ctx.closePath();
    }
    for (var i=0;i<Balls.length;i++){
        drawBall(i);
    }
}
function drawWalls(){
    function drawWall(i){
       // console.log("aaa")
        ctx.beginPath();
        console.log("redraw wall");
        console.log(WallColor[i]);
        ctx.strokeStyle=Styles[WallColor[i]];
        ctx.lineWidth=3;
        ctx.moveTo(Walls[i].x1,Walls[i].y1);
        ctx.lineTo(Walls[i].x2,Walls[i].y2);
        ctx.stroke();
    }
    for(var i=0;i<Walls.length;i++){
        drawWall(i);
    }
}
function canvas_arrow(i,context, fromx, fromy, tox, toy){
    function length(fromx,fromy,tox,toy){
        var a=Math.sqrt(Math.pow(fromx-tox,2)+Math.pow(fromy-toy,2));
        console.log(a);
        return a>0
    }
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    if(length) {
        ctx.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }
}
function drawWays(){
    for (var i=0;i<Balls.length;i++){
        canvas_arrow(i,ctx, Balls[i].x, Balls[i].y, Balls[i].x+Speed[i].dx*10, Balls[i].y+Speed[i].dy*10);
    }
}
function pointToWallDistance(Wall,Point){
    function correcting(t){
        var res=t;
        if(t<0)
            res=0;
        if(t>1)
            res=1;
        return res;
    }
    var first=((Point.x-Wall.x1)*(Wall.x2-Wall.x1)+(Point.y-Wall.y1)*(Wall.y2-Wall.y1));
    var second=Math.pow(Wall.x2-Wall.x1,2)+Math.pow(Wall.y2-Wall.y1,2);
    var t=correcting(first/second);
    var distance=Math.sqrt(Math.pow(Wall.x1-Point.x+(Wall.x2-Wall.x1)*t,2)+Math.pow(Wall.y1-Point.y+(Wall.y2-Wall.y1)*t,2));
    return distance;
}
function collisionCalculation(){
    function borderCollision(i){
            if (Balls[i].x + Speed[i].dx > canvas.width - Radius[Balls[i].type] || Balls[i].x + Speed[i].dx < Radius[Balls[i].type]) {
                    Speed[i].dx = -Speed[i].dx;
            }
            if (Balls[i].y + Speed[i].dy > canvas.height - Radius[Balls[i].type] || Balls[i].y + Speed[i].dy < Radius[Balls[i].type]) {
                    Speed[i].dy = -Speed[i].dy;
            }

    }
    function ballsCollision(){
        function ballCollisionCalculation(i,j){
            function dxSpeedCalculation(i,j){
                var A=(2*Weigth[Balls[j].type]*Speed[j].dx+Speed[i].dx*(Weigth[Balls[i].type]-Weigth[Balls[j].type]))/(Weigth[Balls[i].type]+Weigth[Balls[j].type]);

                return A;
            }
            function dySpeedCalculation(i,j){
                var A=(2*Weigth[Balls[j].type]*Speed[j].dy+Speed[i].dy*(Weigth[Balls[i].type]-Weigth[Balls[j].type]))/(Weigth[Balls[i].type]+Weigth[Balls[j].type]);
               // console.log("A="+A);
                return A;
            }
            var pSquared=Math.pow(Balls[i].x-Balls[j].x,2)+Math.pow(Balls[i].y-Balls[j].y,2);
            var p=Math.floor(Math.sqrt(pSquared));
            if(p<Radius[Balls[i].type]+Radius[Balls[i].type]) {
                if (checkBall(i)) {
                    A = dxSpeedCalculation(i, j);
                    B = dySpeedCalculation(i, j);
                    C = dxSpeedCalculation(j, i);
                    D = dySpeedCalculation(j, i);
                    console.log();
                    Speed[i].dx = A;
                    Speed[i].dy = B;
                    Speed[j].dx = C;
                    Speed[j].dy = D
                }
            }
            console.log();
        }
        for (var i=0;i<Balls.length;i++){
            for(var j=i+1;j<Balls.length;j++){
                    ballCollisionCalculation(i, j);
            }
        }
    }
    function wallsCollision(){
        function wallCollision(ball,wall){
            var distance=pointToWallDistance(Walls[wall],Balls[ball]);
            return distance<Radius[Balls[ball].type]
        }
        function wallCollisionChange(ball,wall){
            function speedNormalization(Dx,Dy,newDx,newDy){
                var first=Math.sqrt(Math.pow(Dx,2)+Math.pow(Dy,2));
                var second=Math.sqrt(Math.pow(newDx,2)+Math.pow(newDy,2));
                var result=first/second;
                return result;
            }
            function findSinus(a,b,Speed) {//a*b!=0;
               function standartCalc(a,b,Speed){
                    var beta = Math.atan(Math.abs(Speed.dy / Speed.dx));
                    var alpha = Math.atan(Math.abs(b / a));
                    if (a * b * Speed.dx * Speed.dy > 0) {
                        return Math.sin(Math.PI / 2 - Math.abs(beta - alpha));
                    }
                    else {
                        return Math.sin(Math.PI/2 - alpha - beta);
                    }
                }//Vx*Vy!=0
                function zeroedCalc(a,b,Speed){
                    var alpha = Math.atan(Math.abs(b / a));
                    if(Speed.dy==0){
                        return Math.sin(Math.PI/2-alpha);
                    }
                    else{//dx=0
                        return Math.sin(alpha);
                    }
                }//Vx*Vy==0
                if(Speed.dx*Speed.dy!=0) {
                    var sinus=standartCalc(a,b,Speed);
                    return sinus;
                }
                else{
                    var sinus=zeroedCalc(a,b,Speed);
                    return sinus;
                }
            }
            function sqrtCalculation(a,b,Speed){
                var first=Math.sqrt(Math.pow(Speed.dx,2)+Math.pow(Speed.dy,2));
                var second=Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
                var normalizer=first/second;
                return normalizer;
            }
            function borderPointCollisionCalculation(a,b,Speed){
                if(a/b==Speed.dx/Speed.dy){//line and speed have same vectors -> V=-V
                    Speed.dx=-Speed.dx;
                    Speed.dy=-Speed.dy;
                }
                else{
                    if(a/b>Speed.dx/Speed.dy)
                        Speed.dx=-Speed.dx;
                    else
                        Speed.dy=-Speed.dy;
                }
            }
            var a=Walls[wall].x2-Walls[wall].x1;
            var b=Walls[wall].y2-Walls[wall].y1;
            if(Balls[ball].checked==0) {
                if(a==0)//I want to avoid calculation for walls with delta(x)=0 || delta(y)=0 -> then make that
                    a=0.001;
                if(b==0)
                    b=0.001;
                var sinus = findSinus(a, b, Speed[ball]);
                if(sinus<0.99) {
                    var sqrtM = sqrtCalculation(a, b, Speed[ball]);
                    var newVx = -Speed[ball].dx + Math.sign(a) * Math.sign(Speed[ball].dx) * 2 * sqrtM * sinus * a;
                    var newVy = -Speed[ball].dy + Math.sign(a) * Math.sign(Speed[ball].dx) * 2 * sqrtM * sinus * b;
                    var normalizer = speedNormalization(Speed[ball].dx, Speed[ball].dy, newVx, newVy);
                    Speed[ball].dx = newVx * normalizer;
                    Speed[ball].dy = newVy * normalizer;
                }
                else{
                    borderPointCollisionCalculation(a,b,Speed[ball]);
                }
                checkBall(ball);
            }
        }
        for(var i=0;i<Balls.length;i++){
            for (var j=0;j<Walls.length;j++){

                    if (wallCollision(i, j)) {
                        if(Balls[i].checked==0) {
                            wallCollisionChange(i, j);
                        }
                        else{
                            Balls[i].time=0;
                        }
                    }


            }
        }
    }
    for(var i=0;i<Balls.length;i++){//to border
        borderCollision(i);
    }
    ballsCollision();
    wallsCollision();
}
function positionRecalculation(){
    function ballPosition(i){
        Balls[i].x+=Speed[i].dx;
        Balls[i].y+=Speed[i].dy;
    }
    for(var i=0;i<Balls.length;i++){
        ballPosition(i);
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBalls();
    drawWalls();
    collisionCalculation();
    drawWays();
}
function stopButtonClicked(){
    type=type*(-1);
    document.getElementById("StopButton").innerText=ButtonText[type+1];
    document.getElementById("StopButton").style.backgroundColor=ButtonColor[type+1];
}
function changeBallColor(i){
    newBallColor=i;
}
function changeWallColor(i){
    console.log("Change new wall color");
    console.log(i);
    newWallColor=i;
}
function changeSize(i){
    newBallType=i;
}
function isOnBall(){
    function distanceFromBall(i){
        var pSquared=Math.pow(event.clientX-Balls[i].x,2)+Math.pow(event.clientY-Balls[i].y,2);
        var p=Math.floor(Math.sqrt(pSquared));
        return p;
    }
    for(var i=0;i<Balls.length;i++){
        var p=distanceFromBall(i);
        if(p<=Radius[Balls[i].type]+3){//take little bit more - have some problems with little balls
            return i;
        }
    }
    return -1;
}
function isOnWall(){
    function distanceFromWallPoint(i,j) {
        if(j==1){
            console.log(Walls[i].x1);
            console.log(event.clientX);
            console.log(Walls[i].y1);
            console.log(event.clientY);
            var a=Math.pow(Walls[i].x1-event.clientX,2)+Math.pow(Walls[i].y1-event.clientY,2);
            console.log("a="+a);
            return Math.sqrt(a);
        }
        else{
            var a=Math.pow(Walls[i].x2-event.clientX,2)+Math.pow(Walls[i].y2-event.clientY,2);
            console.log("a="+a);
            return Math.sqrt(a);
        }
    }
    for(var i=0;i<Walls.length;i++){
        var p=distanceFromWallPoint(i,1);
        var p2=distanceFromWallPoint(i,2);
        if(p<=12){//take little bit more - have some problems with wall points
            return {i:i,num:1};
        }
        if(p2<=12){
            return {i:i,num:2};
        }

    }
    return -1;
}
function arrowReDraw(){
    function preDrawNewArrow(){
        function newSpeedRecalculation(number){
            newSpeed.dx=(event.clientX-Balls[number].x)/10;
            newSpeed.dy=(event.clientY-Balls[number].y)/10;
        }
        if(newSpeedWorkFlag==1) {
            newSpeedRecalculation(number);
            draw();
            canvas_arrow(number, ctx, Balls[number].x, Balls[number].y, Balls[number].x + newSpeed.dx * 10, Balls[number].y + newSpeed.dy * 10);
        }
    }
    function drawNewArrow(){
        newSpeedWorkFlag=0;
        canvas.removeEventListener('mousemove',preDrawNewArrow);
        canvas.removeEventListener('mouseup',drawNewArrow);
        Speed[number].dx=newSpeed.dx;
        Speed[number].dy=newSpeed.dy;
        newSpeed.dx=0;
        newSpeed.dy=0;
        draw();
    }
    if(type==-1){
        newSpeedWorkFlag=1;
        var number=isOnBall();
        if(number>=0) {
            canvas.addEventListener('mouseup', drawNewArrow);
            canvas.addEventListener('mousemove', preDrawNewArrow);
        }
    }
}
function addBallFuncCreation(){
    function typeButtonFuncCreation(){

        for(var i=0;i<Weigth.length;i++){
            var element=document.createElement('div');
            element.innerHTML= element.innerHTML+'<input name="BSize" type="radio" id='+i+' onclick="changeSize('+i+')">'+WeigthWords[i];
            document.getElementById("ballSize").appendChild(element);
        }
        document.getElementById(0).checked=true;
    }
    function colorButtonFuncCreation(){
        for(var i=0;i<Weigth.length;i++){
            var element=document.createElement('div');
            var a=i+100;
            element.innerHTML= element.innerHTML+'<input name="BColor" type="radio" id='+a+' onclick="changeBallColor('+i+')">'+Styles[i];
            document.getElementById("ballColor").appendChild(element);
        }
        document.getElementById(100).checked=true;
    }
    function colorWallFuncCreation() {
        for(var i=0;i<Weigth.length;i++){
            var element=document.createElement('div');
            var a=i+200;
            element.innerHTML= element.innerHTML+'<input name="WColor" type="radio" id='+a+' onclick="changeWallColor('+i+')">'+Styles[i];
            document.getElementById("wallColor").appendChild(element);
        }
        document.getElementById(200).checked=true;
    }
    typeButtonFuncCreation();
    colorButtonFuncCreation();
    colorWallFuncCreation();
}
function preStartWork(){
    canvas.addEventListener('mousedown',arrowReDraw);
    addBallFuncCreation();
}
function addNewBall(){
    function drawNewBall(){
        var newBall = {x: event.clientX, y: event.clientY, type: newBallType,checked:0,time:0};
        Balls.push(newBall);
        Speed.push({dx: 0, dy: 0});
        Color.push (newBallColor);
        console.log(Balls);
        document.removeEventListener('dblclick',drawNewBall);
        document.getElementById('addBallButton').style.background="white";
        draw();
    }
    if(type==-1) {
        document.addEventListener('dblclick',drawNewBall);
        document.getElementById('addBallButton').style.background="red";
    }
}
function addNewWall(){
    var newWall;
    function preDrawWall(){
        draw();
        ctx.beginPath();
        ctx.strokeStyle=Styles[newWallColor];
        ctx.moveTo(newWall.x1, newWall.y1);
        ctx.lineWidth=2;
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
    }
    function drawSecondWallPoint(){
        newWall.x2=event.clientX;
        newWall.y2=event.clientY;
        Walls.push(newWall);
        WallColor.push(newWallColor);
        document.removeEventListener('mouseup',drawSecondWallPoint);
        document.removeEventListener('mousemove',preDrawWall);
        document.getElementById('addWallButton').style.background="white";
        draw();
    }
    function drawFirstWallPoint(){
        console.log(event.clientX+" "+event.clientY);
        newWall.x1=event.clientX;
        newWall.y1=event.clientY;
        document.removeEventListener('mousedown',drawFirstWallPoint);
        document.addEventListener('mouseup',drawSecondWallPoint);
        document.addEventListener('mousemove',preDrawWall);

    }
    if(type==-1) {
        newWall={x1:0,y1:0,x2:0,y2:0};
        document.addEventListener('mousedown', drawFirstWallPoint);
        document.getElementById('addWallButton').style.background="red";
    }
}
function proveButtonChanges(){

    if(number!=-1) {

        Balls[number].type = newBallType;
        Color[number] = newBallColor;
        number = -1;
        changeInfo();
        draw();
    }
}
function proveWallChanges(){
    console.log("prove Ch");
    if(number!=-1) {
        console.log("number.i="+number.i);
        console.log("nwc="+newWallColor);
        WallColor[number.i] = newWallColor;

        console.log("Walls colors");
        console.log(WallColor);

        number = -1;
        changeInfo();
        draw();
    }
}
function changeInfo(i,type){
    var div=document.getElementById("chosenObjectInfo");
    if(i==undefined){
        div.innerText="Nothing";
        number=-1;
        document.getElementById('selectButton').style.background="white";
    }
    else {
        if (type == 1) {
            div.innerText = "Ball #" + i;
        }
        if (type == 2) {
            div.innerText = "Wall #" + i.i;
        }
    }
}
function selectObject(){
    function whatIsIt() {
        function ballMove() {
            console.log("move");
            Balls[number].x = event.clientX;
            Balls[number].y = event.clientY;
            draw();
        }
        function ballStop() {
            console.log("stop");
            document.removeEventListener('mousemove', ballMove);
            document.removeEventListener('click', ballStop);
        }
        function wallMove() {
            console.log("move wall");
            if(number.num==1){
                Walls[number.i].x1=event.clientX;
                Walls[number.i].y1=event.clientY;
            }
            else{
                Walls[number.i].x2=event.clientX;
                Walls[number.i].y2=event.clientY;
            }
            draw();
        }
        function wallStop(){
            console.log("wall stop");
            document.removeEventListener('mousemove', wallMove);
            document.removeEventListener('click', wallStop);
        }
        function deleteElement(){
            function deleteBall(){
                function removeElementInBallMass(i){
                    console.log("remove element"+i);
                    Balls.splice(i,1);
                    Color.splice(i,1);
                    Speed.splice(i,1);
                }
                if(number!=-1) {
                    console.log("delete ball");
                    removeElementInBallMass(number);
                    document.removeEventListener('mousemove', ballMove);
                    document.removeEventListener('click', ballStop);
                    document.getElementById('prove').removeEventListener('click', proveButtonChanges);

                    changeInfo();
                    draw();
                }
                document.getElementById('delete').removeEventListener('click', deleteElement);
            }
            function deleteWall(){
                function removeElementInWallMass(i){
                    console.log("remove element"+i);
                    Walls.splice(i,1);
                    WallColor.splice(i,1);
                }
                if(number!=-1) {
                    console.log("delete wall");
                    removeElementInWallMass(number.i);
                    document.removeEventListener('mousemove', wallMove);
                    document.removeEventListener('click', wallStop);
                    document.getElementById('prove').removeEventListener('click', proveWallChanges);
                    changeInfo();
                    draw();
                }
                document.getElementById('delete').removeEventListener('click', deleteElement);
            }
            console.log(number+" "+number.i+" "+number.num);
            if(number.num!=undefined)//wall
            {
                deleteWall();
            }
            else{
                deleteBall();
            }
        }
        console.log("isOnBall?");
        number = isOnBall();
        if (number != -1) {//if is it ball
            console.log("select ball");
            changeInfo(number,1);
            document.getElementById('prove').addEventListener('click', proveButtonChanges);
            document.getElementById('delete').addEventListener('click',deleteElement);
            document.addEventListener('mousemove', ballMove);
            document.addEventListener('click', ballStop);
            document.removeEventListener('dblclick', whatIsIt);
            document.removeEventListener('mousedown', whatIsIt);
        }
        else {
            console.log("isOnWall?");
            number = isOnWall();
            console.log("number="+number);
            if (number != -1) {//if is it wall point
                console.log("select wall");
                changeInfo(number,2);
                document.removeEventListener('mousedown', whatIsIt);
                document.getElementById('prove').addEventListener('click', proveWallChanges);
                document.getElementById('delete').addEventListener('click',deleteElement);
                document.addEventListener('mousemove', wallMove);
                document.addEventListener('click', wallStop);
                document.removeEventListener('mousedown', whatIsIt);
            }
        }
    }
    document.addEventListener('mousedown', whatIsIt);
    document.getElementById('selectButton').style.background="red";
}
function saveGame(){
    if(type==-1) {
        tempSave = {Balls: Balls.slice(), Walls: Walls.slice(), Speed: Speed.slice(), Color: Color.slice(), WallColor: WallColor.slice()};
        console.log("tempSave");
        console.log(tempSave);
        var oReq = new XMLHttpRequest();
        var body=JSON.stringify(tempSave);
        oReq.open('POST','/save');
        oReq.setRequestHeader('Content-Type', 'application/json');
        oReq.send(body);
    }
}
function loadGame(){
    if(type==-1) {
        console.log("Load");
        var getPromise=new Promise(function(req,res){
            var oReq = new XMLHttpRequest();
            function handler(){
                var text = JSON.parse(this.responseText);
                Balls = (text.Balls).slice();
                Walls = text.Walls.slice();
                Speed = text.Speed.slice();
                Color = text.Color.slice();
                WallColor = text.WallColor.slice();
                draw();
            }
            oReq.addEventListener('load', handler);
            oReq.open('GET', '/load');
            oReq.setRequestHeader('Content-Type', 'application/json');
            oReq.send();
        })
    }
}
function work(){
    if(type==1){
        positionRecalculation();
        draw();
        //tact++;
        ballTimerCalc();
    }
}

setInterval(work, 10);