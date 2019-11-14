export function createBabelConstruct(Target: any): any {
  function BabelConstruct(this: any) {
    return Reflect.construct(Target, [], this.__proto__.constructor);
  }

  Object.setPrototypeOf(BabelConstruct, Target);
  Object.setPrototypeOf(BabelConstruct.prototype, Target.prototype);

  return BabelConstruct;
}
