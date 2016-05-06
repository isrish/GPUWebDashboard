(function () {
	console.log('jquery is working!');
	createGraph();
});

function nearestPow2(aSize) {
	return Math.pow(2, Math.round(Math.log(aSize) / Math.log(2)));
}

function ThermoMeter(placeholderName, configuration) {
	this.placeholderName = placeholderName;
	var self = this;

	this.configure = function (configuration) {
		this.config = configuration;
		this.config.size = this.config.size * 0.9;
		this.config.radius = this.config.size * 0.97 / 2; // half height of the termometer
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
		this.config.min = undefined != configuration.min ? configuration.min : 0;
		this.config.max = undefined != configuration.max ? configuration.max : 100;
		this.config.range = this.config.max - this.config.min;
		this.config.greenColor = configuration.greenColor || "#109618";
		this.config.yellowColor = configuration.yellowColor || "#FF9900";
		this.config.redColor = configuration.redColor || "#DC3912";
		this.config.width = 0.5 * this.config.size;
		this.config.height = 0.9 * this.config.size,
			this.config.mercuryColor = "rgb(230,0,0)";
		this.config.bulbRadius = 20;
		this.config.tubeWidth = 21.5;
	}

	this.render = function () {
		var width = this.config.width,
			height = this.config.height,
			maxTemp = this.config.max,
			minTemp = this.config.min;

		var bottomY = height - 5,
			topY = 5,
			bulbRadius = this.config.bulbRadius,
			tubeWidth = this.config.tubeWidth,
			tubeBorderWidth = 1,
			mercuryColor = "rgb(230,0,0)",
			innerBulbColor = "rgb(230, 200, 200)",
			tubeBorderColor = "#999999";

		var bulb_cy = bottomY - bulbRadius,
			bulb_cx = width / 2,
			top_cy = topY + tubeWidth / 2;
		this.config.bulb_cy = bulb_cy;
		this.config.bulb_cx = bulb_cx;

		this.body = d3.select("#" + this.placeholderName)
			.append("svg")
			.attr("width", width)
			.attr("height", height);
		var defs = this.body.append("defs");
		// Define the radial gradient for the bulb fill colour
		var bulbGradient = defs.append("radialGradient")
			.attr("id", "bulbGradient")
			.attr("cx", "50%")
			.attr("cy", "50%")
			.attr("r", "50%")
			.attr("fx", "50%")
			.attr("fy", "50%");

		bulbGradient.append("stop")
			.attr("offset", "0%")
			.style("stop-color", innerBulbColor);

		bulbGradient.append("stop")
			.attr("offset", "90%")
			.style("stop-color", mercuryColor);
		// Circle element for rounded tube top
		this.body.append("circle")
			.attr("r", tubeWidth / 2)
			.attr("cx", width / 2)
			.attr("cy", top_cy)
			.style("fill", "#FFFFFF")
			.style("stroke", tubeBorderColor)
			.style("stroke-width", tubeBorderWidth + "px");

		// Rect element for tube
		this.body.append("rect")
			.attr("x", width / 2 - tubeWidth / 2)
			.attr("y", top_cy)
			.attr("height", bulb_cy - top_cy)
			.attr("width", tubeWidth)
			.style("shape-rendering", "crispEdges")
			.style("fill", "#FFFFFF")
			.style("stroke", tubeBorderColor)
			.style("stroke-width", tubeBorderWidth + "px");

		// White fill for rounded tube top circle element
		// to hide the border at the top of the tube rect element
		this.body.append("circle")
			.attr("r", tubeWidth / 2 - tubeBorderWidth / 2)
			.attr("cx", width / 2)
			.attr("cy", top_cy)
			.style("fill", "#FFFFFF")
			.style("stroke", "none")

		// Main bulb of thermometer (empty), white fill
		this.body.append("circle")
			.attr("r", bulbRadius)
			.attr("cx", bulb_cx)
			.attr("cy", bulb_cy)
			.style("fill", "#FFFFFF")
			.style("stroke", tubeBorderColor)
			.style("stroke-width", tubeBorderWidth + "px");

		// Rect element for tube fill colour
		this.body.append("rect")
			.attr("x", width / 2 - (tubeWidth - tubeBorderWidth) / 2)
			.attr("y", top_cy)
			.attr("height", bulb_cy - top_cy)
			.attr("width", tubeWidth - tubeBorderWidth)
			.style("shape-rendering", "crispEdges")
			.style("fill", "#FFFFFF")
			.style("stroke", "none");
		// Scale step size
		var step = 20;

		// Determine a suitable range of the temperature scale
		var domain = [step * Math.floor(minTemp / step), step * Math.ceil(maxTemp / step)];

		if (minTemp - domain[0] < 0.66 * step)
			domain[0] = 0;

		if (domain[1] - maxTemp < 0.66 * step)
			domain[1] += 0.5 * step;


		// D3 scale object
		var scale = d3.scale.linear()
			.range([bulb_cy - bulbRadius / 2 - 8.5, top_cy])
			.domain(domain);
		this.config.scale = scale;


		// Max and min temperature lines
		[minTemp, maxTemp].forEach(function (t) {

			var isMax = (t == maxTemp),
				label = (isMax ? "max" : "min"),
				textCol = (isMax ? "rgb(230, 0, 0)" : "rgb(0, 0, 230)"),
				textOffset = (isMax ? -4 : 4);

			self.body.append("line")
				.attr("id", label + "Line")
				.attr("x1", width / 2 - tubeWidth / 2)
				.attr("x2", width / 2 + tubeWidth / 2 + 22)
				.attr("y1", scale(t))
				.attr("y2", scale(t))
				.style("stroke", tubeBorderColor)
				.style("stroke-width", "1px")
				.style("shape-rendering", "crispEdges");

			self.body.append("text")
				.attr("x", width / 2 + tubeWidth / 2 + 10)
				.attr("y", scale(t) + textOffset)
				.attr("dy", isMax ? null : "0.75em")
				.text(label)
				.style("fill", textCol)
				.style("font-size", "12px")

		});




		// Values to use along the scale ticks up the thermometer
		var tickValues = d3.range((domain[1] - domain[0]) / step + 1).map(function (v) { return domain[0] + v * step; });


		// D3 axis object for the temperature scale
		var axis = d3.svg.axis()
			.scale(scale)
			.innerTickSize(7)
			.outerTickSize(0)
			.tickValues(tickValues)
			.orient("left");

		// Add the axis to the image
		var svgAxis = this.body.append("g")
			.attr("id", "tempScale")
			.attr("transform", "translate(" + (width / 2 - tubeWidth / 2) + ",0)")
			.call(axis);

		// Format text labels
		svgAxis.selectAll(".tick text")
			.style("fill", "#777777")
			.style("font-size", "10px");

		// Set main axis line to no stroke or fill
		svgAxis.select("path")
			.style("stroke", "none")
			.style("fill", "none")

		// Set the style of the ticks 
		svgAxis.selectAll(".tick line")
			.style("stroke", tubeBorderColor)
			.style("shape-rendering", "crispEdges")
			.style("stroke-width", "1px");
	}

	this.redraw = function (currentTemp) {
		var tubeFill_bottom = this.config.bulb_cy,
			tubeFill_top = this.config.scale(currentTemp);
		// Rect element for the red mercury column
		this.body.append("rect")
			.attr("x", this.config.width / 2 - (this.config.tubeWidth - 10) / 2)
			.attr("y", tubeFill_top)
			.attr("width", this.config.tubeWidth - 10)
			.attr("height", tubeFill_bottom - tubeFill_top)
			.style("shape-rendering", "crispEdges")
			.style("fill", this.config.mercuryColor);

		this.body.append("text")
			.attr("x", this.config.width / 2 + this.config.tubeWidth / 2 + 4)
			.attr("y", tubeFill_top + 3)
			.attr("dy", "0.75em")
			.text(currentTemp+ "\u2103" + "C")
			.style("fill", this.config.greenColor)
			.style("font-size", "13px")

		// Main thermometer bulb fill
		this.body.append("circle")
			.attr("r", this.config.bulbRadius - 6)
			.attr("cx", this.config.bulb_cx)
			.attr("cy", this.config.bulb_cy)
			.style("fill", "url(#bulbGradient)")
			.style("stroke", this.config.mercuryColor)
			.style("stroke-width", "2px");
	}

	// initialization
	this.configure(configuration);
}

