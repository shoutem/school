
import React from 'react';
import { G, Path } from 'react-native-svg';
import * as d3 from 'd3';

const StreamGraph = ({ keys, values, width, height }) => {
    const stack = d3.stack()
                    .keys(keys)
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetSilhouette),
          series = stack(values);

    //console.log(series);

    if (!series.length) {
        return null;
    }

    const colors = d3.schemeCategory20c,
          y = d3.scaleLinear()
                .domain([
                    d3.min(series[0].map(([y0, y1]) => y0)),
                    d3.max(series[series.length-1].map(([y0, y1]) => y1))
                ])
                .range([0, height]),
          x = d3.scaleLinear()
                .domain([0, series[0].length])
                .range([0, width]);

    const area = d3.area()
                   .y0(([y0, y1]) => 150+y(y0))
                   .y1(([y0, y1]) => 150+y(y1))
                   .x((d, i) => x(i));

    return (
        <G>
            {series.map((s, i) => area(s)
                    ? <Path d={area(s)}
                            fill={colors[8+i]}
                            key={keys[i]} />
                    : null
            )}
        </G>
    );
};

export default StreamGraph;
