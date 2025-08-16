// extract array element type
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type StringArray = ArrayElementType<string[]>;
type StringArrayArray = ArrayElementType<string[][]>;
type StringArray2 = ArrayElementType<Array<string>>;
type StringArrayArray2 = ArrayElementType<Array<Array<string>>>;
type MixedArray = ArrayElementType<(string | number)[]>;

// extract function return type

type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FunctionReturn = MyReturnType<() => string>;
type FunctionReturn2 = MyReturnType<(n: number) => boolean>;