function GaugeHalfArc(placeholderName, configuration) {
	this.placeholderName = placeholderName;
	var self = this;
	var pi = Math.PI;
	this.configure = function (configuration) {
		this.config = configuration;
		this.config.size = this.config.size * 0.9;
		this.config.radius = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;
		this.config.min = undefined != configuration.min ? configuration.min : 0;
		this.config.max = undefined != configuration.max ? configuration.max : 100;
		this.config.range = this.config.max - this.config.min;
		this.config.greenColor = configuration.greenColor || "#109618";
		this.config.yellowColor = configuration.yellowColor || "#FF9900";
		this.config.redColor = configuration.redColor || "#DC3912";
	}

	this.render = function () {
		this.body = d3.select("#" + this.placeholderName)
			.append("svg:svg")
			.attr("width", this.config.size)
			.attr("height", this.config.size);
		var arc = d3.svg.arc()
			.innerRadius(this.config.radius - 0.2 * this.config.radius)
			.outerRadius(this.config.radius)
			.startAngle(-90 * (pi / 180)) //converting from degs to radians
			.endAngle(90 * (pi / 180));
		this.body.append("path")
			.attr("d", arc)
			.attr("transform", "translate(" + this.config.cx + "," + 1.0 * this.config.cy + ")")
			.style("fill", "#888")

		var fontSize = Math.round(this.config.size / 9);
		if (undefined != this.config.label) {
			this.body.append("svg:text")
				.attr("x", this.config.cx)
				.attr("y", this.config.cy / 2 + fontSize / 2)
				.attr("dy", fontSize / 2)
				.attr("text-anchor", "middle")
				.text(this.config.label)
				.style("font-size", fontSize + "px")
				.style("fill", "#333")
				.style("stroke-width", "1px");

		}
		// put min and max
		var fontSize = Math.round(this.config.size / 10);
		this.body.append("svg:text")
			.attr("x", 0.12 * this.config.radius)
			.attr("y", 0.0 + this.config.cy + fontSize)
			.attr("dy", fontSize / 2)
			.attr("text-anchor", "middle")
			.text(this.config.min)
			.style("font-size", fontSize + "px")
			.style("fill", "#333")
			.style("stroke-width", "1px");

		this.body.append("svg:text")
			.attr("x", 2.0 * this.config.radius - 0.12 * this.config.radius)
			.attr("y", 0.0 + this.config.cy + fontSize)
			.attr("dy", fontSize / 2)
			.attr("text-anchor", "middle")
			.text(this.config.max)
			.style("font-size", fontSize + "px")
			.style("fill", "#333")
			.style("stroke-width", "1px");

		var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
		var fontSize = Math.round(this.config.size / 10);
		var midValue = (this.config.min + this.config.max) / 2;
		pointerContainer.selectAll("text")
			.data([midValue])
			.enter()
			.append("svg:text")
			.attr("x", this.config.cx)
			.attr("y", this.config.size - this.config.cy / 4 - fontSize)
			.attr("dy", fontSize / 2)
			.attr("text-anchor", "middle")
			.style("font-size", fontSize + "px")
			.style("fill", "#000")
			.style("stroke-width", "0px");
	}

	this.drawBand = function (start, end, color) {
		var dx = pi / 100.0;
		if (0 >= end - start) return;
		this.body.append("svg:path")
			.style("fill", color)
			.attr("d", d3.svg.arc()
				.startAngle(-0.5 * pi - 0 * dx)
				.endAngle(end * dx - 0.5 * pi)
				.innerRadius(this.config.radius - 0.2 * this.config.radius)
				.outerRadius(this.config.radius))
			.attr("transform", "translate(" + this.config.cx + "," + 1.0 * this.config.cy + ")")
	}

	this.redraw = function (value) {
		self.drawBand(0, Math.round(value), self.config.redColor);
		var pointerContainer = this.body.select(".pointerContainer");
		var fontSize = Math.round(this.config.size / 10);
		pointerContainer.selectAll("text").text(Math.round(value) + " %")
			.attr("x", this.config.cx)
			.attr("y", this.config.cy - 0.5 * fontSize)
	}
	// initialization
	this.configure(configuration);
}

