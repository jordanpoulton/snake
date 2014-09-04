Setup

```sh
touch snake.html
touch snake.js
```

In snake.html let's create a canvas

```html
<canvas id="canvas" width="450" height="450"></canvas>
```

This will be the 'board' - the area in which you play your game

Then add the jQuery link:
```html
<!-- Jquery -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
```html

This will allow you to use jQuery - a javascript library

And link the JS and HTML files (add this to the html file)

```html
<script src="snake.js"></script>
```html

Now you set up the canvas (snake.js):

```js
$(document).ready(function(){
  //Canvas stuff
  var canvas = $("#canvas")[0];
  var context = canvas.getContext("2d");
  var width = $("#canvas").width();
  var height = $("#canvas").height();
  })
```

Add in the code that will paint the canvas (all inside the document.ready function unless otherwise stated):

```js
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "black";
  context.strokeRect(0, 0, width, height);
```

Now Lets create the snake:

```js
    var snake_array; //an array of cells to make up the snake
```

NB put this var up top with the other vars

```js
    function create_snake()
    {
      var length = 5; //Length of the snake
      snake_array = []; //Empty array to start with
      for(var i = length; i>0; i--)
      {
        //This will create a horizontal snake starting from the top left
        snake_array.push({x: i, y:0});
      }
    }
    create_snake();
```

Lets paint the snake now (still in the document.ready function)

```js
  function paint()
  {
    for(var i = 0; i < snake_array.length; i++)
    {
      var snake_cell = snake_array[i];
      //Lets paint 10px wide cells
      context.fillStyle = "blue";
      context.fillRect(snake_cell.x*10, snake_cell.y*10, 10, 10);
      context.strokeStyle = "white";
      context.strokeRect(snake_cell.x*10, snake_cell.y*10, 10, 10);
    }
  }
  paint();
```js

Create a cell width variable, set it to 10 and then replace the fillRect and strokeRect 10's with the cell_width

```js
var cell_width = 10
```

Lets move the snake now using a timer which will trigger the paint function. It will refresh every 60ms but can be changed. This code goes right before the close of document.ready
  game_loop = setInterval(paint, 60);

The movement code for the snake to come now, as the first bit of code in the paint() function.
    The logic is simple
    Pop out the tail cell and place it infront of the head cell
    ```js
    var head_x_position = snake_array[0].x;
    var head_y_position = snake_array[0].y;
    ```
    These were the position of the head cell.
    We will increment it to get the new head position
    ```js
    head_x_position++;

    var tail = snake_array.pop(); //pops out the last cell
    tail.x = head_x_position;
    snake_array.unshift(tail); //puts back the tail as the first cell
    ```

To avoid the snake trail we need to remove the code that paints the background and move it into the top of the paint() function so that we paint the BackGround on every frame
```js
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "black";
  context.strokeRect(0, 0, width, height);
```
Lets add proper direction based movement now (replaces the head_x_position++ code that we currently have (line 85))

Set the direction default (with other variables):
```js
var direction = "right"; //default direction
```

then replace ```head_x_position++``` with:

```js
    if(direction == "right") head_x_position++;
    else if(direction == "left") head_x_position--;
    else if(direction == "up") head_y_position--;
    else if(direction == "down") head_y_position++;
```

Lets add the keyboard controls now (below the code for painting the background)

```js
  $(document).keydown(function(input){
    var pressed_key = input.which;
    //We will add another clause to prevent reverse gear
    if(pressed_key == "37") direction = "left";
    else if(pressed_key == "38") direction = "up";
    else if(pressed_key == "39") direction = "right";
    else if(pressed_key == "40") direction = "down";
  })
```
Demo by letting it go right for a sec then hitting left (this is the only directional demo that is poss right now)

Allow for up/down movement by replacing
```js
tail.x = head_x_position;
```
with
```js
tail.x = head_x_position; tail.y = head_y_position;
```

The snake is now keyboard controllable

