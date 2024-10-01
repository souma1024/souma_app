const BLACK = 1;
const WHITE = -1;
let ORDER = 0;
let ONCE = 0;
let ONCES=0;
let WINNER=[];

function assignEventListener(){
    const judgeData = new JudgeData();
    const spaces = document.querySelectorAll(".space");

    for(let i=0;i<64;i++){
        spaces[i].addEventListener("click", wrapGame(judgeData));
    }

    const reset = document.querySelector(".button");
    reset.addEventListener("click",()=>{
        init();
        judgeData.init();
    });

}
function resetEventListener(){
    
}
function wrapGame(judgeData){
    function game(e){
        let X = e.pageX;
        let Y = e.pageY;
        transInt(X,Y,judgeData.board);
        buttonclick(judgeData.board);
        pass(judgeData.board,0);
        ONCE=0;
        ONCES=0;
    }
    return game;
}


function transInt(X,Y,judgeData){

    let which = ORDER%2 === 0 ? BLACK : WHITE;
    let notwhich = ORDER%2 === 0 ? WHITE : BLACK;

    const parameter = [-1,0,1];

    const intX = Math.floor((X-331)/75)+1;
    const intY = Math.floor((Y-9)/75)+1;

    const compare = JSON.parse(JSON.stringify(judgeData));

    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            flipJudge(intX,intY,judgeData,which,notwhich,parameter[i],parameter[j],mode=true);
        }
    }

    if(JSON.stringify(compare) === JSON.stringify(judgeData)){
        ORDER = ORDER;
    }else{
        ORDER++;
    }

    return judgeData;
}
class JudgeData{
    constructor(){
        this.init();
    }
    init(){
        this.board = [
            [99,99,99,99,99,99,99,99,99,99],
            [99,0,0,0,0,0,0,0,0,99],
            [99,0,0,0,0,0,0,0,0,99],
            [99,0,0,0,0,0,0,0,0,99],
            [99,0,0,0,-1,1,0,0,0,99],
            [99,0,0,0,1,-1,0,0,0,99],
            [99,0,0,0,0,0,0,0,0,99],
            [99,0,0,0,0,0,0,0,0,99],
            [99,0,0,0,0,0,0,0,0,99],
            [99,99,99,99,99,99,99,99,99,99] 
        ]
    }
}

function flipJudge(intX,intY,judgeData,which,notwhich,i,j,){

    if(i ===0 && j===0){
        return;
    }

    if(judgeData[intY+i][intX+j] !== notwhich){
        return;
    }
    
    let stack =[which];

    let k=0;
    let c=0;
    let d=0;

    while(judgeData[intY+i+c][intX+j+d] !==99 && judgeData[intY+i+c][intX+j+d] !== 0){
        stack.push(judgeData[intY+i+c][intX+j+d]);
        if(stack[0] === stack[stack.length-1] && k<1){
            while(stack.length !==0){
                judgeData[intY+i+c][intX+j+d] =which;
                stack.pop();
                c -=i;
                d -=j;  
            }
            k++;
        }
        c += i;
        d += j;
    }
    
    return judgeData;

}

function buttonclick(judgeData){
    const spaces = document.querySelectorAll(".space");

    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(judgeData[i+1][j+1] === 1){
                spaces[i*8+j].classList.remove("white_circle");
                spaces[i*8+j].classList.add("black_circle");
            }
        }
    }

    
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(judgeData[i+1][j+1] ===-1){
                spaces[i*8+j].classList.remove("black_circle");
                spaces[i*8+j].classList.add("white_circle");
            }
        }
    }

    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(judgeData[i+1][j+1] ===0 ){
                spaces[i*8+j].classList.remove("white_circle");
                spaces[i*8+j].classList.remove("black_circle"); 
            }
        }
    }
    
}

function init(){

    ORDER = 0;
    const spaces = document.querySelectorAll(".space");
    for(const space of spaces){
        space.classList.remove("white_circle"); 
        space.classList.remove("black_circle");
    }
    
    spaces[27].classList.add("white_circle");
    spaces[28].classList.add("black_circle");
    spaces[35].classList.add("black_circle");
    spaces[36].classList.add("white_circle");
}

function pass(judgeData,s){

    if(s>64){
        return;
    }

    let compares = JSON.parse(JSON.stringify(judgeData));

    let which = ORDER%2 === 0 ? BLACK : WHITE;
    let notwhich = ORDER%2 === 0 ? WHITE : BLACK;

    let parameter = [-1,0,1]; 

    let once=0;
    
    if(s<64){
        if(compares[Math.floor(s/8)+1][s%8+1] ===0){
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    flipJudge(s%8+1,Math.floor(s/8)+1,compares,which,notwhich,parameter[i],parameter[j]);
                    if(once ===0 && JSON.stringify(compares) !== JSON.stringify(judgeData)){
                        ONCE++;
                        once++;
                    }
                }
            }
        }
        pass(judgeData,s+1);
    }else{
        if(ONCE===0 && ONCES===0){
            if(ORDER%2===1){
                alert("白はパスです");
            }else{
                alert("黒はパスです");
            }
            WINNER.push(ORDER);

            console.log(WINNER);

            if(WINNER.length>1 && WINNER[WINNER.length-1] - WINNER[WINNER.length-2] === 1){
                    win(judgeData);
            }
            ORDER++;
        }
        ONCES++;
    }

}

function win(judgeData){

    let blackNumber =0;
    let whiteNumber =0;

    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(judgeData[i+1][j+1] ===1){
                blackNumber++;
            }

            if(judgeData[i+1][j+1] === -1){
                whiteNumber++;
            }
        }
    }

    if(blackNumber===whiteNumber){
        alert("引き分けです");
    }else if(blackNumber>whiteNumber){
        alert("黒の勝ちです");
    }else{
        alert("白の勝ちです");
    }

}



assignEventListener();
init();
