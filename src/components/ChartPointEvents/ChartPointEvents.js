import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChartTooltip from '../ChartTooltip';

import './style.scss';

class ChartPointEvents extends Component {
    constructor(props) {
        super(props);

        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);

        this.state = {
            hover: null
        };
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        scale: PropTypes.func.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        radius: PropTypes.number,
        chartHeight: PropTypes.number.isRequired,
        chartWidth: PropTypes.number.isRequired,
    }

    static defaultProps = {
        x: 0,
        y: 0,
        radius: 4
    }

    handleMouseOver(entry) {
        this.setState({
            hover: entry
        });
    }

    handleMouseOut() {
        this.setState({
            hover: null
        });
    }

    render() {
        const { x, y, data, scale, radius, chartHeight, chartWidth } = this.props;
        const { hover } = this.state;
        let tooltip = null;

        if (hover) {
            const tooltipX = scale(hover.ts);
            tooltip = (
                <ChartTooltip
                    x={tooltipX}
                    lines={hover.tooltip}
                    chartHeight={chartHeight}
                    chartWidth={chartWidth}
                />
            );
        }

        const events = data.map((entry, index) => {
            const { type, ts } = entry;

            return (
                <circle
                    className={`event-${type}`}
                    cx={scale(ts)} cy="0"
                    r={radius}
                    key={index}
                    onMouseOver={this.handleMouseOver.bind(null, entry)}
                    onMouseOut={this.handleMouseOut}
                    data-tooltip="something"
                />
            );
        });

        return (
            <g transform={`translate(${x}, ${y})`} ref={(node) => this.node = node}>
                {tooltip}
                {events}
            </g>
        );
    }
}

export default ChartPointEvents;
