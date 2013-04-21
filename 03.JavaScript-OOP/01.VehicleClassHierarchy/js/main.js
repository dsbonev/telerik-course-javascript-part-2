(function () {
  'use strict';

  var inherit = (function () {
    var Proxy = function () {};

    return function (Child, Parent, childPrototypeProps) {
      Proxy.prototype = Parent.prototype;
      Child.prototype = new Proxy();
      Child.prototype.constructor = Child;

      childPrototypeProps = childPrototypeProps || {};

      for (var p in childPrototypeProps) {
        if (childPrototypeProps.hasOwnProperty(p)) {
          Child.prototype[p] = childPrototypeProps[p];
        }
      }
    };
  })();

  function mixin(recievingObj /*, propertyList1, propertyList2, ...*/) {

    for (var i = 1, length = arguments.length; i < length; i += 1) {
      var propertyList = arguments[i];

      for (var p in propertyList) {
        if (propertyList.hasOwnProperty(p)) {
          recievingObj[p] = propertyList[p];
        }
      }
    }

    return recievingObj;
  }

  function arrayOf(itemCount, itemCallback) {
    var result = [];

    for (var i = 0; i < itemCount; i += 1) {
      result[i] = itemCallback();
    }

    return result;
  }

  function PropultionUnit() {
  }

  inherit(PropultionUnit, Object, {
    getAcceleration: function () {
      throw new Error('method not implemented');
    }
  });

  function Wheel(radius) {
    this.radius = radius;
  }

  inherit(Wheel, PropultionUnit, {
    getAcceleration: function () {
      return Math.PI * 2 * this.radius;
    }
  });

  function PropellingNozzle(power) {
    this.power = power;
    this.afterburnerIsOn = false;
  }

  inherit(PropellingNozzle, PropultionUnit, {
    getAcceleration: function () {
      var result = this.power;

      if (this.afterburnerIsOn) {
        result *= 2;
      }

      return result;
    },
    turnAfterburnerOn: function () {
      this.afterburnerIsOn = true;
    },
    turnAfterburnerOff: function () {
      this.afterburnerIsOn = false;
    }
  });

  function Propeller(finCount) {
    this.finCount = finCount;
    this.spinDirection = 'clockwise';
  }

  inherit(Propeller, PropultionUnit, {
    getAcceleration: function () {
      var result = this.finCount;

      if (this.spinDirection === 'counter-clockwise') {
        result *= -1;
      }

      return result;
    },
    spinClockwise: function () {
      this.spinDirection = 'clockwise';
    },
    spinCounterClockwise: function () {
      this.spinDirection = 'counter-clockwise';
    }
  });

  var Movable = {
    speed: 0,
    getPropultionUnits: function () {
      return this.propultionUnits || [];
    },
    setPropultionUnits: function (units) {
      this.propultionUnits = units;
    }, /* Wheels, Propelling Nozzles, Propellers */
    accelerate: function () {
      this.speed += this.getAcceleration();

      if (this.speed < 0) {
        this.speed *= -1;
      }
    },
    getAcceleration: function () {
      var result = 0;

      this.getPropultionUnits().forEach(function (unit) {
        result += unit.getAcceleration();
      });

      return result;
    }
  };

  function Vehicle() {
  }

  mixin(Vehicle.prototype, Movable);

  function LandVehicle() {
    var wheelRadius = 5;
    this.setPropultionUnits(arrayOf(4, function () {
      return new Wheel(wheelRadius);
    }));
  }

  inherit(LandVehicle, Vehicle);

  function AirVehicle() {
    var nozzlePower = 100;
    this.setPropultionUnits(arrayOf(1, function () {
      return new PropellingNozzle(nozzlePower);
    }));
  }

  inherit(AirVehicle, Vehicle, {
    turnAfterburnersOn: function () {
      this.getPropultionUnits().forEach(function (unit) {
        unit.turnAfterburnerOn();
      });
    },
    turnAfterburnersOff: function () {
      this.getPropultionUnits().forEach(function (unit) {
        unit.turnAfterburnerOff();
      });
    }
  });

  function WaterVehicle(propellerCount) {
    propellerCount = propellerCount || 2;
    var finCount = 8;
    this.setPropultionUnits(arrayOf(propellerCount, function () {
      return new Propeller(finCount);
    }));
  }

  inherit(WaterVehicle, Vehicle, {
    forwardPropellers: function () {
      this.getPropultionUnits().forEach(function (unit) {
        unit.spinClockwise();
      });
    },
    reversePropellers: function () {
      this.getPropultionUnits().forEach(function (unit) {
        unit.spinCounterClockwise();
      });
    }
  });

  function AmphibiousVehicle() {
    this.waterVehicle = new WaterVehicle();
    this.landVehicle = new LandVehicle();

    this.setLandMode();
  }

  inherit(AmphibiousVehicle, Vehicle, {
    setLandMode: function () {
      this.changeMode(this.landVehicle);
    },
    setWaterMode: function () {
      this.changeMode(this.waterVehicle);
    },
    changeMode: function (mode) {
      this.setPropultionUnits(mode.getPropultionUnits());
      this.speed = 0;
    }
  });

  [
    LandVehicle,
    mixin(AirVehicle, {demoCallback: function (instance) {
      console.log('turn afterburners on');
      instance.turnAfterburnersOn();
      console.log('accelerate');
      instance.accelerate();
      console.log('speed:', instance.speed);
    }}),
    mixin(WaterVehicle, {demoCallback: function (instance) {
      console.log('reverse the propellers spin direction');
      instance.reversePropellers();
      console.log('accelerate');
      instance.accelerate();
      console.log('speed:', instance.speed);
      console.log('accelerate');
      instance.accelerate();
      console.log('speed:', instance.speed, 'in backward direction');
    }}),
    mixin(AmphibiousVehicle, {demoCallback: function (instance) {
      console.log('switch to Water mode');
      instance.setWaterMode();
      console.log('speed:', instance.speed);
      console.log('accelerate');
      instance.accelerate();
      console.log('speed:', instance.speed);
    }})
  ].forEach(function (Type) {
    var instance = new Type();

    console.group(instance.constructor.name);

    console.log('speed:', instance.speed);
    console.log('accelerate');
    instance.accelerate();
    console.log('speed:', instance.speed);

    if (Type.demoCallback) {
      Type.demoCallback(instance);
    }

    console.groupEnd();
  });
})();
