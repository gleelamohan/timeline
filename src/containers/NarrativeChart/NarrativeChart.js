import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import anime from 'animejs';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import differenceInMonths from 'date-fns/difference_in_months';
import { timeFormat } from 'd3-time-format';

import { ChartLegend, PointLegendItem, IntervalLegendItem } from '../../components/ChartLegend';
import ChartIntervalEvents from '../../components/ChartIntervalEvents';
import ChartTrendLine from '../../components/ChartTrendLine';
import ChartAxis from '../../components/ChartAxis';
import ChartPointEvents from '../../components/ChartPointEvents';
import ChartMouseLine from '../../components/ChartMouseLine';
import CheckBox from '../../components/CheckBox';
import { handleMouseMoveAction, setVisibleTrendLinesAction } from '../../actions/narrativeChartAction';

import './style.scss';

const EWS_MIN = 0;
const EWS_MAX = 100;
const CHART_WIDTH = 400;
const CHART_HEIGHT = 350;
const RADIUS_POINT = 4;

class NarrativeChart extends Component {

    constructor(props) {
        super(props);

        this.xScale = this.xScale.bind(this);
        this.yEWSScale = this.yEWSScale.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.convertToSVGCoords = this.convertToSVGCoords.bind(this);
        this.uniqTypes = this.uniqTypes.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.createCheckboxes = this.createCheckboxes.bind(this);
    }

    static propTypes = {
        scores: PropTypes.array,
        pointEvents: PropTypes.array,
        intervalEvents: PropTypes.object,
        size: PropTypes.shape({
            height: PropTypes.number,
            width: PropTypes.number
        }).isRequired,
        padding: PropTypes.number,
        mouseLocation: PropTypes.array,
        handleMouseEvent: PropTypes.func,
        trendLines: PropTypes.array,
        setVisibleTrendLines: PropTypes.func,
        metricsDetails: PropTypes.object,
        fetchMetricsDetails: PropTypes.func
    }

    static defaultProps = {
        padding: 35
    }

    componentDidMount() {
        const { metricsDetails, setVisibleTrendLines } = this.props;
        setVisibleTrendLines(Object.keys(metricsDetails));
        this.animate();
    }

    handleMouseMove(event) {
        const { handleMouseEvent } = this.props;
        const { clientX, clientY } = event;
        handleMouseEvent(this.convertToSVGCoords(clientX, clientY));
    }

    convertToSVGCoords(x, y) {
        const svg = this.node;
        let point = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        point = point.matrixTransform(svg.getScreenCTM().inverse());

        return [point.x, point.y];
    }

    xScale() {
        const { scores } = this.props;

        return scaleTime()
            .range([0, CHART_WIDTH])
            .domain(extent(scores, (entry) => entry.ts));
    }

    yEWSScale() {
        return scaleLinear()
            .range([CHART_HEIGHT, 0])
            .domain([EWS_MIN, EWS_MAX]);
    }

    uniqTypes(data) {
        return [...new Set(data.map((entry) => entry.type))];
    }

    animate() {
        anime({
            targets: '.line-ews',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'linear',
            duration: 1500,
            delay: 300
        });
    }

    toggleCheckbox(metricValue) {
        const { trendLines, setVisibleTrendLines } = this.props;
        if (trendLines.includes(metricValue)) {
            setVisibleTrendLines(trendLines.filter((metric) => metric !== metricValue));
        } else {
            setVisibleTrendLines([...trendLines, metricValue]);
        }
    }

    createCheckboxes() {
        const { metricsDetails } = this.props;

        return Object.keys(metricsDetails).map((metric) =>
            <li key={metric}>
                <CheckBox
                    disable={ metric === 'ews' }
                    handleCheckboxChange={this.toggleCheckbox}
                    id={metric}
                    className={metric}
                    key={metric}
                    label={metricsDetails[metric]}
                />
            </li>
        );
    }

