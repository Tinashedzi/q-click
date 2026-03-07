import '@react-three/fiber';

declare module '@react-three/fiber' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThreeElements {}
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      points: any;
      ambientLight: any;
      pointLight: any;
      primitive: any;
    }
  }
}
