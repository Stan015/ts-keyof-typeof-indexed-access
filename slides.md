---
# You can also start simply with 'default'
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: "TypeScript: keyof, typeof, and Index Access Types"
info: |
  ## AltSchool V3 S hanging out.

# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
---

# Learn TypeScript

## Topic: keyof, typeof, and Indexed Access Types

Presented by Stanley Azi

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
transition: fade-out
level: 2
---

# What we will discuss?

In this presentation, we will take a look at the key concepts of keyof Operator, typeof Operator, and Index Access Types in TypeScript's Type manipulation, how to use them effectively, and when to use them.

## <u>Table of Content</u>

<Toc minDepth="1" maxDepth="1"></Toc>

<br>
<br>

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/features/slide-scope-style
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

<!--
Here is another comment.
-->

---
transition: slide-up
---

# keyof Type Operator

The _`keyof Operator`_ is an object type operator in TypeScript that generates a union type of string and numeric literal types from the keys of an existing object type. It allows you to extract the keys of an object type or interface as a union type. <br>

If a type _`T`_ has keys _`a`_ and _`b`_ of type _`number`_ and _`string`_ respectively, a union type _`U`_ could be extracted from type _`T`_ with the _`keyof`_ Type Operator  which in this case will return _`a`_ or _`b`_ of types _`number`_ and _`string`_ respectively.

```ts {0|1-4|6|all} twoslash
type T = {
    a: string;
    b: number;
};

type U = keyof T;
```

---
transition: slide-down
level: 2
---

# What are Object Keys? 

Object keys are the identifiers used to access values stored in an object. <br> In the case of TypeScript, using same convention of what keys are in Objects, we are accessing the _value_(_type_) of each key and returning a Union (|) of the keys. This means that the new type decleared with `keyof` will inherit a union type of respective keys.

````md magic-move {lines: true}

```js  
let obj = { name: "Alice", age: 25 };
console.log(obj.name); // Dot notation
console.log(obj["age"]); // Bracket notation
```

````

```ts {0-5|3|7|all} twoslash
type Person = {
  name: string;
  age: number;
  gender: string;
}; 

type PersonKeys = keyof Person; // type PersonKeys = "name" | "age" | "gender"
```
---
transition: slide-left
level: 2
---

# keyof with Mapped Types

`keyof` becomes especially useful when combined with mapped types. For example, you can create a read-only version of a type using keyof and a mapped type:

````md magic-move {lines: true}

```ts 
type Person = {
  name: string;
  age: number;
  gender: string;
}; 


type ReadonlyPerson = {
  readonly [K in keyof Person]: Person[K];
};

const person: ReadonlyPerson = { name: "John", age: 30, gender: "male" };
person.age = 31; // This will cause an error because the properties are readonly

```

```ts
type ReadonlyPerson = {
  readonly name: string;
  readonly age: number;
  readonly gender: string;
}

type WritablePerson = {
  -readonly [K in keyof ReadonlyPerson]: ReadonlyPerson[K];
};

const person: WritablePerson = { name: "John", age: 30, gender: "male" };

person.age = 31; // This is now allowed because the properties are no longer readonly
```
````

---
transition: slide-down
level: 2
---

If the type has a string or number index signature, keyof will return those types instead:

```ts {1-4|6-12} twoslash
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
    
// type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
    
// type M = string | number

// Note that in this example, `M` is `string | number` — this is 
// because JavaScript object keys are always coerced to a string, so `obj[0]` is always the same as `obj["0"]`.

```

---
transition: slide-up
level: 2
---

# keyof with Generic Functions

You can use keyof to define generic functions that work with any object type, without knowing the specific keys of that type:

``` ts {1-3|5-6|8|10-13|15-17|5-17|all} twoslash
function getProperty<T>(obj: T, key: keyof T): T[keyof T] {
  return obj[key];
}

function getProperty2<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30, gender: "male" };

// Usage
const name = getProperty2(person, "name"); // Type is string
const age = getProperty2(person, "age");   // Type is number
const gender = getProperty2(person, "gender"); // Type is string

console.log(name);  // Output: John
console.log(age);   // Output: 30
console.log(gender); // Output: male
```

---
transition: slide-down
level: 2
---

# keyof with Utility Types

keyof can be used with common TypeScript utility types like Omit and Exclude to create more advanced types:

```ts {all|1-5|7|9|all} twoslash
type Person = {
  name: string;
  age: number;
  gender: string;
}; 

type OmittedPerson = Omit<Person, "age">;

type ExcludeAge = Exclude<keyof Person, "age">;
```

---
transition: slide-up
---

# Typeof Type Operator

We are familier with JavaScript's `typeof` operator which checks the type of a variable or used in expression context where you are checking the type of a value or argument.
<br><br>
TypeScript uses same concept to pass a type of a parent variable to the child variable. <br>
This can be particularly useful for inferring the types of variables when you want to create new types based on existing variables or for ensuring type safety in your code. Here's an overview and some examples to illustrate how to use the typeof operator effectively.