    render() {
        const { size, scores, pointEvents, intervalEvents, padding, mouseLocation, trendLines } = this.props;
        if (!scores) {
            return null;
        }
        const { width, height } = size;
        const uniqueEvents = this.uniqTypes(pointEvents).sort();
        const intervalEventOffset = 30;
        const yOffsetIntervalLegend = 5;
        const yOffsetAccelerator = 30;
        const yOffsetRed = 50;

        const [startDate, endDate] = extent(scores, (entry) => entry.ts);
        const tickCount = differenceInMonths(endDate, startDate) + 1;

        const xAxis = axisBottom(this.xScale())
            .ticks(tickCount)
            .tickFormat(timeFormat('%b'));

        const chartTrendLines = [];
        if (trendLines.includes('lu')) {
            chartTrendLines.push(
                <ChartTrendLine
                    data={scores}
                    xScale={this.xScale()}
                    yScale={this.yEWSScale()}
                    xKey="ts"
                    yKey="lu"
                    x={padding}
                    y={padding}/>
            );
        }

        if (trendLines.includes('tlp')) {
            chartTrendLines.push(
                <ChartTrendLine
                    data={scores}
                    xScale={this.xScale()}
                    yScale={this.yEWSScale()}
                    xKey="ts"
                    yKey="tlp"
                    x={padding}
                    y={padding} />
            );
        }

        if (trendLines.includes('ews')) {
            chartTrendLines.push(
                <ChartTrendLine
                    data={scores}
                    xScale={this.xScale()}
                    yScale={this.yEWSScale()}
                    xKey="ts"
                    yKey="ews"
                    x={padding}
                    y={padding}
                    showGuideLine={true} />
            );
        }

        return (
            <div className="slds-grid slds-wrap">
                <div className="slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_2-of-12">
                    <label className="slds-form-element__label" >Metrics</label>
                    <div className="slds-box">
                        <ul>
                            { this.createCheckboxes() }
                        </ul>
                    </div>
                </div>
                <div className="slds-col slds-size_1-of-1 slds-medium-size_6-of-12 slds-large-size_8-of-12">
                    <svg
                        ref={ (node) => this.node = node }
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${width} ${height}`}
                        onMouseMove={this.handleMouseMove}
                    >
                        <ChartAxis
                            drawAxis={xAxis}
                            className="x-axis"
                            x={padding} y={CHART_HEIGHT + padding}
                        />
                        <ChartAxis
                            drawAxis={axisLeft(this.yEWSScale())}
                            className="y-axis"
                            x={padding} y={padding}
                        />
                        <ChartLegend
                            data={uniqueEvents}
                            x={500} y={250}
                            LegendItem={PointLegendItem}
                        />
                        <ChartLegend
                            data={Object.keys(intervalEvents).sort()}
                            x={500} y={CHART_HEIGHT + intervalEventOffset + yOffsetIntervalLegend}
                            LegendItem={IntervalLegendItem}
                        />
                        <ChartPointEvents
                            data={pointEvents}
                            scale={this.xScale()}
                            x={padding} y={CHART_HEIGHT + padding}
                            radius={RADIUS_POINT}
                            chartWidth={CHART_WIDTH}
                            chartHeight={CHART_HEIGHT}
                        />
                        <ChartIntervalEvents
                            name="accelerator"
                            data={intervalEvents.accelerator}
                            scale={this.xScale()}
                            x={padding} y={CHART_HEIGHT + intervalEventOffset + yOffsetAccelerator}
                            chartWidth={CHART_WIDTH}
                            chartHeight={CHART_HEIGHT}
                        />
                        <ChartIntervalEvents
                            name="red"
                            data={intervalEvents.red}
                            scale={this.xScale()}
                            x={padding} y={CHART_HEIGHT + intervalEventOffset + yOffsetRed}
                            chartWidth={CHART_WIDTH}
                            chartHeight={CHART_HEIGHT}
                        />
                        { chartTrendLines }
                        <ChartMouseLine
                            mouseLocation={mouseLocation}
                            chartWidth={CHART_WIDTH}
                            x={padding}
                            y={padding}
                            data={scores}
                            xScale={this.xScale()}
                            yScale={this.yEWSScale()}
                            xKey="ts" yKey="ews"
                        />
                    </svg>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mouseLocation: state.timelineChart.mouseLocation || null,
        trendLines: state.timelineChart.trendLines || [],
        metricsDetails: state.timelineChart.metricsDetails || {}
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleMouseEvent: (data) => dispatch(handleMouseMoveAction(data)),
        setVisibleTrendLines: (data) => dispatch(setVisibleTrendLinesAction(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NarrativeChart);

