// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

// Create a Graphics object, set a fill color, draw a rectangle
let obj = new PIXI.Graphics();
obj.beginFill(0xff0000);
obj.drawRect(0, 0, 200, 100);

// Add it to the stage to render
app.stage.addChild(obj);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
});