/**
 *
 * @param {(deviceHasMoved: boolean) => void} onDeviceMove
 * @param {number} timeout
 * @param {number} threshold
 */
export function accelerometer(onDeviceMove, threshold = 15, timeout = 1000) {
  let previousTime = new Date();
  let previousAcceleration = {
    x: null,
    y: null,
    z: null
  };

  const handleDeviceMotion = e => {
    let currentAcceleration = e.accelerationIncludingGravity;

    let currentTime;
    let timeDifference;
    let delta = {
      x: 0,
      y: 0,
      z: 0
    };

    //If this is the first time the device has moved, store acceleration values and wait for the next movement before doing calculations.
    if (
      previousAcceleration.x === null &&
      previousAcceleration.y === null &&
      previousAcceleration.z === null
    ) {
      previousAcceleration = currentAcceleration;

      return;
    }

    //Get the time since we last moved
    currentTime = new Date();
    timeDifference = currentTime.getTime() - previousTime.getTime();

    if (timeDifference > timeout) {
      //Store the change in acceleration
      delta.x = Math.abs(previousAcceleration.x - currentAcceleration.x);
      delta.y = Math.abs(previousAcceleration.y - currentAcceleration.y);
      delta.z = Math.abs(previousAcceleration.z - currentAcceleration.z);

      //We have registered a device movement as the change in
      //acceleration on any one of the axis is greater than
      //the given threshold
      if (
        (delta.x > threshold && delta.y > threshold) ||
        (delta.x > threshold && delta.z > threshold) ||
        (delta.y > threshold && delta.z > threshold)
      ) {
        onDeviceMove(true);
      } else {
        onDeviceMove(false);
      }

      previousAcceleration = currentAcceleration;
      previousTime = new Date();
    }
  };

  //Does this browser support the devicemotion event
  if ("ondevicemotion" in window) {
    window.addEventListener("devicemotion", handleDeviceMotion, false);
  }
}
