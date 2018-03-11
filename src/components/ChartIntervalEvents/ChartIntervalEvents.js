import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChartTooltip from '../ChartTooltip';

import './style.scss';

class ChartIntervalEvents extends Component {
    constructor(props) {
        super(props);

        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);

        this.state = {
            hover: null
        };
    }

    static propTypes = {
        data: PropTypes.array,
        scale: PropTypes.func.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        name: PropTypes.string,
        chartWidth: PropTypes.number.isRequired,
        chartHeight: PropTypes.number.isRequired
    }

    static defaultProps = {
       data: null
    }

    handleMouseOver(items) {
        this.setState({
            hover: items
        });
    }

    handleMouseOut() {
        this.setState({
            hover: null
        });
    }

    render() {
        const { x, y, data, scale, name, chartWidth, chartHeight } = this.props;
        if (!data) {
            return null;
        }

        const { hover } = this.state;

        const lines = data.map((entry, index) => {

            const { tsClose, tsOpen } = entry;

            return (
                <line
                    x1={scale(tsOpen)} y1={0}
                    x2={scale(tsClose)} y2={0}
                    className={`interval-event-${name}`}
                    strokeWidth="10"
                    key={index}
                    onMouseOver={this.handleMouseOver.bind(null, entry)}
                    onMouseOut={this.handleMouseOut}
                />
            );
        });

        let chartTooltip = null;
        if (hover) {
            const { tsOpen, tsClose, tooltip } = hover;
            const tooltipX = scale(tsOpen) + ((scale(tsClose) - scale(tsOpen)) / 2);
            const yOffset = 35;
            const tooltipY = chartHeight + yOffset;
            chartTooltip = <ChartTooltip x={tooltipX} y={tooltipY} lines={tooltip} chartWidth={chartWidth}/>;
        }

        return (
            <g transform={`translate(${x})`}>
                <g transform={`translate(0, ${y})`}>
                    {lines}
                </g>
                {chartTooltip}
            </g>
        );
    }
}

export default ChartIntervalEvents;
