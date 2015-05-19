'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Symbol = require('babel-runtime/core-js/symbol')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var __handleSwipeGesture__ = _Symbol('handleSwipeGesture');
var __handleTapGesture__ = _Symbol('handleTapGesture');
var __emitEvent__ = _Symbol('emitEvent');

var Gestures = (function (_React$Component) {
  function Gestures(props) {
    _classCallCheck(this, Gestures);

    _get(Object.getPrototypeOf(Gestures.prototype), 'constructor', this).call(this, props);

    this.state = {
      x: null,
      y: null,
      swiping: false,
      start: 0 };
  }

  _inherits(Gestures, _React$Component);

  _createClass(Gestures, [{
    key: 'resetState',
    value: function resetState() {
      this.setState({ x: null, y: null, swiping: false, start: 0 });
    }
  }, {
    key: __emitEvent__,
    value: function (name, e) {
      if (this.props[name]) {
        this.props[name](e);
      }
    }
  }, {
    key: 'getGestureDetails',
    value: function getGestureDetails(e) {
      var _e$changedTouches$0 = e.changedTouches[0];
      var clientX = _e$changedTouches$0.clientX;
      var clientY = _e$changedTouches$0.clientY;

      var deltaX = this.state.x - clientX;
      var deltaY = this.state.y - clientY;
      var absX = Math.abs(deltaX);
      var absY = Math.abs(deltaY);
      var duration = Date.now() - this.state.start;
      var velocity = Math.sqrt(absX * absX + absY * absY) / duration;
      var done = e.type === 'touchend';
      e.gesture = { deltaX: deltaX, deltaY: deltaY, absX: absX, absY: absY, velocity: velocity, duration: duration, done: done };
      return e;
    }
  }, {
    key: 'handleTouchStart',
    value: function handleTouchStart(e) {
      this[__emitEvent__]('onTouchStart', e);

      this.setState({
        start: Date.now(),
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        swiping: false });
    }
  }, {
    key: 'handleTouchMove',
    value: function handleTouchMove(e) {
      var ge = this.getGestureDetails(e);
      this[__emitEvent__]('onTouchMove', ge);

      if (ge.gesture.absX > this.props.swipeThreshold && ge.gesture.absY > this.props.swipeThreshold) {
        this[__handleSwipeGesture__](ge);
        return;
      }
    }
  }, {
    key: 'handleTouchCancel',
    value: function handleTouchCancel(e) {
      this[__emitEvent__]('onTouchCancel', e);
      this.resetState();
    }
  }, {
    key: 'handleTouchEnd',
    value: function handleTouchEnd(e) {
      var ge = this.getGestureDetails(e);
      this[__emitEvent__]('onTouchEnd', ge);

      if (this.state.swiping) {
        this[__handleSwipeGesture__](ge);
        return this.resetState();
      }
      if (ge.gesture.duration > 0) {
        this[__handleTapGesture__](ge);
      }
      this.resetState();
    }
  }, {
    key: __handleTapGesture__,
    value: function (ge) {
      ge.type = 'tap';
      this[__emitEvent__]('onTap', ge);
    }
  }, {
    key: __handleSwipeGesture__,
    value: function (ge) {
      var _ge$gesture = ge.gesture;
      var deltaX = _ge$gesture.deltaX;
      var absX = _ge$gesture.absX;
      var deltaY = _ge$gesture.deltaY;
      var absY = _ge$gesture.absY;

      var direction = absX > absY ? deltaX < 0 ? 'Right' : 'Left' : deltaY < 0 ? 'Up' : 'Down';

      this.setState({ swiping: true });

      ge.gesture.isFlick = ge.gesture.velocity > this.props.flickThreshold;
      ge.type = 'swipe' + direction.toLowerCase();
      this[__emitEvent__]('onSwipe' + direction, ge);
      ge.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), {
        onTouchStart: this.handleTouchStart.bind(this),
        onTouchMove: this.handleTouchMove.bind(this),
        onTouchCancel: this.handleTouchCancel.bind(this),
        onTouchEnd: this.handleTouchEnd.bind(this) });
    }
  }]);

  return Gestures;
})(_react2['default'].Component);

Gestures.propTypes = {
  onSwipeUp: _react2['default'].PropTypes.func,
  onSwipeDown: _react2['default'].PropTypes.func,
  onSwipeLeft: _react2['default'].PropTypes.func,
  onSwipeRight: _react2['default'].PropTypes.func,
  flickThreshold: _react2['default'].PropTypes.number,
  swipeThreshold: _react2['default'].PropTypes.number };

Gestures.defaultProps = {
  flickThreshold: 0.6,
  swipeThreshold: 10 };

exports['default'] = Gestures;
module.exports = exports['default'];