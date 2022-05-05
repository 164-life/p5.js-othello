const CELL_SIZE = 50;
const Color={BLACK:0, WHITE:1, NONE:2};
const DISK_SIZE = 40;
const CELL_NUMBER = 8;
const MARGIN = CELL_NUMBER*6;
const W = CELL_NUMBER*CELL_SIZE + MARGIN*2;
const H = CELL_NUMBER*CELL_SIZE + MARGIN*2;

class Othello {
    constructor(){
        this.board = [];
        for(let i = 0; i < CELL_NUMBER; i++){
            this.board[i] = [];
            for(let j = 0; j < CELL_NUMBER; j++){
                this.board[i][j] = Color.NONE;
            }
        }
        let center = Math.floor(CELL_NUMBER/2);
        this.board[center-1][center-1] = Color.WHITE;
        this.board[center-1][center] = Color.BLACK;
        this.board[center][center-1] = Color.BLACK;
        this.board[center][center] = Color.WHITE;
    }

    draw_board(){
        push();
        fill(255,255,255);
        rect(0, 0, W, H);
        translate(MARGIN, MARGIN);
        for(let i = 0; i < CELL_NUMBER; i++){
            for(let j = 0; j < CELL_NUMBER; j++){
                fill(220,255,220);
                rect(i*CELL_SIZE,j*CELL_SIZE,CELL_SIZE,CELL_SIZE);
            }
        }
        pop();
    }

    draw_message(message = ''){
        fill(0,0,0);
        stroke(0,0,0);
        let color_name = turn_color == Color.BLACK ? "黒" : "白";
        text(color_name + 'の番', MARGIN*0.5, MARGIN*0.6);
        text(message, MARGIN*0.5, H-MARGIN*0.4);
    }

    draw_disk(x, y, color){
        if(color==Color.NONE){
            return;
        }
        push();
        translate(MARGIN, MARGIN);
        let rgb = color==Color.BLACK ? [0,0,0] : [255,255,255];
        fill(...rgb);
        ellipse(x*CELL_SIZE+CELL_SIZE/2, y*CELL_SIZE+CELL_SIZE/2, DISK_SIZE);
        pop();
    }

    draw_disks(){
        for(let i = 0; i < CELL_NUMBER; i++){
            for(let j = 0; j < CELL_NUMBER; j++){
                this.draw_disk(i, j, this.board[i][j]);
            }
        }
    }

    turned_over_disks(x, y, color){
        if(this.board[x][y]!=Color.NONE){
            return [];
        }
        let directions = [
            [0,1],
            [1,0],
            [1,1],
            [1,-1],
            [-1,1],
            [-1,-1],
            [-1,0],
            [0,-1]
        ];
        let disks = [];
        for(let i = 0; i < directions.length; i++){
            let dx = directions[i][0];
            let dy = directions[i][1];
            let x2 = x;
            let y2 = y;
            let temp_disks = [];
            while(true){
                x2 += dx;
                y2 += dy;
                if(x2<0 || x2>=CELL_NUMBER || y2<0 || y2>=CELL_NUMBER){
                    break;
                }
                if(this.board[x2][y2]==1-color){ // opposite color
                    temp_disks.push([x2, y2]);
                }else if(this.board[x2][y2]==color){
                    disks.push(...temp_disks);
                    break;
                }else{
                    break;
                }
            }
        }
        return disks;
    }

    is_placeable(x, y, color){
        return this.turned_over_disks(x, y, color).length > 0;
    }

    place(x, y, color){
        let disks = this.turned_over_disks(x, y, color);
        for(let i = 0; i < disks.length; i++){
            let [x2, y2] = disks[i];
            this.board[x2][y2] = color;
        }
        this.board[x][y] = color;
    }

    draw_placeable(x, y){
        push();
        translate(MARGIN, MARGIN);
        stroke(255,0,0);
        line(x*CELL_SIZE, y*CELL_SIZE, x*CELL_SIZE+CELL_SIZE, y*CELL_SIZE+CELL_SIZE);
        line(x*CELL_SIZE+CELL_SIZE, y*CELL_SIZE, x*CELL_SIZE, y*CELL_SIZE+CELL_SIZE);
        pop();
    }

    draw_placeables(color){
        let cells = [];
        for(let i = 0; i < CELL_NUMBER; i++){
            for(let j = 0; j < CELL_NUMBER; j++){
                if(this.is_placeable(i, j, color)){
                    this.draw_placeable(i, j);
                    cells.push([i, j]);
                }
            }
        }
        return cells;
    }

    count_disks(){
        let black = 0;
        let white = 0;
        for(let i = 0; i < CELL_NUMBER; i++){
            for(let j = 0; j < CELL_NUMBER; j++){
                if(this.board[i][j]==Color.BLACK){
                    black++;
                }else if(this.board[i][j]==Color.WHITE){
                    white++;
                }
            }
        }
        return [black, white];
    }

}

var holding = false;
var game = null;
var turn_color = Color.BLACK;

function getRandomInt(min, max) {
  return min+Math.floor(Math.random() * Math.floor(max-min));
}

function preload(){
    
}

function setup(){
    var canvas = createCanvas(W,H);
    canvas.parent('canvas');
    reset();
}

function reset(){
    game = new Othello();
    textSize(W/20);
    stroke(0,0,0);
    fill(0,0,0);
    background(255,255,255);
    strokeJoin(ROUND);
    turn_color = Color.BLACK;
    game.draw_board();
    game.draw_disks();
    game.draw_placeables(turn_color);
    game.draw_message();
}

function mousePressed(){
    holding = true;
    
    let x = Math.floor((mouseX-MARGIN)/CELL_SIZE);
    let y = Math.floor((mouseY-MARGIN)/CELL_SIZE);
    if(x<0 || x>=CELL_NUMBER || y<0 || y>=CELL_NUMBER){
        return;
    }
    if(game.is_placeable(x, y, turn_color)){
        game.draw_board();
        game.place(x, y, turn_color);
        game.draw_disks();

        turn_color = 1 - turn_color;
        let placeable_cells = game.draw_placeables(turn_color);
        if(placeable_cells.length==0){
            turn_color = 1 - turn_color;
            placeable_cells = game.draw_placeables(turn_color);
            if(placeable_cells.length==0){
                disk_count = game.count_disks();
                if(disk_count[0]>disk_count[1]){
                    game.draw_message('ゲーム終了 '+String(disk_count[0])+'対'+String(disk_count[1])+' で黒の勝ち');
                }else if(disk_count[0]<disk_count[1]){
                    game.draw_message('ゲーム終了 '+String(disk_count[0])+'対'+String(disk_count[1])+' で白の勝ち');
                }else{
                    game.draw_message('ゲーム終了 '+String(disk_count[0])+'対'+String(disk_count[1])+' で引き分け');
                }
            }else{
                game.draw_message('置ける場所が無いためパスしました');
            }
        }else{
            game.draw_message();
        }
    }
}

function mouseReleased() {
    holding = false;

}

function touchStarted(){
    mousePressed();
}

function touchEnded(){
    mouseReleased();
}

function draw(){
    
}