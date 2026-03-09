export const steamVertexShader = `
uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

vec2 rotate2D(vec2 value, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 r = mat2(c, -s, s, c);
    return r * value;
}

void main() {
    vUv = uv;
    vec3 newPosition = position;

    // Twist effect (التواء البخار)
    float twistPerlin = texture(uPerlinTexture, vec2(0.5, uv.y * 0.2 - uTime * 0.005)).r;
    float angle = twistPerlin * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);

    // Wind effect (تطاير)
    vec2 windOffset = vec2(
        texture(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5,
        texture(uPerlinTexture, vec2(0.75, uTime * 0.01)).r - 0.5
    );
    windOffset *= pow(uv.y, 2.0) * 2.0;
    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

export const steamFragmentShader = `
uniform float uTime;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

void main() {
    // تحريك الخامة
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;

    // شفافية البخار وتلاشيه
    float smoke = texture(uPerlinTexture, smokeUv).r;
    smoke = smoothstep(0.4, 1.0, smoke);

    // تلاشي الحواف
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);

    gl_FragColor = vec4(0.8, 0.8, 0.8, smoke * 0.6); // لون رمادي فاتح وشفافية 60%
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;
