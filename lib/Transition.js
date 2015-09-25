'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMotion = require('react-motion');

var _reactMeasure = require('react-measure');

var _reactMeasure2 = _interopRequireDefault(_reactMeasure);

var _configToStyle = require('./config-to-style');

var _configToStyle2 = _interopRequireDefault(_configToStyle);

var Transition = (function (_Component) {
  _inherits(Transition, _Component);

  function Transition() {
    var _this = this;

    _classCallCheck(this, Transition);

    _get(Object.getPrototypeOf(Transition.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      dimensions: {}
    };

    this._getDefaultValues = function () {
      var _props = _this.props;
      var children = _props.children;
      var appear = _props.appear;
      var enter = _props.enter;
      var leave = _props.leave;

      var styles = enter;
      var configs = {};

      if (appear) {
        styles = typeof appear === 'object' ? appear : leave;
      }

      _react.Children.forEach(children, function (child) {
        if (!child) return;
        configs[child.key] = {
          component: child,
          styles: styles
        };
      });

      return configs;
    };

    this._getEndValues = function (s) {
      var dimensions = _this.state.dimensions;
      var _props2 = _this.props;
      var children = _props2.children;
      var enter = _props2.enter;

      var configs = {};

      _react.Children.forEach(children, function (child) {
        if (!child) return;

        var childDimensions = dimensions && dimensions[child.key];
        var styles = _extends({}, enter);

        if (styles.height && enter.height.val === 'auto') {
          styles.height = { val: childDimensions && childDimensions.height || 0 };
        }
        if (styles.width && enter.width.val === 'auto') {
          styles.width = { val: childDimensions && childDimensions.width || 0 };
        }

        configs[child.key] = {
          component: child,
          styles: styles
        };
      });

      return configs;
    };

    this._willEnter = function (key, value, endValue, currentValue, currentSpeed) {
      var _props3 = _this.props;
      var appear = _props3.appear;
      var leave = _props3.leave;

      var styles = typeof appear === 'object' ? appear : leave;

      return _extends({}, value, {
        styles: styles
      });
    };

    this._willLeave = function (key, value, endValue, currentValue, currentSpeed) {
      // clean up dimensions when item leaves
      delete _this.state.dimensions[key];

      return _extends({}, value, {
        styles: _this.props.leave
      });
    };

    this._storeDimensions = function (key, childDimensions) {
      var dimensions = _this.state.dimensions;

      dimensions[key] = childDimensions;
      _this.setState({ dimensions: dimensions });
    };

    this._childrenToRender = function (currValues) {
      return Object.keys(currValues).map(function (key) {
        var currValue = currValues[key];
        var component = currValue.component;
        var styles = currValue.styles;

        var style = (0, _configToStyle2['default'])(styles);
        var child = null;

        // determine whether we need to measure the child or not
        if (_this._shouldMeasure()) {
          var onChange = _this._storeDimensions.bind(null, key);

          child = _react2['default'].createElement(_reactMeasure2['default'], { key: key, clone: true, whitelist: ['width', 'height'], onChange: onChange }, (0, _react.cloneElement)(component, { style: style, dimensions: _this.state.dimensions[key] }));
        } else {
          child = (0, _react.cloneElement)(component, { key: key, style: style });
        }

        return child;
      });
    };
  }

  _createClass(Transition, [{
    key: '_shouldMeasure',
    value: function _shouldMeasure() {
      var _props4 = this.props;
      var measure = _props4.measure;
      var enter = _props4.enter;

      return measure || enter.width && enter.width.val === 'auto' || enter.height && enter.height.val === 'auto';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props5 = this.props;
      var component = _props5.component;
      var onlyChild = _props5.onlyChild;
      var appear = _props5.appear;

      return _react2['default'].createElement(
        _reactMotion.TransitionSpring,
        {
          defaultValue: this._getDefaultValues(),
          endValue: this._getEndValues(),
          willEnter: this._willEnter,
          willLeave: this._willLeave
        },
        function (currValues) {
          var children = _this2._childrenToRender(currValues);
          var wrapper = null;

          if (onlyChild) {
            if (children.length === 1) {
              wrapper = _react.Children.only(children[0]);
            } else {
              wrapper = (0, _react.createElement)(component, { style: { display: 'none' } });
            }
          } else {
            wrapper = (0, _react.createElement)(component, _this2.props, children);
          }

          return wrapper;
        }
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      component: _react.PropTypes.string,
      onlyChild: _react.PropTypes.bool,
      measure: _react.PropTypes.bool,
      appear: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object]),
      enter: _react.PropTypes.object,
      leave: _react.PropTypes.object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      component: 'div', // define the wrapping tag around the elements you want to transition in/out
      onlyChild: false, // useful if you only want to transition in/out 1 element rather than a list
      measure: false, // pass true to use measure and get child dimensions to use with your animations
      appear: false, // accepts an object or boolean, if boolean passed it will use "leave" as the origin point of the transition
      enter: {
        opacity: { val: 1 }
      },
      leave: {
        opacity: { val: 0 }
      }
    },
    enumerable: true
  }]);

  return Transition;
})(_react.Component);

exports['default'] = Transition;
module.exports = exports['default'];