```ts {1|3-4|} twoslash
console.log(typeof "Hello world"); // console logs "string"

let firstName = "Bravo";
let lastName: typeof firstName;
```

---
transition: slide-right
level: 2
---

# Using typeof with Objects

When dealing with objects, the typeof operator can be used to create a type based on the shape of the object. <br>

```ts {1-6|7|7-13|all} twoslash
const person = {
  name: "John",
  age: 30,
  gender: "male"
};

type PersonType = typeof person;

const anotherPerson: PersonType = {
  name: "Jane",
  age: 25,
  gender: "female"
};
```

---
transition: slide-down
level: 2
---

# Using typeof With ReturnType

We can safely used `ReturnType` on a _`function type`_. But we will get an error when we try the same on normal function name. The `typeof` would save us from this error by safely passing the type.

```ts {1-2|4-8|9-15} twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;

function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;

function fY() {
  return { x: 10, y: 3 };
}
type PY = ReturnType<typeof fY>; 
// this is because typeof is referencing the type of the value, not the value itself.
```

---
transition: slide-down
level: 2
---

# Limitations of typeof Operator

According to TypeScript documentation, TypeScript intentionally limits the sorts of expressions you can use typeof on. <br>

>Specifically, it’s only legal to use typeof on identifiers (i.e. variable names) or their properties. This helps avoid the confusing trap of writing code you think is executing, but isn’t:

```ts {1-5|7-9} twoslash
function msgbox(a: string): string {
  return a;
}
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");

let shouldTryAgain: ReturnType<typeof msgbox>;
```

---
transition: slide-up
---

# Indexed Access Types

Indexed access types in TypeScript allow you to access the type of a specific property in an object type. This feature enhances type safety by enabling you to work directly with the type of a property of an object.

```ts {1-9|11|13|15-17} twoslash
type Person = {
  name: string;
  age: number;
  gender: string;
}

type NameType = Person["name"]; // NameType is string
type AgeType = Person["age"];   // AgeType is number
type GenderType = Person["gender"]; // GenderType is string

type NameAndAgeType = Person["name" | "age"]; // NameAndAgeType is string | number

type jobType = Person["job"]

type StringArray = string[]; 

type StringArrayType = StringArray[number]; // StringArrayType is string
```
---
transition: slide-up
level: 2
---

# Using keyof with Indexed Access Types

Combining `keyof` with indexed access types allows you to create types that are based on the keys of an object type.

```ts twoslash
type Person = {
  name: string;
  age: number;
  gender: string;
}

type PersonKeys = keyof Person; // 'name' | 'age' | 'gender'
type ValueType = Person[PersonKeys]; // string | number
```

---
transition: slide-up
level: 2
---

# Using typeof with Indexed Access Types

A typical example can be seen is the below example where we are checking the `typeof` of an array of object, and picking an index which is a number.

```ts {1-7 |9| 11 } twoslash
const ArrOfObjs = [
  {name: "Jane", age: 22},
  {name: "Henry", age: 25},
  {name: "Michael", age: 23},
]

type Person = typeof ArrOfObjs[number];

type Age = typeof ArrOfObjs[number]["age"];

//You can only use types when indexing, meaning you can’t use a const to make a variable reference:
const key2 = "age";
type Age2 = Person[key2];

//However, you can use a type alias for a similar style of refactor:
type key3 = "age";
type Age3 = Person[key3];
```

---
transition: slide-up
level: 2
---

# Indexed Access Types with Conditional Types

You can combine indexed access types with conditional types to create more advanced type manipulations.

```ts  twoslash
type Person = {
  name: string;
  age: number;
  gender: string;
}

type IsString<T> = T extends string ? true : false;

type NameIsString = IsString<Person["name"]>; // true
type AgeIsString = IsString<Person["age"]>;   // false
```

---
transition: slide-up
level: 2
---

# Overal Summary

In this presentation, I covered the key concepts and usage of `keyof`, `typeof`, and Indexed Access Types. <br>

> The _`keyof Operator`_ is an object type operator in TypeScript that generates a union type of string and numeric literal types from the keys of an existing object type. It allows you to extract the keys of an object type or interface as a union type.<br>

>TypeScript uses same concept of Javascript's `typeof` to pass a type of a parent variable to the child variable. <br>

>Indexed access types in TypeScript allow you to access the type of a specific property in an object type. This feature enhances type safety by enabling you to work directly with the type of a property of an object.

```ts {1-5|7-8|10-13} twoslash
type T = {
    a: string;
    b: number;
};
type U = keyof T;

let firstName = "Bravo";
let lastName: typeof firstName;

type Person = {
  name: string;
}
type NameType = Person["name"]; // NameType is string
```

---
transition: slide-up
level: 2
---

# The End.

## Thank You for Listening. <br> <br>

>- Stanley Azi