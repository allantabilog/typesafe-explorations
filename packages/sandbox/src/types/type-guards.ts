function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

const data: unknown = ["1", 2, 3];
if (isArrayOf(data, (x): x is number => typeof x === "number")) {
  // TS now knows that data is number[]
  const sum = data.reduce((a, b) => a + b, 0); // this is type-safe
  console.log(sum);
  console.log(data[0]?.toFixed(2));
} else {
  console.error("Cannot process data - not a number array");
}

interface User {
  id: number;
  name: string;
}

function isUser(obj: unknown): obj is User {
  return (
    obj !== null &&
    typeof obj === "object" &&
    typeof (obj as any).id === "number" && // should it be obj as unknown
    typeof (obj as any).name === "string"
  );
}

const data2: unknown = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

if (isArrayOf(data2, isUser)) {
  // TS now knows that data2 is User[]
  data2.forEach((user) => console.log(user.name));
}
