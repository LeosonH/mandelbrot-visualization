# Mandelbrot Set Visualization
Rendering the Mandelbrot Set in Javascript
----
JS source file: [docs/appscripts/mandelbrot.js](https://github.com/LeosonH/mandelbrot-viz/tree/master/docs/appscripts/mandelbrot.js)

The canvas is displayed in HTML by DOM reference.

**View the visualization [here](https://leosonh.github.io/mandelbrot-viz/mandelbrot.html)!**

----
**The Mandelbrot Set** is the set of complex numbers  <a href="https://www.codecogs.com/eqnedit.php?latex=C&space;=&space;x&plus;yi" target="_blank"><img src="https://latex.codecogs.com/gif.latex?C&space;=&space;x&plus;yi" title="C = x+yi" /></a>  for which sequences as defined by the following recurrence relation are not divergent (do not blow up to infinity):

<a href="https://www.codecogs.com/eqnedit.php?latex=\begin{cases}&space;&&space;z_{n&plus;1}&space;=&space;{z_n}^2&space;&plus;&space;C&space;\\&space;&&space;z_0&space;=&space;0&space;\end{cases}" target="_blank"><img src="https://latex.codecogs.com/gif.latex?\begin{cases}&space;&&space;z_{n&plus;1}&space;=&space;{z_n}^2&space;&plus;&space;C&space;\\&space;&&space;z_0&space;=&space;0&space;\end{cases}" title="\begin{cases} & z_{n+1} = {z_n}^2 + C \\ & z_0 = 0 \end{cases}" /></a>

The script here uses an escape algorithm that iterates each point on the complex plane through the recurrence relation until a certain maximum norm is reached or a maximum number of iterations is reached. The iteration number is then recorded and use to scale the color of each of the points on the visualization.

```javascript
while ((current < MAX_ITERATIONS) && (x * x + y * y < MAX_NORM)) {
   const xNext = x * x - y * y;
   const yNext = 2 * x * y;
   x = xNext + pointX;
   y = yNext + pointY;
   current++;
```

More about the Mandelbrot Set:
- An excellent video from Numberphile featuring Dr. Holly Krieger:
https://www.youtube.com/watch?v=NGMRB4O922I
- Wolfram MathWorld's page on the Mandelbrot Set: 
http://mathworld.wolfram.com/MandelbrotSet.html

**Notes of thanks to:**
- [Dr. Lonce Wyse](https://www.researchgate.net/profile/Lonce_Wyse3), my first and foremost mentor in Javascript and Canvas
- Math, for being infuriating but often surprisingly beautiful
