// @ts-nocheck
window.addEventListener('load', function () {

  ctx.clearRect(0 - dtSx, 0 - dtSy, canvas.width, canvas.height); // 清空画布
  drawCrosshair(event)
})

// 获取 dialog
var dialog = document.getElementById('dialog');
dialog.style.display = 'none';

// 获取box-x的value
var boxX = document.getElementById('box-x');

// 获取box-y的value
var boxY = document.getElementById('box-y');

// 获取确定按钮
var btn = document.getElementById('btn');

/* 获取 Canvas 元素和上下文 */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// 蒙层
var can = document.getElementById('masking');
var ctxs = can.getContext('2d');

// 设置数据
var data = [
  { x: 250, y: 145 },
  { x: 250, y: 180 },
];

// 定义缩放比例和缩放范围
var scale = 1;
var minScale = 0.5; // 最小缩放比例
var maxScale = 2; // 最大缩放比例
var pointRadius = 10; // 点的半径

// 绘制散点图
function drawScatterPlot() {
  ctx.clearRect(0 - dtSx, 0 - dtSy, canvas.width, canvas.height); // 清空画布
  envelopAll()
  // 在 Canvas 中绘制五角星
  drawStar(300, 100, 50, 5, 20, 'gold', 'black');

  for (var i = 0; i < data.length; i++) {
    var point = data[i];

    ctx.beginPath();
    ctx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI); // 绘制圆形点
    ctx.fillStyle = 'blue'; // 设置点的填充颜色
    ctx.fill();
    ctx.closePath();
    // 更新画布矩阵位置
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  }
}


// 绘制五角星的函数
function drawStar(x, y, radius, spikes, innerRadius, fillStyle, strokeStyle) {
  // 保存画布状态
  ctx.save();

  // 移动到起始点
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.moveTo(0, 0 - radius);

  // 绘制五角星的路径
  for (var i = 0; i < spikes; i++) {
    ctx.rotate(Math.PI / spikes);
    ctx.lineTo(0, 0 - innerRadius);
    ctx.rotate(Math.PI / spikes);
    ctx.lineTo(0, 0 - radius);
  }

  // 设置填充样式和描边样式
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;

  // 填充和描边五角星
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 恢复画布状态
  ctx.restore();
}


// 包络线
var envelop = [
  { x: 155, y: 140 },
  { x: 100, y: 160 },
  { x: 160, y: 170 },
  { x: 120, y: 130 },
  { x: 130, y: 185 },
]

// 将所以的点都连接起来
function envelopAll() {
  ctx.beginPath();
  ctx.moveTo(envelop[0].x, envelop[0].y);
  envelop.map(item => {
    ctx.lineTo(item.x, item.y);
  })
  ctx.closePath();
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.stroke()
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

}

// 添加鼠标滚轮事件
canvas.addEventListener('wheel', function (event) {
  event.preventDefault();

  // 获取滚轮的方向，event.deltaY表示滚轮的滚动方向
  var delta = Math.sign(event.deltaY);

  var zoomFactor = 0.1; // 缩放因子，可以根据需要调整
  if (delta < 0) {
    scale += zoomFactor; // 放大
    ctx.clearRect(0 - dtSx, 0 - dtSy, canvas.width, canvas.height);

  } else {
    scale -= zoomFactor; // 缩小
    ctx.clearRect(0 + dtSx, 0 + dtSy, canvas.width, canvas.height);
  }

  // 限制缩放范围
  scale = Math.max(minScale, Math.min(scale, maxScale));

  // 获取画布中心点坐标
  var canvasCenterX = canvas.width / 2;
  var canvasCenterY = canvas.height / 2;


  // 计算缩放后的偏移量
  var newOffsetX = canvasCenterX - canvasCenterX * scale;
  var newOffsetY = canvasCenterY - canvasCenterY * scale;


  offsetX = newOffsetX
  offsetY = newOffsetY

  // 更新画布的变换矩阵
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  // 绘制您的图形
  drawScatterPlot();
  envelopAll();
});

var crosshairColor = 'red'; // 十字虚线的颜色
var crosshairWidth = 1; // 十字虚线的宽度
var crosshairDash = [5, 5]; // 十字虚线的样式
var showCoordinates = true; // 是否展示坐标
var coordinatesColor = 'black'; // 坐标文本的颜色
var coordinatesFont = '14px Arial'; // 坐标文本的字体