Lets add the game over clauses now (under keyboard controller code)
This will restart the game if the snake hits the wall

```js
  if(head_x_position === -1 || head_x_position === width/cell_width || head_y_position === -1 || head_y_position === height/cell_width)
  {
    //restart game
    return;
  }
```


Lets organize the code a bit now.
Change ```var direction = right``` to:

```js
  var d;
```

Then create an initialisation function

```js
    function init()
    {
      d = "right"; //default direction
      create_snake();
    }
```

**Move game_loop inside init() function**

Call init(); at the end of the function (where game loop was)

```js
  init();
```

Add the following code above the game_loop:

```js
  if(typeof game_loop != "undefined") clearInterval(game_loop);
```

Add init(); above 'return' in game over clause

Lets create the food now (above the paint function)

```js
  function create_food()
  {
    food = {
      x: Math.random()*(w-cw)/cw,
      y: Math.random()*(h-cw)/cw,
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }
```

Next step is to paint the food (below where you paint the background canvas), but intermediate step is to create a
paint_cell() function (put before keyboard controls)

```js
function paint_cell(x, y)
  {
    context.fillStyle = "blue";
    context.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
    context.strokeStyle = "white";
    context.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
  }
```

Now switch the background painting code for snake_cell code (at the bottom):

```js
paint_cell(snake_cell.x, snake_cell.y);
```

Now paint the food below where you paint the snake (which now says paint_cell(snake_cell.x, snake_cell.y):

```js
    paint_cell(food.x, food.y);
```

don't forget to add:

```js
var food;
```

And add

```js
create_food();
```

below the create_snake(); function

Now we can see the food particle!

Lets write the code to make the snake eat the food (after game over clauses)
    The logic is simple
    If the new head position matches with that of the food,
    Create a new head instead of moving the tail
    
    ```js
    if(head_x_position == food.x && head_y_position == food.y)
    {
      var tail = {x: head_x_position, y: head_y_position};
    }
    else
    {

    }
    ```

The 'else' situation refers to whenever you AREN'T eating the food now... So where it currently says:

```js
var tail = snake_array.pop(); //pops out the last cell
tail.x = head_x_position; tail.y = head_y_position;
snake_array.unshift(tail); //puts back the tail as the first cell
```

We need to move the first two lines from ALWAYS (as they currently are) to 'WHEN not eating food, which is in the else clause above'

Then add a create_food(); call after eating the food particle (in the first part of the if statement.

You also need to update the create_food function slightly to (adding Math.round):

```js
  function create_food()
  {
    food = {
      x: Math.round(Math.random()*(w-cw)/cw),
      y: Math.round(Math.random()*(h-cw)/cw),
    };
```

The snake can now eat food!

Now we want code for body collision (add above Keyboard controls)

```js
function check_collision(x, y, array)
  {
    //This function will check if the provided x/y coordinates exist
    //in an array of cells or not
    for(var i = 0; i < array.length; i++)
    {
      if(array[i].x == x && array[i].y == y)
       return true;
    }
    return false;
  }
```

Add to trio of || in the game over clauses:

```js
|| check_collision(head_x_position, head_y_position, snake_array)
```

NB you may have a || || (too many ors) if it doesn't work right now
Now the game will end if the snake self-collides

Finally, let's keep track of score (add code below create_food();):

```js
score = 0;
```

add var score below var food

add score++ nto the if statement for when the snake eats the food (should look like this (line 271 is the new bit!):)

Create a new head instead of moving the tail

```js
    if(head_x_position == food.x && head_y_position == food.y)
    {
      var tail = {x: head_x_position, y: head_y_position};
      score++;
      create_food();
    }

    //Lets paint the score (below paint_cell(food.x, food.y);)
    var score_text = "Score: " + score;
    context.fillText(score_text, 5, height-5)
  }
```js

Next steps?
--> Use CSS to make page pretty
---> Improve the HTML on the site to explain what it is and how to play
--> Add social sharing
--> Upload this to the internet and share with friends!

