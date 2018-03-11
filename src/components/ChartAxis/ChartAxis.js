import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { select } from 'd3-selection';

import './style.scss';

class ChartAxis extends Component {
    constructor(props) {
        super(props);

        this.renderChartAxis = this.renderChartAxis.bind(this);
    }

    static propTypes = {
        drawAxis: PropTypes.func.isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        className: PropTypes.string
    }

    static defaultProps = {
        x: 0,
        y: 0
    }

    componentDidMount() {
        this.renderChartAxis();
    }

    shouldComponentUpdate() {
        // Let D3 update the chart, but prevent React from re-rendering

        this.renderChartAxis();

        return false;
    }

    renderChartAxis() {
        select(this.node)
            .call(this.props.drawAxis);
    }

    render() {
        const { className, x, y } = this.props;

        return (
            <g
                className={className}
                transform={`translate(${x}, ${y})`}
                ref={(node) => this.node = node}
            />
        );
    }
}

export default ChartAxis;
