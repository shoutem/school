
import fromPairs from 'lodash.frompairs';
import groupBy from 'lodash.groupby';
import last from 'lodash.last';
import * as d3 from 'd3';

function chartValues(prices)
{
    const products = Object.values(prices),
          keys = Object.keys(prices);

    if (!products.length) {
        return [];
    }

    const chunked = fromPairs(products.map(({ id, values }) =>
        [id,
         groupBy(values, val => {
             // round to 3 second accuracy
             const t = val.time.getTime();
             return Math.round(t/3000)*3000;
         })
        ]
    ));

    let [t0, t1] = d3.extent(
        Object.values(chunked)
              .reduce((arr, p) => arr.concat(Object.keys(p)), [])
              .map(t => new Date(Number(t)))
    );

    return d3.timeSeconds(t0, t1, 3)
             .map(t => fromPairs(
                 Object.keys(chunked)
                       .map(k => [k, (chunked[k][t.getTime()] || []).length])
                       .concat([['time', t]])
             ))
}

function lastValueOrZero(prices) {
    return last(({ values = [] } = prices || {}).values) || {price: 0};
}

export { chartValues, lastValueOrZero };
