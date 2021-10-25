import type { ScaleLinear } from "d3-scale";

export interface CountryMetadata {
  id: string;
  name: string;
  short: string;
}

export type InputDataPoint<VK extends string> = {
  id: string;
  x: number;
  y: number;
  color?: string;
} & {
  [key in VK]: number;
}

export interface Transforms<CDP extends CartogramDataPoint<any, any>> {
  hoverTextFn: (c: CDP) => string;
  categoryFn: (c: CDP) => string;
  colorFn: (c: CDP) => string;
  classesFn: (c: CDP) => string[];
  radius: (v: number) => number;
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
}

export type ExtractValueKey<T> = T extends CartogramDataPoint<infer R, any> ? R : any;
export type ExtractInputDataType<T> = T extends CartogramDataPoint<infer _, infer R> ? R : any;


export interface CartogramConstructor<CDP extends CartogramDataPoint<any, any>> {
  data: ExtractInputDataType<CDP>;
  valueKey: ExtractValueKey<CDP>;
  metadata: CountryMetadata;
  transforms: Transforms<CDP>;
}

export class CartogramDataPoint<
  VK extends string,
  IDP extends InputDataPoint<VK> = InputDataPoint<VK>
> {
  data: IDP;
  valueKey: VK;
  _left: number;
  _r: number;
  _top: number;
  _height: number;
  _width: number;
  _hoverText: string;
  metadata: CountryMetadata;
  transforms: Transforms<CartogramDataPoint<VK, IDP>>;

  constructor(input: CartogramConstructor<CartogramDataPoint<VK, IDP>>) {
    this.data = input.data;
    this.valueKey = input.valueKey;
    this.metadata = input.metadata;
    this.transforms = input.transforms;
  }

  clearDims() {
    this._left = undefined;
    this._top = undefined;
    this._width = undefined;
    this._height = undefined;
  }

  get value() { return this.data[this.valueKey]; }
  get id() { return this.data.id; }
  get x() { return this.data.x; }
  get y() { return this.data.y; }

  get short() { return this.metadata.short; }
  get name() { return this.metadata.name; }
  get hoverText() {
    if (this._hoverText === undefined) {
      this._hoverText = this.transforms.hoverTextFn ? this.transforms.hoverTextFn(this) : null;
    }
    return this._hoverText;
  }

  get r() { return this._r = this._r || this.transforms.radius(this.value); }
  get left() { return this._left = this._left || this.transforms.xScale(this.x - this.r); }
  get top() { return this._top = this._top || this.transforms.yScale(this.y - this.r); }
  get width() { return this._width = this._width || this.transforms.xScale(this.r * 2); }
  get height() { return this._height = this._height || this.transforms.yScale(this.r * 2); }

  get category() { return this.transforms.categoryFn(this); }
  get color() {
    return this.data.color || (this.transforms.colorFn ? this.transforms.colorFn(this) : '');
  }
  get classes() { return this.transforms.classesFn ? this.transforms.classesFn(this) : []; }

  get style() {
    const styles = [
      `left: ${this.left}px`,
      `top: ${this.top}px`,
      `width: ${this.width}px`,
      `height: ${this.height}px`
    ];
    return styles.join(';') + ';';
  }
}
