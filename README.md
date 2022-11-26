# game-2048
2048 clone JavaScript game

Description: My attempt at a simple 2048 game clone using an HMTL canvas.
Created as an opportunity to develop my understanding of Javascript in preparation for my application to join the Founders and Coders Skills Bootcamp programme.

Reflection
==========

This was my favourite project! An almost pure JavaScript game with a small amount of HTML/CSS.

I decided to have a go at creating a clone of the fiendishly difficult but addictive 2048 game. The game involves using the arrow keys to slide blocks, each with a number on, across a grid. When two blocks of the same value are slid into each other, they combine and their value doubles. Each time the blocks move, a randomly generated block with a 2 or 4 value is placed in a free grid space. The game is over when no more new blocks can be placed and no slides are possible. I loved the constant problem solving that this project brought and the challenge of developing the gameplay algorithms.

I would like to further develop this in the future to use CSS to draw the board rather than an HTML canvas. This would enable me to focus on animating the tiles as they move. I'd also like to add some kind of gesture control so that it could be played on touch devices, although this feels beyond the scope of a vanilla JavaScript project like this.

Key learning:

LOTS of JavaScript!
Use of JavaScript classes for encapsulation and to improve code readability
WCAG compliant contrasting colour combinations
HTML canvas drawing
Capturing and handling keyboard input


Next steps:

Animate the block slides smoothly using CSS delta T animations
Add game controls for touch devices (game is not playable without a keyboard)