class Point {
  readonly kind: string = "Point";
  x: number = 0;
  y: number = 0;
}

class Circle {
  readonly kind: string = "Circle";
  x: number = 0;
  y: number = 0;
  radius: number = 0;
}

class Rectangle {
  readonly kind: string = "Rectangle";
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
}

type Shape = Point | Circle | Rectangle;

let shapes: Shape[] = [new Circle(), new Rectangle()];

for (let shape of shapes) {
  switch (shape.kind) {
    case "Point":
      let point = shape as Point;
      console.log(`Point ${JSON.stringify(point)}`);
      break;
    case "Circle":
      let circle = shape as Circle;
      console.log(`Circle is ${JSON.stringify(circle)}`);
      break;
    case "Rectangle":
      let rectangle = shape as Rectangle;
      console.log(`Rectangle is ${JSON.stringify(rectangle)}`);
      break;
    default:
      throw new Error();
  }
}
