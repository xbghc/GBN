function init_webgl() {
  // Get A WebGL context
  var canvas = document.getElementById("main_canvas");
  gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // Create a buffer to put three 2d clip space points in
  positionBuffer = gl.createBuffer();

  colorBuffer = gl.createBuffer();

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(colorAttributeLocation);

  // 绑定颜色缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // 告诉颜色属性怎么从 colorBuffer (ARRAY_BUFFER) 中读取颜色值
  var size = 4; // 每次迭代使用4个单位的数据
  var type = gl.FLOAT; // 单位数据类型是32位的浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0; // 0 = 移动距离 * 单位距离长度sizeof(type) 
  // 每次迭代跳多少距离到下一个数据
  var offset = 0; // 从绑定缓冲的起始处开始
  gl.vertexAttribPointer(
    colorAttributeLocation, size, type, normalize, stride, offset)

  // set the resolution
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  container = document.getElementById("container");
}

init_webgl();

function draw_rectangle(x1, y1, x2, y2) {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let positions = [
    x1, y1,
    x1, y2,
    x2, y1,
    x1, y2,
    x2, y1,
    x2, y2,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // var primitiveType = gl.TRIANGLES;
  // var offset = 0;
  // var count = 6;
  // gl.drawArrays(primitiveType, offset, count);
  // draw
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function put_text(text, x, y, color) {
  let div = document.createElement("div");
  div.className = "overlay";
  div.style.left = x + "px";
  div.style.top = y + "px";
  let span = document.createElement("span");
  div.appendChild(span);
  // 创建文字节点为浏览器节省一些时间
  let textNode = document.createElement("font");
  span.appendChild(textNode);
  textNode.textContent = text;
  textNode.style.color = color;
  container.appendChild(div);
}

function set_color(r255, g255, b255) {
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  let r = r255/255;
  let g = g255/255;
  let b = b255/255;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      [r, g, b, 1,
        r, g, b, 1,
        r, g, b, 1,
        r, g, b, 1,
        r, g, b, 1,
        r, g, b, 1,
      ]),
    gl.STATIC_DRAW);

}

function set_background_color(r,g,b){
  gl.clearColor(r, g, b, 1);
}


function clear_canvas(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  let divs = document.getElementsByClassName("overlay");
  for(let i=0;i<divs.length;i++)
  {
    divs[i].remove();
  }
}
