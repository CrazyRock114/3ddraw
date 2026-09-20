/**
 * 3D Drawing Math Utilities
 * Vector algebra, projection geometry, Lambertian lighting, and homography.
 */

// 3D Vector operations
export function vec3(x, y, z) {
  return { x, y, z };
}

export function dot3(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function normalize3(v) {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

export function sub3(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function add3(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function scale3(v, s) {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

/**
 * Pinhole Camera Perspective Projection:
 * Maps 3D point (X, Y, Z) to 2D screen coordinate (x', y')
 * x' = focalLength * (X / Z) + cx
 * y' = focalLength * (Y / Z) + cy
 */
export function project3DTo2D(point, camera, focalLength = 300, screenCenter = { x: 400, y: 300 }) {
  const relX = point.x - camera.x;
  const relY = point.y - camera.y;
  const relZ = point.z - camera.z;

  if (relZ <= 0.1) return null; // Behind camera

  const scale = focalLength / relZ;
  return {
    x: screenCenter.x + relX * scale,
    y: screenCenter.y - relY * scale, // invert Y for screen space
    depth: relZ,
  };
}

/**
 * Lambertian Diffuse Reflection:
 * I = I_0 * kd * max(0, N · L)
 */
export function calculateLambertShading(normal, lightDir, ambient = 0.15, diffuse = 0.85) {
  const n = normalize3(normal);
  const l = normalize3(lightDir);
  const cosTheta = Math.max(0, dot3(n, l));
  const intensity = ambient + diffuse * cosTheta;
  return {
    intensity: Math.min(1, Math.max(0, intensity)),
    cosTheta,
    angleDeg: Math.round((Math.acos(Math.min(1, Math.max(-1, dot3(n, l)))) * 180) / Math.PI),
  };
}

/**
 * 2D Line intersection:
 * Finds intersection point between line (p1, p2) and (p3, p4)
 */
export function lineIntersection(p1, p2, p3, p4) {
  const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (Math.abs(denom) < 1e-6) return null; // Parallel

  const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  return {
    x: p1.x + ua * (p2.x - p1.x),
    y: p1.y + ua * (p2.y - p1.y),
  };
}

/**
 * Anamorphic Homography mapping helper:
 * Stretches a coordinate (u, v) in normalized [0, 1] space
 * based on camera tilt angle theta (in degrees) to create anamorphic paper illusion.
 */
export function calculateAnamorphicPoint(u, v, tiltAngleDeg = 40, observerDist = 1.8) {
  const theta = (tiltAngleDeg * Math.PI) / 180;
  // Kept from vanishing point geometry:
  // When looking at paper tilted by theta, distant parts foreshorten by 1 / sin(theta + v*delta)
  const stretchFactor = 1 / Math.sin(Math.max(0.15, theta));
  // Y coordinate expands non-linearly to compensate for tilt foreshortening
  const distortedY = Math.pow(v, 1.35) * stretchFactor;
  // X coordinate expands wider at the top to compensate for perspective narrowing
  const taper = 1 + (distortedY * 0.4) / observerDist;
  const distortedX = (u - 0.5) * taper + 0.5;

  return { x: distortedX, y: distortedY };
}
