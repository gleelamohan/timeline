import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class ChartLegend extends Component {
    static propTypes = {
        data: PropTypes.array,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        LegendItem: PropTypes.func.isRequired
    }

    static defaultProps = {
        x: 0,
        y: 0,
        data: null
    }

    render() {
        const { data, x, y, LegendItem } = this.props;

        if (!data || data.length === 0) {
            return null;
        }
        const offset = 20;
        const items = data.map((item, index) => {
            return <LegendItem name={item} x={offset} y={(index + 1) * offset} key={item} />;
        });

        return (
            <g className="legend-points" transform={`translate(${x}, ${y})`}>
                { items }
            </g>
        );
    }
}

class PointLegendItem extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }

    render() {
        const { name, x, y } = this.props;
        const radius = 4;

        return (
            <g className="event-legend" transform={`translate(${x}, ${y})`}>
                <circle className={`event-${name}`} cx={radius} cy="0" r={radius}></circle>
                <text className="legend-text" alignmentBaseline="middle" x="10">{name}</text>
            </g>
        );
    }
}

class LineLegendItem extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }

    render() {
        const { name, x, y } = this.props;

        return (
            <g className="line-legend" transform={`translate(${x}, ${y})`}>
                <rect className={`legend-${name}`} x="0" y="0" width="10" height="10"></rect>
                <text className="legend-text" alignmentBaseline="hanging" x="15">{name}</text>
            </g>
        );
    }
}

class IntervalLegendItem extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }

    render() {
        const { name, x, y } = this.props;

        return (
            <g className="interval-legend" transform={`translate(${x}, ${y})`}>
                <rect className={`interval-event-${name}`} x="0" y="0" width="15" height="10"></rect>
                <text className="legend-text" x="20" alignmentBaseline="hanging">{name}</text>
            </g>
        );
    }
}

export {
    ChartLegend,
    PointLegendItem,
    LineLegendItem,
    IntervalLegendItem
};
