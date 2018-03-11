import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { findClosestElement } from './FindClosestElement';
import { format } from 'date-and-time';

class ChartMouseLine extends Component {

    static propTypes = {
        mouseLocation: PropTypes.array,
        chartWidth: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        data: PropTypes.array,
        xScale: PropTypes.func.isRequired,
        yScale: PropTypes.func.isRequired,
        xKey: PropTypes.string.isRequired,
        yKey: PropTypes.string.isRequired
    }

    static defaultProps = {
        mouseLocation: null,
        data: []
    }

    render() {
        const { mouseLocation, data, xKey, xScale, yScale, yKey, x, y, chartWidth } = this.props;

        if (!mouseLocation) {
            return null;
        }
        const [mouseX] = mouseLocation;

        if (mouseX < x || mouseX > chartWidth + x) {
            // Outside the chart boundary do not show mouse lines
            return null;
        }

        const value = xScale.invert(mouseX - x);
        const accessor = (item) => item[xKey];
        const closestElement = findClosestElement(data, value, accessor);
        const coords = {
            x: Math.round(xScale(closestElement[xKey])),
            y: Math.round(yScale(closestElement[yKey]))
        };
        const yValue = closestElement[yKey];
        const xValue = format(closestElement[xKey], 'MMM DD');
        const tooltipHeight = 50;
        const tooltipWidth = 70;
        const tooltipRectOffsetY = 9;
        const tipOffsetY = 3;
        const textOffsetY = 40;

        return (
            <g transform={`translate(${x}, ${y})`}>
                <rect
                    x={coords.x - (tooltipWidth / 2) }
                    y={coords.y - tooltipHeight - tooltipRectOffsetY}
                    width={tooltipWidth}
                    height={tooltipHeight}
                    fill="black"
                    opacity="0.5"
                    rx="5"
                    ry="5"
                />
                <polygon
                    points={'0,0 7,-7 -7,-7'}
                    transform={`translate(${coords.x}, ${coords.y - tipOffsetY})`}
                    opacity="0.9"
                    strokeWidth="0"
                    fill="grey"
                />
                <text fill="white" transform={`translate(${coords.x}, ${coords.y - textOffsetY})`}>
                    <tspan x="0" textAnchor="middle" fontSize="10px">{xValue}</tspan>
                    <tspan x="0" textAnchor="middle" dy="20" fontSize="12px">{yKey.toUpperCase()} {yValue}</tspan>
                </text>
                <line
                    x1={coords.x}
                    y1={coords.y}
                    x2={coords.x}
                    y2={yScale(0)}
                    strokeDasharray="2, 2"
                />
                <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={4}
                    className={`mouseline-${yKey}`}
                />
            </g>
        );
    }
}

export default ChartMouseLine;
