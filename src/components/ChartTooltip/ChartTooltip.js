import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';

import './style.scss';

const OPACITY_DEPTH = 0.4;

class ChartTooltip extends PureComponent {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        height: PropTypes.number,
        width: PropTypes.number,
        lines: PropTypes.array.isRequired,
        chartWidth: PropTypes.number.isRequired
    }

    static defaultProps = {
        x: 0,
        y: 0,
        height: 15,
        width: 100
    }

    componentDidMount() {
        this.animate();
    }

    componentDidUpdate() {
        this.animate();
    }

    animate() {
        anime({
            targets: '.chart-tooltip',
            opacity: [0, OPACITY_DEPTH],
            easing: 'linear',
            duration: 300
        });
    }

    render() {
        const { x, y, height, lines, chartWidth } = this.props;

        const PADDING_WIDTH = 6.5;
        const rectWidth = lines.reduce((accumulator, line) => Math.max(accumulator, line.length), 0) * PADDING_WIDTH;

        const rectHeight = lines.length * height;

        // Keep tooltip within chart boundary
        let tooltipX = Math.max(0, x - (rectWidth / 2));
        tooltipX = Math.min(tooltipX, chartWidth - rectWidth);
        const yOffset = 55;
        const tooltipY = y + yOffset;

        const lineTags = lines.map((line, index) => {
            return (
                <tspan key={index} x={ rectWidth / 2 } textAnchor="middle" dy="12">
                    {line}
                </tspan>
            );
        });

        return (
            <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                <rect className="chart-tooltip" height={rectHeight} width={rectWidth} rx="3" ry="3" />
                <text fill="white" className="chart-tooltip-text">
                    {lineTags}
                </text>
            </g>
        );
    }
}

export default ChartTooltip;
