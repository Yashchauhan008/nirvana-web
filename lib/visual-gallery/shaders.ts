export const vertexShader = /* glsl */ `
varying vec2 vUv;

attribute vec3 aInitialPosition;
attribute float aMeshSpeed;
attribute vec4 aTextureCoords;

uniform float uTime;
uniform vec2 uMaxXdisplacement;
uniform vec2 uDrag;
uniform float uSpeedY;
uniform float uScrollY;

varying float vVisibility;
varying vec4 vTextureCoords;

float remap(float value, float originMin, float originMax) {
  return clamp((value - originMin) / (originMax - originMin), 0.0, 1.0);
}

void main() {
  vec3 newPosition = position + aInitialPosition;

  float maxX = uMaxXdisplacement.x;
  float maxY = uMaxXdisplacement.y;

  float maxYoffset = distance(aInitialPosition.y, maxY);
  float minYoffset = distance(aInitialPosition.y, -maxY);
  float maxXoffset = distance(aInitialPosition.x, maxX);
  float minXoffset = distance(aInitialPosition.x, -maxX);

  float xDisplacement = mod(minXoffset - uDrag.x + uTime * aMeshSpeed, maxXoffset + minXoffset) - minXoffset;
  float yDisplacement = mod(minYoffset - uDrag.y, maxYoffset + minYoffset) - minYoffset;

  float maxZ = 12.0;
  float minZ = -30.0;
  float maxZoffset = distance(aInitialPosition.z, maxZ);
  float minZoffset = distance(aInitialPosition.z, minZ);
  float zDisplacement = mod(uScrollY + minZoffset, maxZoffset + minZoffset) - minZoffset;

  newPosition.x += xDisplacement;
  newPosition.y += yDisplacement;
  newPosition.z += zDisplacement;

  vVisibility = remap(newPosition.z, minZ, minZ + 5.0);

  vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  vUv = uv;
  vTextureCoords = aTextureCoords;
}
`;

export const fragmentShader = /* glsl */ `
varying vec2 vUv;
varying float vVisibility;
varying vec4 vTextureCoords;

uniform sampler2D uAtlas;

float roundedBox(vec2 p, vec2 size, float radius) {
  vec2 d = abs(p) - size + radius;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(1.0, 1.69);
  if (roundedBox(p, vec2(0.46, 0.78), 0.07) > 0.0) discard;

  float xStart = vTextureCoords.x;
  float xEnd = vTextureCoords.y;
  float yStart = vTextureCoords.z;
  float yEnd = vTextureCoords.w;

  vec2 atlasUV = vec2(
    mix(xStart, xEnd, vUv.x),
    mix(yStart, yEnd, 1.0 - vUv.y)
  );

  vec4 color = texture2D(uAtlas, atlasUV);
  color.a *= vVisibility;

  gl_FragColor = color;
}
`;
