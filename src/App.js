import React, { Component } from "react";
import "./App.css";

class point {
    constructor(x = null, y = null) {
        this.x = x;
        this.y = y;
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 500,
            width: 150,
            pointCount: 3,
            pointSize: 1,
        };

        this.drawing = false;
        this.ctx = null;
        this.lastPoint = {x: 0, y: 0};
        this.points = [];

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        const canvas = this.refs.canvas;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.rAF = requestAnimationFrame(() => {
            this.initScene();
            this.updateAnimationState();
        });
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        const { innerWidth, innerHeight } = window;

        this.setState({ width: innerWidth, height: innerHeight });
        this.initScene();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    componentDidUpdate() {
        this.initScene();
    }

    updateAnimationState() {
        this.drawScene();
        this.drawScene();
        this.drawScene();
        this.drawScene();
        this.drawScene();

        this.nextFrame();
    }

    nextFrame() {
        this.rAF = requestAnimationFrame(() => this.updateAnimationState());
    }

    clearFrame() {
        const { width, height } = this.state;
        const { ctx } = this;

        ctx.clearRect(0, 0, width, height);
    }

    convertRange(value, r1, r2) {
        return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    }

    distance(x1, y1, x2, y2) {
        const x = x1 - x2;
        const y = y1 - y2;

        return Math.sqrt(x * x + y * y);
    }

    scale(value, r1, r2) {
        return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
    }

    initScene() {
        const { width, height, pointCount, pointSize } = this.state;
        const radius = Math.min(height, width) * .4;
        const a = 360 / pointCount;
	const { ctx } = this;

	this.clearFrame();
	
        this.points = [];
        for (let i = 0; i < pointCount;i++) {
            const angle = (a * i) + (a / 4);
            var x = (width / 2) + (radius * Math.cos(angle*Math.PI/180));
            var y = (height / 2) + (radius * Math.sin(angle*Math.PI/180));

            this.drawPixel(x, y, {r:0,g:255,b:0});
            this.points.push({x, y});
	    this.lastPoint = {x, y};
        }
    }

    drawPixel(x, y, colour = {r:255,g:255,b:255,a:255}) {
        const { pointSize } = this.state;
        const { ctx } = this;
        const {r,b,g,a=255} = colour;
        ctx.fillStyle = `rgba(${r},${g},${b},${a/255})`;
        ctx.fillRect( x - (pointSize / 2), y - (pointSize / 2), pointSize, pointSize );
    }

    drawScene() {
        const { width, height, pointCount, pointSize } = this.state;
        const { ctx, points, lastPoint } = this;

        points.forEach(p => {
            this.drawPixel(p.x, p.y, {r:0,g:0,b:255});
        });

        const selectedPoint = points[Math.floor(Math.random() * points.length)];
        const x = Math.floor(lastPoint.x + ((selectedPoint.x - lastPoint.x) / 2));
        const y = Math.floor(lastPoint.y + ((selectedPoint.y - lastPoint.y) / 2));
	
        this.drawPixel(x, y);
        this.lastPoint = {x,y};
    }

    render() {
        const { width, height } = this.state;

        return (
		<div className={"grid"}>
		  <div className={"ui"}>
		    <p>Has 3 points, randomly picks one and moves half way from the current location to the point and draws a pixel.</p>
		    <button onClick={() => this.initScene()}>Restart</button>
		  </div>
                <div className={"dots"}>
                    <canvas ref="canvas"  width={width} height={height} />
                </div>
            </div>
        );
    }
}

export default App;
