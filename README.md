# CrxOop
Bringing Object Oriented Programming (classical), and Proper Prototype Based Programming, To Javascript

Supported Features (classical OOP):

- Classes.
- Class public constructors.
- Class public and private variables. Public variables are supported on roughly IE9 era browsers and later.
- Class public, protected and private functions.
- Class public virtual, protected virtual, and private virtual functions, including support for "finals" and pure virtual functions. Pure virtual functions can not be finals. 
- Casting.
- Data Typing. See also Class Typing. 
- Class public and private static variables. Private static variables are supported on roughly IE9 era browsers and later.
- Class public and private constants. Private constants are supported on roughly IE9 era browsers and later.
- Class public and private static functions. These are supported in roughly IE9 era browsers and later. More precisely, from the IE family, IE8 and earlier will not work, and from the Safari family, only Safari running on very recent MAC OS versions will work. Further more, these only work in the Non Strict JS version of the library. 
- Friend Classes.
- Abstract Classes.
- Anonymous Classes.
- Interfaces (a Class with only public pure virtual methods).


V1.4 of the library introduces a formalization of Prototype Based Programming, or as this author likes to call it, Prototype Object Based Programming (POBP).

Supported Features (POBP):

- Shared Public Scope (Variable): When a variable member has this scope, it is equivalent to setting the variable on 'this' in the constructor function when coding using plain javascript. Hence, the word 'shared' in the scope name. The variable is visible to all inheriting structures, and only one copy of it exists per instance. Shared public variables are supported on roughly IE9 era browsers and later. 
- Shared Public Scope (Function): When a function member has this scope, it is equivalent to setting the function on the prototype of the constructor function when coding using plain javascript. One, hence the word 'shared'. Two, there exists only one data entry for each function global to all objects of a particular prototype based data type. This would be contrary to setting the function on 'this' in the constructor function when coding using plain javascript. 
- Shared Private Scope (Variables and Functions): When a variable member, or a function member, has this scope the member can only be accessed on 'this'. If a structure 'A' defines the member 'x' with this scope, then only functions of 'A' can see 'x'. 'x' is private to 'A'. However, note the word 'shared'. If Structure 'B' inherits structure 'A', then functions of 'B' also have access to 'x'. But not only that, but also if 'A' itself inherits 'C', then functions of 'C' can also see 'x'. In other words, exactly like the shared public scope case, but only members of the structure chain of the instance may see 'x'. It should be noted, that this privacy is across instances, like in OOP. Refer to the structure keyword 'O' in the documentation. Shared private variables are supported on roughly IE9 era browsers and later. 
- Private Scope (Variables and Functions): When a variable member, or a function member, has this scope the member can only be accessed on functions of the same structure. This is usualy enforced in plain javascript by declaring each such members as 'var' in the constructor function taking advantage of closures. However, unlike the plain javascript case, this privacy is across structure instances. Refer to the structure keyword 'O' in the documentation. 
- Public Constructors: The public scope is supported for constructors only. The scope, and constructors act as expected when coding using plain javascript, but with the added benefit of the guaranteed default constructor invocation like in the OOP case. 
- Multiple Inheritance. 
- Data Typing. See also Structrure Typing. 
- Iteration using the native javascript built "for in" loop mechanism. CrxOop provides HASOWN(), an equivalent to the built in hasOwnProperty().


For details and documentation refer to http://EyeAndTea.com