function Gauge(placeholderName, configuration) {
	this.placeholderName = placeholderName;

	var self = this; // for internal d3 functions

	this.configure = function (configuration) {
		this.config = configuration;

		this.config.size = this.config.size * 0.9;

		this.config.radius = this.config.size * 0.97 / 2;
		this.config.cx = this.config.size / 2;
		this.config.cy = this.config.size / 2;

		this.config.min = undefined != configuration.min ? configuration.min : 0;
		this.config.max = undefined != configuration.max ? configuration.max : 100;
		this.config.range = this.config.max - this.config.min;

		this.config.majorTicks = configuration.majorTicks || 5;
		this.config.minorTicks = configuration.minorTicks || 2;

		this.config.greenColor = configuration.greenColor || "#109618";
		this.config.yellowColor = configuration.yellowColor || "#FF9900";
		this.config.redColor = configuration.redColor || "#DC3912";

		this.config.transitionDuration = configuration.transitionDuration || 400;
	}

	this.render = function () {
		this.body = d3.select("#" + this.placeholderName)
			.append("svg:svg")
			.attr("class", "gauge")
			.attr("width", this.config.size)
			.attr("height", this.config.size);

		this.body.append("svg:circle")
			.attr("cx", this.config.cx)
			.attr("cy", this.config.cy)
			.attr("r", this.config.radius)
			.style("fill", "#ccc")
			.style("stroke", "#000")
			.style("stroke-width", "0.5px");

		this.body.append("svg:circle")
			.attr("cx", this.config.cx)
			.attr("cy", this.config.cy)
			.attr("r", 0.9 * this.config.radius)
			.style("fill", "#fff")
			.style("stroke", "#e0e0e0")
			.style("stroke-width", "2px");

		for (var index in this.config.greenZones) {
			this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
		}

		for (var index in this.config.yellowZones) {
			this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
		}

		for (var index in this.config.redZones) {
			this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
		}

		if (undefined != this.config.label) {
			var fontSize = Math.round(this.config.size / 9);
			this.body.append("svg:text")
				.attr("x", this.config.cx)
				.attr("y", this.config.cy / 2 + fontSize / 2)
				.attr("dy", fontSize / 2)
				.attr("text-anchor", "middle")
				.text(this.config.label)
				.style("font-size", fontSize + "px")
				.style("fill", "#333")
				.style("stroke-width", "0px");
		}

		var fontSize = Math.round(this.config.size / 16);
		var majorDelta = this.config.range / (this.config.majorTicks - 1);
		for (var major = this.config.min; major <= this.config.max; major += majorDelta) {
			var minorDelta = majorDelta / this.config.minorTicks;
			for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
				var point1 = this.valueToPoint(minor, 0.75);
				var point2 = this.valueToPoint(minor, 0.85);

				this.body.append("svg:line")
					.attr("x1", point1.x)
					.attr("y1", point1.y)
					.attr("x2", point2.x)
					.attr("y2", point2.y)
					.style("stroke", "#666")
					.style("stroke-width", "1px");
			}

			var point1 = this.valueToPoint(major, 0.7);
			var point2 = this.valueToPoint(major, 0.85);

			this.body.append("svg:line")
				.attr("x1", point1.x)
				.attr("y1", point1.y)
				.attr("x2", point2.x)
				.attr("y2", point2.y)
				.style("stroke", "#333")
				.style("stroke-width", "2px");

			if (major == this.config.min || major == this.config.max) {
				var point = this.valueToPoint(major, 0.63);

				this.body.append("svg:text")
					.attr("x", point.x)
					.attr("y", point.y)
					.attr("dy", fontSize / 3)
					.attr("text-anchor", major == this.config.min ? "start" : "end")
					.text(major)
					.style("font-size", fontSize + "px")
					.style("fill", "#333")
					.style("stroke-width", "0px");
			}
		}

		var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");

		var midValue = (this.config.min + this.config.max) / 2;

		var pointerPath = this.buildPointerPath(midValue);

		var pointerLine = d3.svg.line()
			.x(function (d) { return d.x })
			.y(function (d) { return d.y })
			.interpolate("basis");

		pointerContainer.selectAll("path")
			.data([pointerPath])
			.enter()
			.append("svg:path")
			.attr("d", pointerLine)
			.style("fill", "#dc3912")
			.style("stroke", "#c63310")
			.style("fill-opacity", 0.7)

		pointerContainer.append("svg:circle")
			.attr("cx", this.config.cx)
			.attr("cy", this.config.cy)
			.attr("r", 0.12 * this.config.radius)
			.style("fill", "#4684EE")
			.style("stroke", "#666")
			.style("opacity", 1);

		var fontSize = Math.round(this.config.size / 10);
		pointerContainer.selectAll("text")
			.data([midValue])
			.enter()
			.append("svg:text")
			.attr("x", this.config.cx)
			.attr("y", this.config.size - this.config.cy / 4 - fontSize)
			.attr("dy", fontSize / 2)
			.attr("text-anchor", "middle")
			.style("font-size", fontSize + "px")
			.style("fill", "#000")
			.style("stroke-width", "0px");

		this.redraw(this.config.min, 0);
	}

	this.buildPointerPath = function (value) {
		var delta = this.config.range / 13;

		var head = valueToPoint(value, 0.85);
		var head1 = valueToPoint(value - delta, 0.12);
		var head2 = valueToPoint(value + delta, 0.12);

		var tailValue = value - (this.config.range * (1 / (270 / 360)) / 2);
		var tail = valueToPoint(tailValue, 0.28);
		var tail1 = valueToPoint(tailValue - delta, 0.12);
		var tail2 = valueToPoint(tailValue + delta, 0.12);

		return [head, head1, tail2, tail, tail1, head2, head];

		function valueToPoint(value, factor) {
			var point = self.valueToPoint(value, factor);
			point.x -= self.config.cx;
			point.y -= self.config.cy;
			return point;
		}
	}

	this.drawBand = function (start, end, color) {
		if (0 >= end - start) return;

		this.body.append("svg:path")
			.style("fill", color)
			.attr("d", d3.svg.arc()
				.startAngle(this.valueToRadians(start))
				.endAngle(this.valueToRadians(end))
				.innerRadius(0.65 * this.config.radius)
				.outerRadius(0.85 * this.config.radius))
			.attr("transform", function () { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
	}

	this.redraw = function (value, transitionDuration) {
		var pointerContainer = this.body.select(".pointerContainer");

		pointerContainer.selectAll("text").text(Math.round(value));

		var pointer = pointerContainer.selectAll("path");
		pointer.transition()
			.duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
			.attrTween("transform", function () {
				var pointerValue = value;
				if (value > self.config.max) pointerValue = self.config.max + 0.02 * self.config.range;
				else if (value < self.config.min) pointerValue = self.config.min - 0.02 * self.config.range;
				var targetRotation = (self.valueToDegrees(pointerValue) - 90);
				var currentRotation = self._currentRotation || targetRotation;
				self._currentRotation = targetRotation;

				return function (step) {
					var rotation = currentRotation + (targetRotation - currentRotation) * step;
					return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")";
				}
			});
	}

	this.valueToDegrees = function (value) {
		// thanks @closealert
		//return value / this.config.range * 270 - 45;
		return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
	}

	this.valueToRadians = function (value) {
		return this.valueToDegrees(value) * Math.PI / 180;
	}

	this.valueToPoint = function (value, factor) {
		return {
			x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
			y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))
		};
	}

	// initialization
	this.configure(configuration);
}
