type StatusMap = {
  200: "OK";
  400: "Bad Request";
  404: "Not Found";
  500: "Server Error";
};

type StatusCode = keyof StatusMap;

type StatusMessage<Code extends StatusCode> = StatusMap[Code];

const code: StatusCode = 500;
const message: StatusMessage<typeof code> = "Server Error";

console.log(`${code} ${message}`);
console.log(typeof code);
console.log(typeof message);
