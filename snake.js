$(document).ready(function(){
  //Canvas stuff
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var width = $("#canvas").width();
  var height = $("#canvas").height();
  var cell_width = 10;
  var direction;
  var food;
  var score;
  var snake_array;

  function init(){
    direction = "right";
    create_snake();
    create_food();
    score = 0;
    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
  }

  function create_snake(){
    var length = 5;
    snake_array = [];
    for(var i = length; i>0; i--)
    {
      //This will create a horizontal snake starting from the top left
      snake_array.push({x: i, y:0});
    }
  };

  function create_food()
  {
    food = {
      x: Math.round(Math.random()*(width-cell_width)/cell_width),
      y: Math.round(Math.random()*(height-cell_width)/cell_width),
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }

  //Lets paint the snake now
  function paint()
  {
    var head_x_position = snake_array[0].x;
    var head_y_position = snake_array[0].y;

    function paint_board(){
      context.fillStyle = "white";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "black";
      context.strokeRect(0, 0, width, height);
    }
    paint_board();

    //THE LAST STEP OF REFACTORING IS THE NEXT - THE PAINT_BOARD FUNCTION WAS THE FIRST REFACTOR

    function paint_cell(x, y)
    {
      context.fillStyle = "blue";
      context.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
      context.strokeStyle = "white";
      context.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
    }

    //Lets add the keyboard controls now (below the code for painting the background)
    $(document).keydown(function(input){
      var pressed_key = input.which;
      //We will add another clause to prevent reverse gear
      if(pressed_key == "37") direction = "left";
      else if(pressed_key == "38") direction = "up";
      else if(pressed_key == "39") direction = "right";
      else if(pressed_key == "40") direction = "down";
    })

    function move_snake(){
      //These were the position of the head cell.
      //We will increment it to get the new head position
      if(direction == "right") head_x_position++;
      else if(direction == "left") head_x_position--;
      else if(direction == "up") head_y_position--;
      else if(direction == "down") head_y_position++;
    }
    move_snake();

    function check_collision(x, y, array){
      for(var i = 0; i < array.length; i++){
        if(array[i].x == x && array[i].y == y)
         return true;
     }
      return false;
    }

    //Game over clauses
    //This will restart the game if the snake hits the wall or collides with itself
    if(head_x_position === -1 || head_x_position === width/cell_width || head_y_position === -1 || head_y_position === height/cell_width || check_collision(head_x_position, head_y_position, snake_array))
    {
      //restart game
      init();
      return;
    }

    //Code to make the snake eat the food
    //The logic is simple: If the new head position matches with that of the food,
    //Create a new head instead of moving the tail
    if(head_x_position == food.x && head_y_position == food.y)
    {
      var tail = {x: head_x_position, y: head_y_position};
      score++;
      create_food();
    }
    else
    {
      var tail = snake_array.pop(); //pops out the last cell
      tail.x = head_x_position; tail.y = head_y_position;
    }
    snake_array.unshift(tail); //puts back the tail as the first cell

    //Let's paint the snake cells and the food cells, and finally, the score.
    for(var i = 0; i < snake_array.length; i++)
    {
      var snake_cell = snake_array[i];
      paint_cell(snake_cell.x, snake_cell.y);
      paint_cell(food.x, food.y);
      var score_text = "Score: " + score;
      context.fillText(score_text, 5, height-5)
    }
  }
  init();
  paint();
})
