import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { line } from 'd3-shape';

import './style.scss';

class ChartTrendLine extends Component {
    constructor(props) {
        super(props);

        this.drawLine = this.drawLine.bind(this);
        this.drawPoints = this.drawPoints.bind(this);

        this.state = {
            hover: null
        };
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired,
        xKey: PropTypes.string.isRequired,
        yKey: PropTypes.string.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        showGuideLine: PropTypes.bool
    }

    static defaultProps = {
        x: 0,
        y: 0,
        showGuideLine: false
    }

    drawLine() {
        const { xScale, yScale, xKey, yKey } = this.props;

        return line()
            .x((entry) => xScale(entry[xKey]))
            .y((entry) => yScale(entry[yKey]));
    }

    drawPoints() {
        const { data, xKey, yKey, xScale, yScale, showGuideLine } = this.props;

        if (!showGuideLine) {
            return null;
        }

        return data.map((entry, index) => {
            return (
                <circle
                    className="trend-line-points"
                    cx={xScale(entry[xKey])} cy={yScale(entry[yKey])}
                    r="5"
                    key={index}
                />
            );
        });
    }

    render() {
        const { data, xKey, yKey, xScale, yScale, x, y } = this.props;
        const { hover } = this.state;

        let guideLine = null;
        if (hover) {
            const hoverX = xScale(hover[xKey]);
            const hoverY = yScale(hover[yKey]);
            guideLine = <line x1={hoverX} y1={yScale(0)} x2={hoverX} y2={hoverY} strokeDasharray="2,2"/>;
        }

        return (
            <g transform={`translate(${x}, ${y})`}>
                <path
                    className={`trend-line line-${yKey}`}
                    d={ this.drawLine()(data) }
                />
                {this.drawPoints()}
                {guideLine}
            </g>
        );
    }
}

export default ChartTrendLine;
