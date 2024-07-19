type T = {
  a: string;
  b: number;
};

type U = keyof T;
//

type Person = {
  name: string;
  age: number;
  gender: string;
};

type PersonKeys = Person; // type PersonKeys = "name" | "age" | "gender"
//

type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};

const person: ReadonlyPerson = { name: "John", age: 30, gender: "male" };
person.age = 31;
//

type ReadonlyPerson2 = {
  readonly name: string;
  readonly age: number;
  readonly gender: string;
};

type WritablePerson = {
  -readonly [K in keyof ReadonlyPerson]: ReadonlyPerson[K];
};

const person2: WritablePerson = { name: "John", age: 30, gender: "male" };
person2.age = 31;
//