//绘制十字虚线和展示坐标
function drawCrosshair(event) {
  var rect = can.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;

  ctxs.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
  // 在 Canvas 中绘制五角星
  drawStar(100, 100, 50, 5, 20, 'gold', 'black');
  drawScatterPlot()
  // 绘制横线
  ctxs.beginPath();
  ctxs.setLineDash(crosshairDash);
  ctxs.moveTo(0, mouseY);
  ctxs.lineTo(canvas.width, mouseY);
  ctxs.lineWidth = crosshairWidth;
  ctxs.strokeStyle = crosshairColor;
  ctxs.stroke();

  // 绘制竖线
  ctxs.beginPath();
  ctxs.setLineDash(crosshairDash);
  ctxs.moveTo(mouseX, 0);
  ctxs.lineTo(mouseX, canvas.height);
  ctxs.strokeStyle = crosshairColor;
  ctxs.stroke();

  // 展示坐标
  if (showCoordinates) {
    ctxs.fillStyle = coordinatesColor;
    ctxs.font = coordinatesFont;
    ctxs.fillText(`(${mouseX},${mouseY})`, mouseX + 10, mouseY - 10);
  }
}

/*
确定按钮
box-x 的value
box-y 的value
*/
var box_x = 0;
var box_y = 0;

boxX.addEventListener('change', function (e) {
  box_x = e.target.value
})
boxY.addEventListener('change', function (e) {
  box_y = e.target.value
})

btn.addEventListener('click', function (e) {
  dialog.style.display = 'none';
  if (box_x !== 0 && box_y !== 0) {
    if (dataItem !== null) {
      data.map(item => {
        if (item === dataItem) {
          item.x = box_x
          item.y = box_y
        }
      })
    } else {
      data.push({
        x: box_x,
        y: box_y,
      })
    }
    drawScatterPlot()
  }
  boxX.value = ''
  boxY.value = ''
  dataItem = null
})

// 鼠标右键
canvas.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  dialog.style.display = 'block';
  dialog.style.left = e.clientX + 'px';
  dialog.style.top = e.clientY + 'px';
  data.map(item => {
    if (Math.abs(item.x - e.offsetX + dtSx) <= pointRadius * 2 && Math.abs(item.y - e.offsetY + dtSy) <= pointRadius * 2
    ) {
      dataItem = item;
      isDialog = true;
    }
  })
})

// 鼠标按下
var isDialog = false;
var dataItem = null;
var drag = false;
var startDragX = 0;
var startDragY = 0;
var offsetX = 0;
var offsetY = 0;

var dtSx = 0
var dtSy = 0

// 鼠标按下
canvas.addEventListener('mousedown', function (e) {
  data.map(item => {
    if (Math.abs(item.x - e.offsetX + dtSx) <= pointRadius * 2 && Math.abs(item.y - e.offsetY + dtSy) <= pointRadius * 2
    ) {
      dataItem = item;
      isDialog = true;
    }
  })
  if (isDialog !== true) {
    drag = true;
    startDragX = e.clientX
    startDragY = e.clientY
  }
})

// 监听鼠标移动事件
canvas.addEventListener('mousemove', function (e) {
  if (drag) {

    // 计算鼠标移动的距离
    var deltaX = e.clientX - startDragX;
    var deltaY = e.clientY - startDragY;

    // 更新画布的偏移量
    offsetX += deltaX;
    offsetY += deltaY;
    dtSx += deltaX
    dtSy += deltaY
    drawScatterPlot();

    // 更新拖拽开始的鼠标位置
    startDragX = e.clientX;
    startDragY = e.clientY
  } else if (isDialog) {
    data.map(item => {
      if (item.x === dataItem.x && item.y === dataItem.y) {
        item.x = e.offsetX - dtSx
        item.y = e.offsetY - dtSy
      }
    })
  }
  drawCrosshair(event)
});
canvas.addEventListener('click', function () {
  dialog.style.display = 'none'
})
// 鼠标释放
canvas.addEventListener('mouseup', function (e) {
  e.preventDefault();
  isDialog = false;
  drag = false;
})

/* 监听鼠标离开事件 */
canvas.addEventListener('mouseleave', function (e) {
  e.preventDefault();
  drag = false;
  isDialog = false;

});

/* 监听鼠标离开事件，清空画布 */
canvas.addEventListener('mouseout', function (e) {
  drawScatterPlot();
  // envelopAll();

});
