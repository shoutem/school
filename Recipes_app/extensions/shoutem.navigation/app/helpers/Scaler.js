import _ from 'lodash';


function calculateSizeRatio(size, refSize) {
  return _.round(size / refSize, 2);
}

/**
 * Get ratio to fit largest page side.
 * For example, if page width is larger then height, scale by width.
 * @param pageDimensions - Current page resolution
 * @param referentResolution - Resolution to which page dimensions are scaled to
 * @returns {number}
 */
function getResizeRatio(pageDimensions, referentResolution) {
  const widthRatio = calculateSizeRatio(pageDimensions.width, referentResolution.width);
  const heightRatio = calculateSizeRatio(pageDimensions.height, referentResolution.height);
  // Scale by side which has smaller ratio
  // Smaller ratio means that relative difference on
  // that side is larger between page and referent resolution
  return widthRatio < 1 || heightRatio < 1 ? Math.min(widthRatio, heightRatio) : 1;
}

/**
 * Enables adjustment of component sizes based on relation between
 * referent resolution used when sizes were specified and the actual
 * page dimensions.
 */
export default class Scaler {
  constructor() {
    this.resizeRatio = 1;
    this.transformersMap = [];
  }

  addPropTransformer(propName, transformerFunction) {
    _.set(this.transformersMap, propName, transformerFunction);
  }

  hasTransformer(propName) {
    return _.has(this.transformersMap, propName);
  }

  transform(propName, value) {
    return this.transformersMap[propName](value);
  }

  /**
   * Calculates ratio for scaling.
   * If no referent resolution is provided, ratio is 1.
   *
   * @param pageDimensions {width, height} Target component width and height (not screen)
   * @param referentResolution {width, height} Referent resolution to scale to
   * @returns {Scaler}
   */
  resolveRatio(pageDimensions, referentResolution) {
    if (!referentResolution) {
      // No reference to rescale to
      return this;
    }
    return this.setRatio(getResizeRatio(pageDimensions, referentResolution));
  }

  resolveRatioByWidth(pageDimensions, referentResolution) {
    return this.setRatio(calculateSizeRatio(pageDimensions.width, referentResolution.width));
  }

  resolveRatioByHeight(pageDimensions, referentResolution) {
    return this.setRatio(calculateSizeRatio(pageDimensions.height, referentResolution.height));
  }

  setRatio(ratio) {
    this.resizeRatio = ratio;
    return this;
  }

  getRatio() {
    return this.resizeRatio;
  }

  /**
   * Scales all objects numerical values according to provided ratio
   *
   * @param object an object to be scaled
   * @returns {} the scaled object
   */
  scaleObjectValues(object) {
    const result = { ...object };

    _.keys(result).forEach(propertyName => {
      if (Number.isSafeInteger(result[propertyName])) {
        const scaledValue = this.scale(result[propertyName]);

        result[propertyName] = this.hasTransformer(propertyName) ?
                                this.transform(propertyName, scaledValue) :
                                scaledValue;
      }
    });

    return result;
  }

  /**
   * Scales value according to the calculated scale ratio
   * @param value {number | object} number to scale or object which properties are to scale
   * @returns {number} the scaled value
   */
  scale(value) {
    if (_.isPlainObject(value)) {
      return this.scaleObjectValues(value);
    }
    return _.round(value * this.resizeRatio, 2);
  }
}

